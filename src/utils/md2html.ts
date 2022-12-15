import { micromark } from "micromark";
import type { HtmlExtension } from "micromark-util-types";
import { gfm, gfmHtml } from "micromark-extension-gfm";

export function md2html(md: string): string {
  return micromark(md, {
    allowDangerousHtml: true,
    extensions: [gfm()],
    htmlExtensions: [gfmHtml(), externalLinks()],
  });
}

/** TODO: */
function externalLinks(): HtmlExtension {
  return {
    enter: {},
    exit: {},
  };
}
