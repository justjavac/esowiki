import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import deno from "@astrojs/deno";
import sitemap from "@astrojs/sitemap";
import rehypeExternalLinks from "rehype-external-links";
// import rehypeUnreachableLink from "@/utils/rehypeUnreachableLink";

export default defineConfig({
  site: "https://eso.denohub.com",
  markdown: {
    extendDefaultPlugins: true,
    rehypePlugins: [
      [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer", "nofollow"] }],
      // rehypeUnreachableLink,
    ],
  },
  integrations: [
    preact({ compat: true }),
    tailwind(),
    mdx(),
    sitemap(),
  ],
  output: "server",
  adapter: deno(),
});
