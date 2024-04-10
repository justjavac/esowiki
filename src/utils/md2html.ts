import { micromark } from "micromark";
import type { Extension, HtmlExtension } from "micromark-util-types";
import { gfm, gfmHtml } from "./gfm";
import {
  html as wikiHtml,
  syntax as wiki,
} from "micromark-extension-wiki-link";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toString } from "mdast-util-to-string";
import { fromMarkdown as fromWiki } from "mdast-util-wiki-link";

export function md2html(md?: string, isInline = false): string {
  if (md == null) return "";

  const html = micromark(md, {
    allowDangerousHtml: true,
    extensions: [wiki(), gfm(), externalLinks()],
    htmlExtensions: [
      wikiHtml({
        permalinks: [],
        wikiLinkClassName: "internal",
        newClassName: "new",
        hrefTemplate: (permalink: string) => `/wiki/${permalink}`,
      }),
      gfmHtml({
        clobberPrefix: "eso-",
        label: "脚注",
        backLabel: "回到内容区域",
      }),
      externalLinksHtml(),
    ],
  });

  if (isInline && !md.includes("\n\n")) {
    return html.replace(/<p>|<\/p>/g, "");
  }

  return html;
}

export function md2text(md?: string): string {
  if (md == null) return "";
  const tree = fromMarkdown(md, {
    extensions: [wiki()],
    mdastExtensions: [fromWiki()],
  });
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
