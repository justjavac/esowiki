/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly SITE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "remark-attr";
