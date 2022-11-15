/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly PUBLIC_CDN_URL: string;
  readonly SITE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
