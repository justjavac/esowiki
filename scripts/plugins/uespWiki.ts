import { type Plugin, Processor } from "unified";
import type { Content, Node, Root, Text } from "hast";
import { Element, matches, select, selectAll } from "hast-util-select";
import { toMarkdown } from "mdast-util-to-markdown";
import { type Handle, toMdast } from "hast-util-to-mdast";
import { h } from "hastscript";
import { toString } from "nlcst-to-string";
import paramCase from "https://deno.land/x/case@2.1.1/paramCase.ts";
import { VFile } from "vfile";
import { isElement } from "hast-util-is-element";
import { SKIP, visit } from "unist-util-visit";
import linkType from "../linkType.ts";
import { initLang } from "../toZH.ts";

initLang(); // 初始化全部语言包

/**
 * https://en.uesp.net/wiki 内容解析
 *
 * 标题："#content h1"
 * 内容："#mw-content-text"
 */
const uespWiki: Plugin<[], Root> = () => {
  return (tree, file: VFile) => {
    const h1 = select("#content h1", tree) as Element;
    const title = h1.children[0]! as Text;

    title.value = title.value.replace("Online:", "").replace(/\([^)]*\)/, "").trim();
    file.cwd = Deno.cwd();
    file.data.title = toString(title);

    const category = select("#contentSub .subpages > a:nth-child(2)", tree) as Element;
    file.data.category = toString(category);

    const root = h(null, select("#mw-content-text", tree));
    const hTitle = h("title", title);
    hTitle.properties = { en: title.value };

    root.children.unshift(
      h(
        "frontmatter",
        hTitle,
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

    const toc = select("#toc", root);
    if (toc?.properties != null) {
      toc.properties.dataMdast = "ignore";
    }

    // 忽略所有的图标
    const magnify = selectAll(".magnify", root);
    magnify.forEach((node) => {
      if (node.properties == null) return;
      node.properties.dataMdast = "ignore";
    });

    // 忽略所有编辑按钮
    const editsection = selectAll(".mw-editsection", root);
    editsection.forEach((node) => {
      if (node.properties == null) return;
      node.properties.dataMdast = "ignore";
    });

    // 忽略任务列表的第一行
    const tr = select("table.wikitable > tbody > tr:nth-child(1)", root);
    if (tr?.properties != null) {
      tr.properties.dataMdast = "ignore";
    }

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
  file.path = "drafts/" + paramCase(`${file.data.title}`) + ".md";

  const info: Element[] = [];

  switch (file.data.category) {
    // 任务
    case "Quests": {
      file.dirname = "src/pages/quest/";

      const infobox = select("table.hiddentable tr td:nth-child(3)", tree);
      if (infobox == null) {
        console.log("uespWiki: infoNode is null");
        return;
      }

      const description = selectAll("table.hiddentable td", infobox)
        .flatMap((x) => x.children)
        .flatMap((x) => isElement(x, "b") ? x.children : x);

      info.push(h("description", description));

      selectAll("table.questheader tr", infobox)
        .forEach((x) => {
          const key = select("th", x);
          const value = select("td", x);
          if (key != null && value != null) {
            const tagName = toString(key)
              .replace(":", "")
              .replace("(s)", "")
              .trim()
              .replace(" ", "_");
            info.push(h(tagName, value.children));
          }
        });

      info.push(h("layout", "../../layouts/QuestLayout.astro"));
      break;
    }

    // 人物
    case "People": {
      file.dirname = "src/pages/npc/";

      const thumb = select(".thumb", tree);
      if (thumb != null) {
        info.push(h("thumb", thumb.children));
      }
      selectAll(".thumb", tree).forEach((x) => {
        if (x.properties != null) {
          x.properties.dataMdast = "ignore";
        }
      });

      const infobox = select(".infobox", tree);
      if (infobox == null) {
        console.log("uespWiki: infoNode is null");
        return;
      }

      selectAll("tr", infobox)
        .forEach((x) => {
          const keys = selectAll("th", x);
          const values = selectAll("td", x);
          if (keys.length == 0 || values.length == 0) {
            return;
          }

          keys.forEach((key, index) => {
            const value = values[index];
            if (value != null) {
              const tagName = toString(key)
                .replace(":", "")
                .replace("(s)", "")
                .replace(/\xC2|\xA0/, " ")
                .trim()
                .replace(" ", "_");
              info.push(h(tagName, value.children));
            }
          });
        });

      infobox.properties!.dataMdast = "ignore";
      info.push(h("layout", "../../layouts/NpcLayout.astro"));
      break;
    }
    default: {
      console.log("uespWiki: unknown category", file.data.category);
      info.push(h("layout", "../../layouts/QuestLayout.astro"));
    }
  }

  const frontmatter = select("frontmatter", tree)!;
  frontmatter.children.splice(
    1,
    0,
    ...info,
  );

  const mwContentText = select("table.hiddentable", tree);
  if (mwContentText?.properties != null) {
    mwContentText.properties.dataMdast = "ignore";
  }

  if (select("#genMidColor", tree)) {
    select("#genMidColor", tree)!.tagName = "blockquote";
  }

  return tree;
};

/** /wiki/Online:Note_from_Razum-dar --> /book/note_from_razum-dar */
export const fixWikiLink: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node, index, parent) => {
    if (isElement(node, "a")) {
      const href = node.properties!.href as string;

      if (href.startsWith("/wiki/Lore:")) {
        parent!.children.splice(index!, 1, ...node.children);
        return [SKIP, index];
      }

      if (linkType[href] == null) {
        return;
      }
      node.properties!.href = href.replace(
        /\/wiki\/Online:(.*)/,
        (_, name: string) => `/${linkType[href]}/${paramCase(name.replace(/_\(.*\)/, ""))}`,
      );
    }
  });
};

export default uespWiki;
