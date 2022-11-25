import { type Plugin } from "unified";
import type { Root } from "hast";
import { select, selectAll } from "hast-util-select";
import { h } from "hastscript";
import { toString } from "nlcst-to-string";

/** uesp Wiki*/
const uespWiki: Plugin<[], Root> = () => (tree) => {
  const title = toString(select("#content h1", tree)).replace("Online:", "");

  const frontmatter = [
    `---`,
    `title: ${title}`,
    `layout: ../../../layouts/NewsLayout.astro`,
    `---`,
  ];

  const root = h(null, select("#mw-content-text", tree));
  root.children.unshift(h("frontmatter", frontmatter.map((x) => h("text", x))));
  select("#toc", root)!.children = [];
  return root;
};

export default uespWiki;
