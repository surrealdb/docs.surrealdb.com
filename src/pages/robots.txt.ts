import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
    const site = import.meta.env.SITE || 'https://surrealdb.com';
    const base = '/docs';
    
    const robotsTxt = `
User-agent: *
Allow: ${base}/
Disallow: ${base}/2.x/surrealql/
Disallow: ${base}/3.x/surrealql/
Disallow: ${base}/2.x/
Disallow: ${base}/3.x/

Sitemap: ${site}${base}/sitemap.xml
`.trim();

    return new Response(robotsTxt, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    });
};

