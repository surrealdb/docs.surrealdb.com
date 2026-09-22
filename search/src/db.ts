import { Surreal } from "surrealdb";

interface ConnectOptions {
    logging?: boolean;
}

/**
 * Creates a fresh SurrealDB connection using environment variables.
 * Used by both the search handler (query-time) and the indexer
 * (index-time). Defaults to a local instance with root credentials.
 */
/**
 * How long to wait for a connection before giving up.
 *
 * A wrong or unreachable endpoint otherwise hangs rather than failing: the
 * Cloudflare Workers runtime cancels a request whose handler never resolves
 * and logs "your Worker's code had hung", which says nothing about the
 * database. A rejected promise becomes an ordinary 500 with the cause in the
 * logs, and `getDb` clears the cached promise so the next request retries.
 */
const CONNECT_TIMEOUT_MS = 10_000;

/** True inside the Cloudflare Workers runtime, which sets this user agent. */
function isWorkers(): boolean {
    return typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";
}

export async function connectDb(options: ConnectOptions = {}): Promise<Surreal> {
    const endpoint = process.env.SURREAL_ENDPOINT ?? "ws://localhost:8000";

    // The SDK picks its engine from the scheme: `ws`/`wss` open a socket,
    // `http`/`https` use plain fetch. Workers cannot open an outbound
    // WebSocket, and the SDK does not fail when it tries - it waits forever.
    // Caught here so the error names the setting instead of surfacing as a
    // hung request.
    if (isWorkers() && /^wss?:/i.test(endpoint)) {
        throw new Error(
            `SURREAL_ENDPOINT is "${endpoint}", but the Cloudflare Workers runtime cannot ` +
                "open an outbound WebSocket. Use the http(s) endpoint of the same instance, " +
                "which the SDK serves over its HTTP engine.",
        );
    }
    const namespace = process.env.SURREAL_NAMESPACE ?? "main";
    const database = process.env.SURREAL_DATABASE ?? "main";

    const db = new Surreal();

    if (options.logging) {
        db.subscribe("connected", () => console.log("[DB] Connected"));
        db.subscribe("disconnected", () => console.log("[DB] Disconnected"));
        db.subscribe("error", (e) => console.error("[DB] Error", e));
    }

    const username = process.env.SURREAL_USERNAME ?? "root";
    const password = process.env.SURREAL_PASSWORD ?? "root";

    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
        timer = setTimeout(
            () =>
                reject(
                    new Error(`Timed out connecting to ${endpoint} after ${CONNECT_TIMEOUT_MS}ms`),
                ),
            CONNECT_TIMEOUT_MS,
        );
    });

    try {
        await Promise.race([
            db.connect(endpoint, {
                namespace,
                database,
                authentication: () => ({ username, password }),
            }),
            timeout,
        ]);
    } finally {
        clearTimeout(timer);
    }

    return db;
}

// Singleton connection for the search handler. The promise is
// cached so concurrent requests share one connection rather
// than reconnecting per query. If the initial connection fails
// the promise is cleared so the next caller retries.
let singletonPromise: Promise<Surreal> | null = null;

export function getDb(): Promise<Surreal> {
    if (!singletonPromise) {
        singletonPromise = connectDb().catch((err) => {
            singletonPromise = null;
            throw err;
        });
    }
    return singletonPromise;
}
