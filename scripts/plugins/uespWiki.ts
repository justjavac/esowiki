import { type Plugin } from "unified";
import type { Root } from "hast";
import { select, selectAll } from "hast-util-select";
import { toMarkdown } from "mdast-util-to-markdown";
import { type Handle, toMdast } from "hast-util-to-mdast";
import { h } from "hastscript";
import { toString } from "nlcst-to-string";
import toZH from "../en2zh.ts";

/** uesp Wiki*/
const uespWiki: Plugin<[], Root> = () => (tree) => {
  const title = toString(select("#content h1", tree)).replace("Online:", "");

  const infoNode = select("#mw-content-text > table.hiddentable tr td:nth-child(3)", tree);
  if (infoNode == null) {
    console.log("uespWiki: infoNode is null");
    return;
  }

  const description = toString(select("table.hiddentable", infoNode));
  const zone = toString(select("table.questheader tr:nth-child(1) td", infoNode));
  const giver = toString(select("table.questheader tr:nth-child(2) td", infoNode));
  const location = toString(select("table.questheader tr:nth-child(3) td", infoNode));
  const nextQuest = toString(select("table.questheader tr:nth-child(4) td", infoNode));
  const xPGain = toString(select("table.questheader tr:nth-child(6) td", infoNode));

  const rewordNode = select("table.questheader tr:nth-child(5) td", infoNode)!;
  rewordNode.tagName = "div";
  const reward = toMarkdown(toMdast(rewordNode), {
    handlers: {
      text(node) {
        return toZH(node?.value!);
      },
    },
  });

  const frontmatter = [
    `title: ${toZH(title)}`,
    `description: ${toZH(description)}`,
    `zone: ${toZH(zone)}`,
    `giver: ${toZH(giver)}`,
    `location: ${toZH(location)}`,
    `nextQuest: ${toZH(nextQuest)}`,
    // `reward: ${reward}`,
    `xp: ${toZH(xPGain)}`,
    `layout: ../../../layouts/QuestLayout.astro`,
  ];

  const root = h(null, select("#mw-content-text", tree));
  root.children.unshift(h("frontmatter", frontmatter.map((x) => h("text", x))));
  select("#mw-content-text > table.hiddentable", root)!.children = [];
  select("#mw-content-text > table.hiddentable", root)!.tagName = "";
  select("#genMidColor", root)!.tagName = "blockquote";
  return root;
};

export default uespWiki;
