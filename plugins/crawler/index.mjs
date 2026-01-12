import fs from 'node:fs';
import path from 'node:path';
import { cwd } from 'node:process';
import { parse as parseHTML } from 'node-html-parser';
import Surreal, { RecordId, surql } from 'surrealdb';
import { parseStringPromise } from 'xml2js';

const OLLAMA_URL = process.env.OLLAMA_URL ?? 'http://localhost:11434';
const OLLAMA_MODEL =
    process.env.OLLAMA_MODEL ?? 'jina/jina-embeddings-v2-base-en';

async function embedOne(text) {
    const res = await fetch(`${OLLAMA_URL}/api/embed`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            model: OLLAMA_MODEL,
            input: text,
            truncate: true,
        }),
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Ollama embed failed: ${res.status} ${msg}`);
    }

    const data = await res.json();
    return data.embeddings?.[0];
}

export async function onSuccess() {
    const applyIndexes =
        process.env.DEPLOY_URL !== 'https://0--surrealdb-docs.netlify.app';
    const jobDate = new Date();
    const db = new Surreal();

    db.emitter.subscribe('connected', () =>
        console.log('[DB] Connected to SurrealDB')
    );
    db.emitter.subscribe('disconnected', () =>
        console.log('[DB] Disconnected from SurrealDB')
    );
    db.emitter.subscribe('error', (e) => console.log('[DB] Error occurred', e));

    if (applyIndexes)
        await db.connect(process.env.SURREAL_ENDPOINT, {
            namespace: process.env.SURREAL_NAMESPACE,
            database: process.env.SURREAL_DATABASE,
            auth: {
                namespace: process.env.SURREAL_NAMESPACE,
                database: process.env.SURREAL_DATABASE,
                username: process.env.SURREAL_USERNAME,
                password: process.env.SURREAL_PASSWORD,
            },
        });

    const buildDir = `${cwd()}/dist`;
    const deployUrl = new URL(process.env.DEPLOY_PRIME_URL);
    const hostname = deployUrl.hostname;
    const sitemapPath = `${buildDir}/docs/sitemap-0.xml`;
    console.log(`[CW] Build dir is: "${buildDir}"`);
    console.log(`[CW] Deploy URL is: "${deployUrl}"`);
    console.log(`[CW] Sitemap path is: "${sitemapPath}"`);

    const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');
    const sitemap = await parseStringPromise(sitemapXml);
    const urls = sitemap.urlset.url;
    console.log(`[CW] The sitemap contains ${urls.length} url(s)`);

    const pathnames = urls.map((url) => {
        let pathname = decodeURI(new URL(url.loc[0]).pathname);
        if (pathname.endsWith('/')) pathname = pathname.slice(0, -1);
        return pathname;
    });
    const chunkSize = 1;

    for (let i = 0; i < pathnames.length; i += chunkSize) {
        const chunk = pathnames.slice(i, i + chunkSize);
        await Promise.all(
            chunk.map(async (pathname, index) => {
                console.log(
                    `[CW] Crawling page ${index + i + 1}/${pathnames.length}: ${pathname}`
                );

                const filePath = path.join(buildDir, pathname, 'index.html');
                const fileContent = fs
                    .readFileSync(filePath, 'utf-8')
                    .replace(/\0/g, '');

                if (!fileContent)
                    throw new Error(`[CW] Failed to read file "${filePath}"`);

                const document = parseHTML(fileContent, {
                    blockTextElements: {
                        script: true,
                        style: true,
                        noscript: true,
                    },
                });

                const scrapByQuerySelector = (query, blockContent) =>
                    document
                        .querySelectorAll(query)
                        .map((el) => {
                            const block = blockContent?.(el) ?? el.textContent;
                            if (!block) return;

                            const parts = block.split(/\s+/);
                            const trimmedParts = parts.filter(Boolean); // This removes any empty strings
                            const trimmedBlock = trimmedParts.join(' ');
                            if (trimmedBlock.length > 0) return trimmedBlock;
                        })
                        .filter((a) => a);

                const title = document.querySelector('title').textContent;
                const description = document
                    .querySelector('meta[name=description]')
                    .getAttribute('content');
                const h1 = scrapByQuerySelector('.flag-page-content h1');
                const h2 = scrapByQuerySelector('.flag-page-content h2');
                const h3 = scrapByQuerySelector('.flag-page-content h3');
                const h4 = scrapByQuerySelector('.flag-page-content h4');
                const code = scrapByQuerySelector(
                    '.flag-page-content code',
                    (el) =>
                        [...el.childNodes]
                            .map((el) => el.textContent)
                            .join('\n')
                );
                const content = [
                    ...scrapByQuerySelector(
                        ['p', 'h5', 'h6', 'tr', 'th', 'td']
                            .map((tag) => `.flag-page-content ${tag}`)
                            .join(', ')
                    ),
                    ...h1,
                    ...h2,
                    ...h3,
                    ...h4,
                    ...code,
                ];

                if (applyIndexes && content.length > 0) {
                    const start = Date.now();
                    const subject = new RecordId('page', [hostname, pathname]);

                    console.log(`[IX] Indexing "${subject}"`);

                    // Take only the first N content blocks to avoid huge pages.
                    // content includes paragraphs/tables/headings/code in your current build.
                    const MAX_BLOCKS = Number(process.env.EMBED_MAX_BLOCKS ?? 60);

                    const importantBlocks = [
                        `Title: ${title ?? ''}`,
                        `Description: ${description ?? ''}`,
                        // headings are already arrays of strings
                        ...(h1?.length ? [`H1: ${h1.join(' | ')}`] : []),
                        ...(h2?.length ? [`H2: ${h2.join(' | ')}`] : []),
                        ...(h3?.length ? [`H3: ${h3.join(' | ')}`] : []),
                        ...(h4?.length ? [`H4: ${h4.join(' | ')}`] : []),

                        // add *some* body text (this is the big quality win)
                        ...content.slice(0, MAX_BLOCKS).map((b) => `Body: ${b}`),
                    ].filter(Boolean);

                    const embeddingText = `passage: ${importantBlocks.join('\n')}`;

                    let embedding = null;
                    try {
                        embedding = await embedOne(embeddingText);
                    } catch (e) {
                        console.log(`[IX] Embedding failed for "${subject}"`, e);
                        // You can decide: throw to fail the job, or proceed without embedding
                    }

                    await db.upsert(subject, {
                        title,
                        description,
                        path: pathname,
                        hostname,
                        h1,
                        h2,
                        h3,
                        h4,
                        content,
                        code,
                        embedding,
                        date: jobDate,
                    });

                    const elapsed = Date.now() - start;
                    console.log(`[IX] Took ${elapsed}ms to index "${subject}"`);
                } else {
                    console.log('[IX] Skipping indexing, not on prod');
                }
            })
        );
    }

    if (applyIndexes) {
        console.log('[CW] Removing stale pages');
        await db.query(
            surql`
                DELETE page WHERE
                    hostname = ${hostname} AND
                    (date IS NONE OR date < ${jobDate})
            `
        );
    } else {
        console.log('[CW] Skipping stale page removal, not on prod');
    }

    console.log('[CW] Closing connection to SurrealDB');
    await db.close();
}
