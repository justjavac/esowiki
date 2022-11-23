import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import tailwind from "@astrojs/tailwind";
import deno from "@astrojs/deno";
import mdx from "@astrojs/mdx";
import rehypeExternalLinks from "rehype-external-links";

export default defineConfig({
  site: "https://eso.denohub.com",
  markdown: {
    rehypePlugins: [
      [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer", "nofollow"] }],
    ],
  },
  integrations: [
    preact(),
    tailwind(),
    mdx(),
  ],
  output: "server",
  adapter: deno(),
});
