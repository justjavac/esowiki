import { type Plugin, Processor } from "unified";
import type { Content, Node, Root, Text } from "hast";
import { Element, matches, select, selectAll } from "hast-util-select";
import { toMarkdown } from "mdast-util-to-markdown";
import { type Handle, toMdast } from "hast-util-to-mdast";
import { h } from "hastscript";
import { toString } from "nlcst-to-string";
import snakeCase from "https://deno.land/x/case@2.1.1/snakeCase.ts";
import { VFile } from "vfile";
import { isElement } from "hast-util-is-element";
import { visit } from "unist-util-visit";
import linkType from "../linkType.ts";

/**
 * https://en.uesp.net/wiki 内容解析
 *
 * 标题："#content h1"
 * 内容："#mw-content-text"
 */
const uespWiki: Plugin<[], Root> = () => {
  return (tree, file: VFile) => {
    const title = select("#content h1", tree)?.children[0]! as Text;

    title.value = title.value.replace("Online:", "").replace(/\([^)]*\)/, "").trim();
    file.cwd = Deno.cwd();
    file.data.title = toString(title);

    const categorie = select("#contentSub a:nth-child(2)", tree);

    const root = h(null, select("#mw-content-text", tree));

    root.children.unshift(
      h(
        "frontmatter",
        h("title", title),
      ),
    );

    // 忽略警告和通知
    const notice = select(".notice-default", root);
    if (notice?.properties != null) {
      notice.properties.dataMdast = "ignore";
    }

    // 忽略目录和导航
    const mwContentText = select("table.hiddentable", root);
    if (mwContentText?.properties != null) {
      mwContentText.properties.dataMdast = "ignore";
    }

    // 忽略所有的图标
    const magnify = selectAll(".magnify", root);
    magnify.forEach((node) => {
      if (node.properties != null) {
        node.properties.dataMdast = "ignore";
      }
    });

    // 将 .thumbcaption 元素的类型转为 center
    const thumbcaption = selectAll(".thumbcaption", root);
    thumbcaption.forEach((node) => {
      node.tagName = "center";
      node.children = node.children.filter((x) => x.type == "text");
    });

    if (select("#genMidColor", root)) {
      select("#genMidColor", root)!.tagName = "blockquote";
    }

    return root;
  };
};

/** 解析任务详情 */
export const frontmatterQuest: Plugin<[], Root> = () => (tree, file) => {
  file.path = "src/pages/quest/" + snakeCase(`${file.data.title}`) + ".md";
  const infoNode = select("table.hiddentable tr td:nth-child(3)", tree);
  if (infoNode == null) {
    console.log("uespWiki: infoNode is null");
    return;
  }

  const description = selectAll("table.hiddentable td", infoNode)
    .flatMap((x) => x.children)
    .flatMap((x) => isElement(x, "b") ? x.children : x);

  const questInfo = selectAll("table.questheader tr", infoNode)
    .map((x) => {
      const key = select("th", x);
      const value = select("td", x);
      if (key == null || value == null) {
        return null;
      }
      return h(toString(key).replace(":", "").trim(), value.children);
    })
    .filter(Boolean) as Element[];

  const frontmatter = select("frontmatter", tree);
  if (frontmatter == null) {
    console.log("uespWiki: frontmatter is null");
    Deno.exit(1);
  }

  if ((frontmatter.children[0] as Element)?.tagName !== "title") {
    console.log("uespWiki: frontmatter title is null");
    Deno.exit(1);
  }

  frontmatter.children.splice(
    1,
    0,
    h("description", description),
    ...questInfo,
    h("layout", "../../layouts/QuestLayout.astro"),
  );

  const mwContentText = select("table.hiddentable", tree);
  if (mwContentText?.properties != null) {
    mwContentText.properties.dataMdast = "ignore";
  }

  select("#genMidColor", tree)!.tagName = "blockquote";
  return tree;
};

export const fixWikiLink: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node, index, parent) => {
    if (isElement(node, "a")) {
      const href = node.properties!.href as string;
      if (linkType[href] == null) return;
      const text = toString(node);
      node.properties!.href = `/${linkType[href]}/${snakeCase(text)}`;
    }
  });
};

export default uespWiki;
