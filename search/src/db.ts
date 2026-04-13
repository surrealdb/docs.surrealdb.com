import { Surreal } from "surrealdb";

interface ConnectOptions {
    logging?: boolean;
}

/**
 * Creates a fresh SurrealDB connection using environment variables.
 * Used by both the search handler (query-time) and the indexer
 * (index-time). Defaults to a local instance with root credentials.
 */
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

// Singleton connection for the search handler. The promise is
// cached so concurrent requests share one connection rather
// than opening a new WebSocket per query. If the initial
// connection fails the promise is cleared so the next caller
// retries.
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
