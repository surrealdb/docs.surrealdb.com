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
        sitemap(),
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
    vite: {
        ssr: {
            noExternal: [
                '@codemirror/language',
                '@codemirror/lang-sql',
                '@codemirror/legacy-modes',
                '@lezer/common',
                '@lezer/highlight',
                '@lezer/javascript',
                '@lezer/json',
                '@lezer/go',
                '@lezer/php',
                '@lezer/python',
                '@lezer/rust',
                '@lezer/yaml',
                '@fig/lezer-bash',
                'lezer-toml',
                '@surrealdb/lezer',
            ],
        },
    },
});
