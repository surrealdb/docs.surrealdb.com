import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { connectDb } from "../src/db";

const SCHEMA_PATH = join(import.meta.dirname, "../schema.surql");

async function main() {
    const schema = await readFile(SCHEMA_PATH, "utf-8");
    const db = await connectDb({ logging: true });

    console.log("[SC] Applying schema...");
    await db.query(schema).collect();
    console.log("[SC] Schema applied successfully");

    await db.close();
}

main().catch((err) => {
    console.error("[FATAL]", err);
    process.exit(1);
});
