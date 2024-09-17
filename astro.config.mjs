import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import solidJs from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import compress from 'astro-compress';
import icon from 'astro-icon';
// @ts-check
import { defineConfig } from 'astro/config';
import remarkCustomHeadingId from 'remark-custom-heading-id';
import { rehypeCodemirrorPlugin } from './src/util/rehypeCodemirrorPlugin.mjs';
import { rehypeNotesPlugin } from './src/util/rehypeNotesPlugin.mjs';

const deployDomain = process.env.DEPLOY_DOMAIN ?? 'surrealdb.com';
const site = `https://${deployDomain}`;

// https://astro.build/config
export default defineConfig({
    site,
    base: '/docs',
    outDir: './dist/docs',
    trailingSlash: 'never',
    integrations: [
        mdx({ remarkPlugins: [remarkCustomHeadingId] }),
        solidJs({ devtools: true }),
        icon(),
        tailwind({
            nesting: true,
        }),
        partytown(),
        compress({
            Image: false,
        }),
    ],
    markdown: {
        rehypePlugins: [rehypeCodemirrorPlugin, rehypeNotesPlugin],
        syntaxHighlight: false,
    },
});
