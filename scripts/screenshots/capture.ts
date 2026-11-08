// Takes the screenshots in manifest.json that have a `shot`:
//
//   bun scripts/screenshots/capture.ts --sign-in   # open Studio to sign in and choose an organisation
//   bun scripts/screenshots/capture.ts             # take every screenshot that has a shot
//   bun scripts/screenshots/capture.ts NAME ...    # take only these screenshots
//
// The browser profile lives in generated/screenshots/profile, which git
// ignores, so a sign-in lasts until SurrealDB Cloud ends the session. With
// --sign-in, sign in, open the organisation the screenshots should show, and
// close the window: the organisation open at that moment is the one used.
// STUDIO_ORG overrides it, and STUDIO_URL points the script at another build
// of Studio, such as a local development server.
//
// Screenshots are taken in dark mode at twice the pixel density, to match the
// rest of the docs. A shot never submits a form: it fills in example values
// and captures the result before anything is sent.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium, type Page } from "playwright-core";

type Step =
    | { click: string }
    | { fill: [label: string, value: string] }
    | { waitFor: string }
    | { pause: number };

interface Shot {
    path: string;
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

const org =
    process.env.STUDIO_ORG ?? (existsSync(ORG_FILE) ? readFileSync(ORG_FILE, "utf8").trim() : "");
if (!org) {
    console.error("No organisation recorded. Run with --sign-in first, or set STUDIO_ORG.");
    process.exit(2);
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

async function run(page: Page, step: Step) {
    if ("click" in step) await page.getByText(step.click, { exact: true }).first().click();
    else if ("fill" in step) await page.getByLabel(step.fill[0]).first().fill(step.fill[1]);
    else if ("waitFor" in step)
        await page.getByText(step.waitFor, { exact: true }).first().waitFor();
    else await page.waitForTimeout(step.pause);
}

const context = await chromium.launchPersistentContext(PROFILE, {
    channel: "chrome",
    headless: true,
    colorScheme: "dark",
    deviceScaleFactor: 2,
    viewport: { width: 1280, height: 800 },
});

let failed = 0;
for (const [image, { shot }] of shots) {
    if (!shot) continue;
    const page = await context.newPage();
    try {
        if (shot.viewport) await page.setViewportSize(shot.viewport);
        await page.goto(`${STUDIO}/${org}${shot.path}`, { waitUntil: "networkidle" });
        if (new URL(page.url()).pathname.split("/")[1] !== org) {
            throw new Error(
                `landed on ${page.url()}; the session may have ended, so run --sign-in again`,
            );
        }
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
