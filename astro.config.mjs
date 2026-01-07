import mdx from '@astrojs/mdx';
import solidJs from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import compress from 'astro-compress';
import icon from 'astro-icon';
// @ts-check
import { defineConfig } from 'astro/config';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkCustomHeadingId from 'remark-custom-heading-id';
import { rehypeCodemirrorPlugin } from './src/util/rehypeCodemirrorPlugin.mjs';
import { rehypeCopyCodePlugin } from './src/util/rehypeCopyCodePlugin.mjs';
import { autolinkConfig } from './src/util/rehypeHeadingsConfig';
import { rehypeNotesPlugin } from './src/util/rehypeNotesPlugin.mjs';

import sitemap from '@astrojs/sitemap';

const deployDomain = import.meta.env.DEPLOY_DOMAIN ?? 'surrealdb.com';
const site = `https://${deployDomain}`;

// https://astro.build/config
export default defineConfig({
    site,
    base: '/docs',
    outDir: './dist/docs',
    trailingSlash: 'never',
    integrations: [
        mdx(),
        solidJs({ devtools: true }),
        icon(),
        tailwind({
            nesting: true,
        }),
        compress({
            Image: false,
        }),
        sitemap({
            // Exclude versioned SurrealQL routes from sitemap (only include latest)
            // These routes redirect, so they shouldn't be in the sitemap
            filter: (page) => {
                try {
                    // Handle undefined or null pages - this is critical to prevent reduce errors
                    if (!page || typeof page !== 'string') {
                        return false;
                    }
                    // Exclude /docs/2.x/surrealql/** and /docs/3.x/surrealql/**
                    // These are versioned routes that redirect to latest
                    const shouldExclude =
                        /\/docs\/(?:2\.x|3\.x)\/surrealql/.test(page);
                    return !shouldExclude;
                } catch (error) {
                    // If anything goes wrong, exclude the page to prevent build errors
                    console.warn(
                        '[Sitemap] Error filtering page:',
                        page,
                        error
                    );
                    return false;
                }
            },
        }),
    ],
    markdown: {
        remarkPlugins: [remarkCustomHeadingId],
        rehypePlugins: [
            rehypeCodemirrorPlugin,
            rehypeNotesPlugin,
            rehypeSlug,
            [rehypeAutolinkHeadings, autolinkConfig],
            rehypeCopyCodePlugin,
        ],
        syntaxHighlight: false,
    },
});
