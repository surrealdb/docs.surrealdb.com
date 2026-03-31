import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Surreal } from "surrealdb";

const SCHEMA_PATH = join(import.meta.dirname, "../search/schema.surql");

async function main() {
    const endpoint = process.env.SURREAL_ENDPOINT ?? "ws://localhost:8000";
    const namespace = process.env.SURREAL_NAMESPACE ?? "main";
    const database = process.env.SURREAL_DATABASE ?? "main";
    const username = process.env.SURREAL_USERNAME ?? "root";
    const password = process.env.SURREAL_PASSWORD ?? "root";

    const schema = await readFile(SCHEMA_PATH, "utf-8");

    const db = new Surreal();

    db.subscribe("connected", () => console.log("[DB] Connected"));
    db.subscribe("disconnected", () => console.log("[DB] Disconnected"));
    db.subscribe("error", (e) => console.error("[DB] Error", e));

    await db.connect(endpoint, { namespace, database });
    await db.signin({ username, password });

    console.log("[SC] Applying schema...");
    await db.query(schema).collect();
    console.log("[SC] Schema applied successfully");

    await db.close();
}

main().catch((err) => {
    console.error("[FATAL]", err);
    process.exit(1);
});
