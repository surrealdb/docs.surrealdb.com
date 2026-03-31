import { SignJWT } from "jose";
import { Surreal } from "surrealdb";

async function createJwtToken(
    namespace: string,
    database: string,
    accessName: string,
    accessKey: string,
): Promise<string> {
    const secret = new TextEncoder().encode(accessKey);
    return new SignJWT({
        NS: namespace,
        DB: database,
        AC: accessName,
        RL: ["Viewer"],
    })
        .setProtectedHeader({ alg: "HS512" })
        .setIssuedAt()
        .setExpirationTime("5m")
        .sign(secret);
}

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

    const accessName = process.env.SURREAL_ACCESS_NAME;
    const accessKey = process.env.SURREAL_ACCESS_KEY;

    if (accessName && accessKey) {
        const token = await createJwtToken(namespace, database, accessName, accessKey);

        await db.connect(endpoint, {
            versionCheck: false,
            namespace,
            database,
            authentication: token,
        });
    } else {
        const username = process.env.SURREAL_USERNAME ?? "root";
        const password = process.env.SURREAL_PASSWORD ?? "root";

        await db.connect(endpoint, { namespace, database });
        await db.signin({ username, password });
    }

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
