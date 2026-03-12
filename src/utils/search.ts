export interface Doc {
    url: string;
    title: string;
    description: string;
    content: string[];
    score: number;
    hostname: string;
}

export async function searchDocs(keywords: string): Promise<Doc[]> {
    const params = new URLSearchParams({
        hostname: getHostname(),
        query: keywords,
    });

    return await fetch(`https://surrealdb.com/api/docs/search?${params}`)
        .then((res) => res.json())
        .then((data) => data ?? []);
}

function getHostname() {
    const mapped: Record<string, string> = {
        "surrealdb.com": "main--surrealdb-docs.netlify.app",
        "www.surrealdb.com": "main--surrealdb-docs.netlify.app",
        "docs.surrealdb.com": "main--surrealdb-docs.netlify.app",
        "surrealdb-docs.netlify.app": "main--surrealdb-docs.netlify.app",
        localhost: "main--surrealdb-docs.netlify.app",
    };

    return mapped[location.hostname] || location.hostname;
}
