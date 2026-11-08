// Takes the screenshots in manifest.json that have a `shot`:
//
//   bun scripts/screenshots/capture.ts --sign-in   # open Studio to sign in and choose an organisation
//   bun scripts/screenshots/capture.ts             # take every screenshot that has a shot
//   bun scripts/screenshots/capture.ts NAME ...    # take only these screenshots
//   bun scripts/screenshots/capture.ts --connect   # add the local database connection to the profile
//
// The browser profile lives in generated/screenshots/profile, which git
// ignores, so a sign-in lasts until SurrealDB Cloud ends the session. With
// --sign-in, sign in, open the organisation the screenshots should show, and
// close the window: the organisation open at that moment is the one used.
// STUDIO_ORG overrides it, and STUDIO_URL points the script at another build
// of Studio, such as a local development server.
//
// Screens of a database use a self-hosted connection to a local server, which
// --connect adds to the organisation. Studio keeps connections in the browser
// profile, not in SurrealDB Cloud, so this changes nothing in the account.
// Start the server first, for example
// `surreal start --bind 127.0.0.1:8199 --user root --pass secret memory`, or set
// SCREENSHOT_DB to another address. Before a shot with a `seed`, the script
// empties the database `main` in the namespace `main` and runs the seed file
// from scripts/screenshots/seeds against it, so each shot starts from the same
// data. A shot's path can contain `{connection}`, which becomes the
// connection's id.
//
// Screenshots are taken in dark mode at twice the pixel density, to match the
// rest of the docs. A shot never submits a form: it fills in example values
// and captures the result before anything is sent.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { type BrowserContext, chromium, type Page } from "playwright-core";

type Step =
    | { click: string }
    | { clickSelector: string }
    | { type: string }
    | { press: string }
    | { hover: string }
    | { fill: [label: string, value: string] }
    | { waitFor: string }
    | { pause: number };

interface Shot {
    path: string;
    seed?: string;
    theme?: "dark" | "light";
    steps?: Step[];
    clip?: string;
    viewport?: { width: number; height: number };
}

interface Entry {
    capture: string;
    shot?: Shot;
}

const ROOT = join(import.meta.dir, "../..");
const IMG = join(ROOT, "src/assets/img");
const STATE = join(ROOT, "generated/screenshots");
const PROFILE = join(STATE, "profile");
const ORG_FILE = join(STATE, "organisation");
const CONNECTION_FILE = join(STATE, "connection");
const DB = process.env.SCREENSHOT_DB ?? "http://localhost:8199";
const STUDIO = process.env.STUDIO_URL ?? "https://studio.surrealdb.com";

const args = process.argv.slice(2);
mkdirSync(STATE, { recursive: true });

if (args.includes("--sign-in")) {
    const context = await chromium.launchPersistentContext(PROFILE, {
        channel: "chrome",
        headless: false,
        viewport: null,
    });
    const page = context.pages()[0] ?? (await context.newPage());
    await page.goto(STUDIO);
    console.log("Sign in, open the organisation to use for screenshots, then close the window.");

    // The first path segment of an organisation's pages is its id.
    let org: string | undefined;
    const timer = setInterval(() => {
        const segment = new URL(page.url()).pathname.split("/")[1];
        if (segment && /\d/.test(segment) && /^[0-9a-z]{8,}$/i.test(segment)) org = segment;
    }, 500);
    // On macOS, closing the last window leaves Chrome running, so wait for the
    // page to close rather than the browser.
    await new Promise((resolve) => {
        page.on("close", resolve);
        context.on("close", resolve);
    });
    clearInterval(timer);
    await context.close().catch(() => {});

    if (org) {
        writeFileSync(ORG_FILE, `${org}\n`);
        console.log(`Screenshots will show organisation ${org}.`);
    } else {
        console.log("No organisation was open when the window closed, so none was recorded.");
    }
    process.exit(0);
}

// An HTTPS page needs the local network access permission to reach a server
// on localhost.
async function allowLocalNetwork(context: BrowserContext) {
    await context.grantPermissions(["local-network-access"], { origin: STUDIO });
}

const org =
    process.env.STUDIO_ORG ?? (existsSync(ORG_FILE) ? readFileSync(ORG_FILE, "utf8").trim() : "");
if (!org) {
    console.error("No organisation recorded. Run with --sign-in first, or set STUDIO_ORG.");
    process.exit(2);
}

if (args.includes("--connect")) {
    const context = await chromium.launchPersistentContext(PROFILE, {
        channel: "chrome",
        headless: true,
    });
    await allowLocalNetwork(context);
    const page = await context.newPage();
    await page.goto(`${STUDIO}/${org}/instances`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "More ways to add an instance" }).click();
    await page.getByText("Add self-hosted connection").click();
    const dialog = page.locator("[role=dialog]").first();
    const { protocol, host } = new URL(DB);
    await dialog.getByPlaceholder("Connection name").fill("Local");
    await dialog.getByLabel("Protocol").click();
    await page
        .getByRole("option", { name: protocol === "https:" ? "WSS" : "WS", exact: true })
        .click();
    await dialog.getByPlaceholder("example.com:8000").fill(host);
    await dialog.getByPlaceholder("admin").first().fill("root");
    await dialog.locator("input[type=password]").fill("secret");
    await dialog.getByRole("button", { name: "Create connection" }).click();
    await page.waitForURL(/\/connections\//);
    const id = new URL(page.url()).pathname.split("/").pop() ?? "";
    writeFileSync(CONNECTION_FILE, `${id}\n`);
    console.log(`Added connection ${id} to ${DB}.`);
    await context.close();
    process.exit(0);
}

const connection = existsSync(CONNECTION_FILE) ? readFileSync(CONNECTION_FILE, "utf8").trim() : "";

// Empty the database the shots use, then load a seed file into it.
async function seed(file: string) {
    const body = `REMOVE DATABASE IF EXISTS main; DEFINE DATABASE main; USE DB main; ${readFileSync(join(import.meta.dir, "seeds", file), "utf8")}`;
    const res = await fetch(`${DB}/sql`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "surreal-ns": "main",
            Authorization: `Basic ${btoa("root:secret")}`,
        },
        body: `DEFINE NAMESPACE IF NOT EXISTS main; USE NS main; ${body}`,
    });
    const results = (await res.json()) as { status: string; result: unknown }[];
    const failed = Array.isArray(results) ? results.find((r) => r.status !== "OK") : results;
    if (!res.ok || failed)
        throw new Error(`seed ${file} failed: ${JSON.stringify(failed ?? results)}`);
}

const manifest: Record<string, Entry> = JSON.parse(
    readFileSync(join(import.meta.dir, "manifest.json"), "utf8"),
);
const wanted = args.filter((a) => !a.startsWith("--"));
const shots = Object.entries(manifest).filter(
    ([image, entry]) => entry.shot && (wanted.length === 0 || wanted.includes(image)),
);

// Announcements and first-run tips that cover the page. They are hidden with
// CSS rather than closed, because closing one moves the layout and a second
// click can then land on something else, such as the account menu, which
// shows the signed-in user's name and email address.
const HIDE = [
    ".mantine-Alert-root:has(.mantine-Alert-closeButton)",
    ".mantine-Popover-dropdown",
    ".mantine-Menu-dropdown",
];

async function dismiss(page: Page) {
    await page.addStyleTag({ content: `${HIDE.join(", ")} { display: none !important; }` });
    await page.mouse.move(0, 0);
}

// Studio keeps its own light or dark setting in the profile and has no option
// to follow the system, so a shot switches it from the account menu when it
// differs. The menu is closed again before anything is captured.
async function setTheme(page: Page, theme: "dark" | "light") {
    const current = await page.evaluate(() =>
        document.documentElement.getAttribute("data-mantine-color-scheme"),
    );
    if (current === theme) return;
    await page.getByRole("button", { name: "Account menu" }).click();
    await page
        .getByText(theme === "light" ? "Switch to Light theme" : "Switch to Dark theme")
        .click();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
}

async function run(page: Page, step: Step) {
    if ("click" in step) await page.getByText(step.click, { exact: true }).first().click();
    else if ("clickSelector" in step) await page.locator(step.clickSelector).first().click();
    // Inserted rather than typed, so the editor does not add closing quotes and brackets.
    else if ("type" in step) await page.keyboard.insertText(step.type);
    else if ("press" in step) await page.keyboard.press(step.press);
    else if ("hover" in step) await page.locator(step.hover).first().hover();
    else if ("fill" in step) await page.getByLabel(step.fill[0]).first().fill(step.fill[1]);
    else if ("waitFor" in step) await page.getByText(step.waitFor).first().waitFor();
    else await page.waitForTimeout(step.pause);
}

const context = await chromium.launchPersistentContext(PROFILE, {
    channel: "chrome",
    headless: true,
    colorScheme: "dark",
    deviceScaleFactor: 2,
    viewport: { width: 1280, height: 800 },
});
await allowLocalNetwork(context);

let failed = 0;
for (const [image, { shot }] of shots) {
    if (!shot) continue;
    const page = await context.newPage();
    try {
        if (shot.viewport) await page.setViewportSize(shot.viewport);
        await page.emulateMedia({ colorScheme: shot.theme ?? "dark" });
        if (shot.seed) await seed(shot.seed);
        if (shot.path.includes("{connection}") && !connection)
            throw new Error("no connection recorded; run with --connect first");
        const path = shot.path.replace("{connection}", connection);
        await page.goto(`${STUDIO}/${org}${path}`, { waitUntil: "networkidle" });
        if (new URL(page.url()).pathname.split("/")[1] !== org) {
            throw new Error(
                `landed on ${page.url()}; the session may have ended, so run --sign-in again`,
            );
        }
        await setTheme(page, shot.theme ?? "dark");
        await dismiss(page);
        for (const step of shot.steps ?? []) await run(page, step);
        // Let entrance animations finish before capturing.
        await page.waitForTimeout(800);
        const target = shot.clip ? page.locator(shot.clip).first() : page.locator("body");
        // A screenshot must not show who took it.
        const text = await target.innerText();
        if (/[\w.+-]+@[\w-]+\.[\w.]+/.test(text))
            throw new Error("an email address is visible, so nothing was saved");
        await target.screenshot({ path: join(IMG, image), animations: "disabled" });
        console.log(`Took ${image}`);
    } catch (err) {
        failed++;
        console.error(`Could not take ${image}: ${err instanceof Error ? err.message : err}`);
    } finally {
        await page.close();
    }
}

await context.close();
if (shots.length === 0) console.log("No screenshot in manifest.json has a shot to take.");
if (failed) process.exit(1);
