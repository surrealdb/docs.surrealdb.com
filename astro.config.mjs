import mdx from '@astrojs/mdx';
import solidJs from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
// @ts-check
import { defineConfig } from 'astro/config';
import remarkCustomHeadingId from 'remark-custom-heading-id';
import { rehypeCodemirrorPlugin } from './src/util/rehypeCodemirrorPlugin.mjs';
import { rehypeNotesPlugin } from './src/util/rehypeNotesPlugin.mjs';
import partytown from '@astrojs/partytown';
import compress from 'astro-compress';

const deployDomain = process.env.DEPLOY_DOMAIN ?? 'surrealdb.com';
const site = `https://${deployDomain}`;

// https://astro.build/config
export default defineConfig({
    site,
    base: '/docs',
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
