/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly SITE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "micromark-extension-wiki-link";
declare module "mdast-util-wiki-link";
