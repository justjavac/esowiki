import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import tailwind from "@astrojs/tailwind";
import deno from "@astrojs/deno";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://eso.denohub.com",
  integrations: [preact(), tailwind(), mdx()],
  output: "server",
  adapter: deno(),
});
