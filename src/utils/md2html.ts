import { micromark } from "micromark";
import type { Extension, HtmlExtension } from "micromark-util-types";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toString } from "mdast-util-to-string";

export function md2html(md?: string, isBook = false): string {
  if (md == null) return "";

  if (isBook) {
    md = md.replace(/(?<!\n)\n(?!\n)/g, "<br/>");
  }

  return micromark(md, {
    allowDangerousHtml: true,
    extensions: [gfm(), externalLinks()],
    htmlExtensions: [
      gfmHtml({
        clobberPrefix: "eso-",
        label: "脚注",
        backLabel: "回到内容区域",
      }),
      externalLinksHtml(),
    ],
  });
}

export function md2text(md?: string): string {
  if (md == null) return "";
  const tree = fromMarkdown(md);
  return toString(tree);
}

/** TODO: */
function externalLinks(): Extension {
  return {
    enter: {},
    exit: {},
  };
}

/** TODO: */
function externalLinksHtml(): HtmlExtension {
  return {
    enter: {},
    exit: {},
  };
}
