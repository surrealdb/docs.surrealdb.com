// Asks api.surrealdb.com to re-index the documentation search.
//
// Runs from CI after a merge into main, and by hand for a forced re-index.
// The endpoint was built to receive a GitHub webhook, so this signs the body
// the same way GitHub does: HMAC-SHA256 over the exact bytes sent, in the
// X-Hub-Signature-256 header. A workflow is not a webhook, so the event name
// and the ref are supplied here rather than by GitHub.
//
// Usage: bun run search:reindex
//
// Environment:
//   DOCS_WEBHOOK_SECRET   required, shared with the API's own secret
//   REINDEX_ENVIRONMENT   optional, "production" (default) or "staging"
//   REINDEX_URL           optional, a full URL that overrides the above
//   GITHUB_SHA            optional, recorded in the payload for the API log

import { createHmac } from "node:crypto";

const ENDPOINT_PATH = "/api/docs/v1/reindex";

/**
 * Resolved from REINDEX_ENVIRONMENT, which the workflow fills from its
 * workflow_dispatch input. A push carries no input, so the value arrives empty
 * and production is used — the same choice a merge should make.
 */
const HOSTS = {
    production: "https://api.surrealdb.com",
    staging: "https://api.staging.surrealdb.com",
} as const;

type Environment = keyof typeof HOSTS;

function isEnvironment(value: string): value is Environment {
    return value in HOSTS;
}

/**
 * REINDEX_URL wins, for local runs against a stub. Otherwise the environment
 * name picks a host, and an empty name means production.
 *
 * This lives here rather than in a workflow expression so it can be exercised.
 * A GitHub expression is untestable, and this workflow only ever runs after a
 * merge — there is no run on the pull request to catch a mistake in it.
 */
function resolveUrl(): string {
    const override = process.env.REINDEX_URL?.trim();
    if (override) return override;

    const name = process.env.REINDEX_ENVIRONMENT?.trim() ?? "";
    if (!name) return `${HOSTS.production}${ENDPOINT_PATH}`;

    if (!isEnvironment(name)) {
        // Never fall back to production for a typo: re-indexing the wrong
        // environment is quiet and confusing.
        fail(
            `REINDEX_ENVIRONMENT is "${name}". Expected one of: ${Object.keys(HOSTS).join(", ")}.`,
        );
    }

    return `${HOSTS[name]}${ENDPOINT_PATH}`;
}

/** The only ref the endpoint acts on. Anything else is discarded with a 202. */
const INDEXED_REF = "refs/heads/main";

/** An index run of an unchanged corpus is seconds; a cold rebuild is minutes. */
const REQUEST_TIMEOUT_MS = 30_000;

/** Retries cover a busy lease, a rate limit, and a rolling deploy. */
const MAX_ATTEMPTS = 5;
const RETRY_DELAY_MS = 20_000;

interface ReindexResponse {
    success?: boolean;
    accepted?: boolean;
    reason?: string;
    message?: string;
}

function log(message: string): void {
    console.log(`[RX] ${message}`);
}

function fail(message: string): never {
    console.error(`[RX] ${message}`);
    process.exit(1);
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * The signature covers these exact bytes, so the string is built once and both
 * signed and sent. Re-serialising the object would reorder keys and give a 401.
 */
function buildPayload(): string {
    return JSON.stringify({
        ref: INDEXED_REF,
        after: process.env.GITHUB_SHA?.trim() || "manual",
    });
}

function signPayload(body: string, secret: string): string {
    return `sha256=${createHmac("sha256", secret).update(body, "utf8").digest("hex")}`;
}

async function post(url: string, body: string, signature: string): Promise<Response> {
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-GitHub-Event": "push",
            "X-Hub-Signature-256": signature,
        },
        body,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
}

async function readBody(response: Response): Promise<ReindexResponse> {
    try {
        return (await response.json()) as ReindexResponse;
    } catch {
        return {};
    }
}

const secret = process.env.DOCS_WEBHOOK_SECRET;

if (!secret) {
    fail("DOCS_WEBHOOK_SECRET is not set. Add it as a repository secret.");
}

const url = resolveUrl();
const payload = buildPayload();
const signature = signPayload(payload, secret);

log(`Requesting a re-index at ${url}`);

let lastStatus = 0;

for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let response: Response;

    try {
        response = await post(url, payload, signature);
    } catch (err: unknown) {
        // A transport failure or the 30s timeout. Both are worth another try.
        const reason = err instanceof Error ? err.message : String(err);
        log(`Attempt ${attempt} could not reach the endpoint: ${reason}`);

        if (attempt === MAX_ATTEMPTS) {
            fail("The endpoint was unreachable on every attempt.");
        }

        await sleep(RETRY_DELAY_MS);
        continue;
    }

    lastStatus = response.status;
    const body = await readBody(response);

    if (response.status === 202) {
        if (body.accepted === true) {
            log(`An index run has started (reason: ${body.reason ?? "unknown"}).`);
            process.exit(0);
        }

        // The endpoint took the delivery and discarded it. That means this
        // script sent the wrong event name or the wrong ref, which is a bug
        // here rather than a transient failure — do not retry it.
        fail(
            `The endpoint discarded the request (reason: ${body.reason ?? "unknown"}). ` +
                `Check the X-GitHub-Event header and the ref in the payload.`,
        );
    }

    if (response.status === 401) {
        fail(
            "The endpoint rejected the signature. DOCS_WEBHOOK_SECRET here does not " +
                "match the secret the API holds.",
        );
    }

    if (response.status === 503) {
        fail(
            "The endpoint has no secret configured, so the search is disabled there. " +
                "Check DOCS_WEBHOOK_SECRET on the API deployment.",
        );
    }

    const retryable = response.status === 409 || response.status === 429 || response.status >= 500;

    if (!retryable) {
        fail(`The endpoint answered ${response.status}: ${body.message ?? "no message"}`);
    }

    if (attempt < MAX_ATTEMPTS) {
        const note =
            response.status === 409 ? "another index run holds the lease" : "the endpoint is busy";
        log(`Attempt ${attempt} got ${response.status} — ${note}. Waiting to try again.`);
        await sleep(RETRY_DELAY_MS);
    }
}

// Every attempt was retryable and none succeeded.
if (lastStatus === 409) {
    // The other run reads the same main, so this content reaches the index
    // through that run. Nothing is lost, so do not fail the workflow.
    log("An index run was in progress on every attempt. It covers this commit too.");
    process.exit(0);
}

fail(`The endpoint answered ${lastStatus} on every attempt.`);
