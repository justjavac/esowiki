import { micromark } from "micromark";
import type { HtmlExtension } from "micromark-util-types";
import { gfm, gfmHtml } from "micromark-extension-gfm";

export function md2html(md?: string, isBook = false): string {
  if (md == null) return "";

  if (isBook) {
    md = md.replace(/(?<!\n)\n(?!\n)/g, "<br/>");
  }

  return micromark(md, {
    allowDangerousHtml: true,
    extensions: [gfm()],
    htmlExtensions: [
      gfmHtml({
        clobberPrefix: "eso-",
        label: "脚注",
        backLabel: "回到内容区域",
      }),
      externalLinks(),
    ],
  });
}

/** TODO: */
function externalLinks(): HtmlExtension {
  return {
    enter: {},
    exit: {},
  };
}
