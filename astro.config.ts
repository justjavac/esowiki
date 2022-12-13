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
    sitemap({
      customPages: [
        "https://eso.denohub.com/news",
        "https://eso.denohub.com/quest",
        "https://eso.denohub.com/build",
        "https://eso.denohub.com/addon",
        "https://eso.denohub.com/set",
        "https://eso.denohub.com/map/27",
        "https://eso.denohub.com/about",
        "https://eso.denohub.com/serverstatus",
      ],
    }),
  ],
  output: "server",
  adapter: deno(),
});
