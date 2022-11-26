import { type Plugin } from "unified";
import type { Root, Text } from "hast";
import { Element, select, selectAll } from "hast-util-select";
import { toMarkdown } from "mdast-util-to-markdown";
import { type Handle, toMdast } from "hast-util-to-mdast";
import { h } from "hastscript";
import { toString } from "nlcst-to-string";
import snakeCase from "https://deno.land/x/case@2.1.1/snakeCase.ts";
import toZH from "../en2zh.ts";

/** uesp Wiki*/
const uespWiki: Plugin<[], Root> = () => (tree) => {
  const title = select("#content h1", tree)?.children[0]! as Text;
  title.value = title.value.replace("Online:", "").replace("(quest)", "").trim();

  const infoNode = select("#mw-content-text > table.hiddentable tr td:nth-child(3)", tree);
  if (infoNode == null) {
    console.log("uespWiki: infoNode is null");
    return;
  }

  const description = selectAll("table.hiddentable td", infoNode).map((x) => x.children).flat();

  const questInfo = selectAll("#mw-content-text > table.hiddentable table.questheader tr", tree)
    .map((x) => {
      const key = select("th", x);
      const value = select("td", x);
      if (key == null || value == null) {
        return null;
      }
      return h(toString(key).trim(), value.children);
    })
    .filter(Boolean);

  const root = h(null, select("#mw-content-text", tree));
  root.children.unshift(
    h(
      "frontmatter",
      h("title:", title),
      h("description:", description),
      ...questInfo,
      h("layout:", "../../layouts/QuestLayout.astro"),
    ),
  );
  select("#mw-content-text > table.hiddentable", root)!.children = [];
  select("#mw-content-text > table.hiddentable", root)!.tagName = "";
  select("#genMidColor", root)!.tagName = "blockquote";
  return root;
};

export default uespWiki;
