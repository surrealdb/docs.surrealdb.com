import type { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { Surreal } from "surrealdb";

export const handler: Handler = async (event: APIGatewayProxyEvent) => {
    const body = JSON.parse(event.body || "{}");
    
    if (!body.hostname && !body.query) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing required fields" })
        };
    }

    if (
        !process.env.SURREAL_ENDPOINT ||
        !process.env.SURREAL_USERNAME ||
        !process.env.SURREAL_PASSWORD ||
        !process.env.SURREAL_NAMESPACE ||
        !process.env.SURREAL_DATABASE
    ) {
        console.error("Missing environment variables");
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error" })
        }
    }

    const db = new Surreal();
    try {
        await db.connect(process.env.SURREAL_ENDPOINT, {
            namespace: process.env.SURREAL_NAMESPACE,
            database: process.env.SURREAL_DATABASE,
            auth: {
                namespace: process.env.SURREAL_NAMESPACE,
                database: process.env.SURREAL_DATABASE,
                username: process.env.SURREAL_USERNAME,
                password: process.env.SURREAL_PASSWORD
            }
        });
    } catch (e) {
        console.error("Failed to connect to surrealdb", e);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error" })
        }
    }

    try {
        const results = await db.run("fn::search", [body.hostname, body.query]);
        return {
            statusCode: 200,
            body: JSON.stringify(results)
        };
    } catch (e) {
        console.error("Failed to search", e);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error" })
        }
    }
}