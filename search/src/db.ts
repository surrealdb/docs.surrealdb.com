import { Surreal } from "surrealdb";

interface ConnectOptions {
    logging?: boolean;
}

export async function connectDb(options: ConnectOptions = {}): Promise<Surreal> {
    const endpoint = process.env.SURREAL_ENDPOINT ?? "ws://localhost:8000";
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

    await db.connect(endpoint, {
        namespace,
        database,
        authentication: () => ({ username, password }),
    });

    return db;
}

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
