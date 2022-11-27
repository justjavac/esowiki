import { type Plugin, Processor } from "unified";
import type { Content, Node, Root, Text } from "hast";
import { Element, matches, select, selectAll } from "hast-util-select";
import { toMarkdown } from "mdast-util-to-markdown";
import { type Handle, toMdast } from "hast-util-to-mdast";
import { h } from "hastscript";
import { toString } from "nlcst-to-string";
import snakeCase from "https://deno.land/x/case@2.1.1/snakeCase.ts";
import toZH from "../en2zh.ts";
import { VFile } from "vfile";

/**
 * https://en.uesp.net/wiki 内容解析
 *
 * 标题："#content h1"
 * 内容："#mw-content-text"
 */
const uespWiki: Plugin<[], Root> = () => {
  return (tree, file: VFile) => {
    const title = select("#content h1", tree)?.children[0]! as Text;
    title.value = title.value.replace("Online:", "").replace("(quest|place|achievement)", "").trim();
    file.cwd = Deno.cwd();
    file.data.title = toString(title);

    const categorie = select("#contentSub a:nth-child(2)", tree);

    const root = h(null, select("#mw-content-text", tree));

    root.children.unshift(
      h(
        "frontmatter",
        h("title:", title),
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

    if (select("#genMidColor", root)) {
      select("#genMidColor", root)!.tagName = "blockquote";
    }

    return root;
  };
};

/** 解析任务详情 */
export const frontmatterQuest: Plugin<[], Root> = () => (tree, file) => {
  file.path = "src/pages/quest/" + snakeCase(`${file.data.title}`) + ".mdx";
  const infoNode = select("table.hiddentable tr td:nth-child(3)", tree);
  if (infoNode == null) {
    console.log("uespWiki: infoNode is null");
    return;
  }

  const description = selectAll("table.hiddentable td", infoNode).map((x) => x.children).flat();

  const questInfo = selectAll("table.questheader tr", infoNode)
    .map((x) => {
      const key = select("th", x);
      const value = select("td", x);
      if (key == null || value == null) {
        return null;
      }
      return h(toString(key).trim(), value.children);
    })
    .filter(Boolean) as Element[];

  const frontmatter = select("frontmatter", tree);
  if (frontmatter == null) {
    console.log("uespWiki: frontmatter is null");
    Deno.exit(1);
  }

  if ((frontmatter.children[0] as Element)?.tagName !== "title:") {
    console.log("uespWiki: frontmatter title is null");
    Deno.exit(1);
  }

  frontmatter.children.splice(
    1,
    0,
    h("description:", description),
    ...questInfo,
    h("layout:", "../../layouts/QuestLayout.astro"),
  );

  const mwContentText = select("table.hiddentable", tree);
  if (mwContentText?.properties != null) {
    mwContentText.properties.dataMdast = "ignore";
  }

  select("#genMidColor", tree)!.tagName = "blockquote";
  return tree;
};

export default uespWiki;
