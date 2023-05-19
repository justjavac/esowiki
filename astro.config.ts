import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import tailwind from "@astrojs/tailwind";
import deno from "@astrojs/deno";
import sitemap from "@astrojs/sitemap";
import rehypeExternalLinks from "rehype-external-links";
// import rehypeUnreachableLink from "@/utils/rehypeUnreachableLink";

export default defineConfig({
  site: "https://eso.denohub.com/",
  markdown: {
    gfm: true,
    rehypePlugins: [
      [
        rehypeExternalLinks,
        { target: "_blank", rel: ["noopener", "noreferrer", "nofollow"] },
      ],
      // rehypeUnreachableLink,
    ],
  },
  compressHTML: true,
  integrations: [
    preact({ compat: true }),
    tailwind(),
    sitemap({
      customPages: [
        "https://eso.denohub.com/news",
        "https://eso.denohub.com/quest",
        "https://eso.denohub.com/build",
        "https://eso.denohub.com/set",
        "https://eso.denohub.com/map/27",
        "https://eso.denohub.com/about",
        "https://eso.denohub.com/serverstatus",
        "https://eso.denohub.com/race",
        "https://eso.denohub.com/class",
        "https://eso.denohub.com/faction",
      ],
    }),
  ],
  output: "server",
  adapter: deno(),
});
