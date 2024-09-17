// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import solidJs from "@astrojs/solid-js";
import icon from "astro-icon";
import tailwind from "@astrojs/tailwind";
import remarkCustomHeadingId from "remark-custom-heading-id";
import { rehypeCodemirrorPlugin } from "./src/util/rehypeCodemirrorPlugin.mjs";
import { rehypeNotesPlugin } from "./src/util/rehypeNotesPlugin.mjs";

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx({ remarkPlugins: [remarkCustomHeadingId] }),
    solidJs({ devtools: true }),
    icon(),
    tailwind(),
  ],
  base: "/docs",
  site: "https://surrealdb.com",
  markdown: {
    rehypePlugins: [rehypeCodemirrorPlugin, rehypeNotesPlugin],
    syntaxHighlight: false,
  },
});
