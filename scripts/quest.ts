import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import { type Handle } from "hast-util-to-mdast";
import { toHtml } from "hast-util-to-html";
import remarkStringify from "remark-stringify";
import { rehypeUesp, remarkUesp } from "./plugins/mod.ts";
import { toString } from "nlcst-to-string";
import { Element, ElementContent, Node, Text } from "hast";
import { stringify } from "yaml";
import { isElement } from "hast-util-is-element";

/** 从网络或者缓存里获取任务详情 */
async function getQuestFromCache(quest: string) {
  const cachePath = `.cache/quest/${quest}.html`;

  try {
    const html = await Deno.readTextFile(cachePath);
    return html;
  } catch {
    const url = `https://en.uesp.net/wiki/Online:${quest}`;
    const res = await fetch(url);
    const html = await res.text();
    await Deno.writeTextFile(cachePath, html);
    return html;
  }
}

function splitByBr(node: Element): ElementContent[][] {
  const children: ElementContent[][] = [];
  let current: ElementContent[] = [];

  for (const child of node.children) {
    if (isElement(child, "br")) {
      children.push(current);
      current = [];
    } else {
      current.push(child);
    }
  }

  if (current.length > 0) {
    children.push(current);
  }

  return children;
}

const frontmatter: Handle = (h, node) => {
  const frontmatter: Record<string, string | string[]> = {};

  node.children.forEach((x: Element) => {
    switch (x.tagName) {
      case "title":
        frontmatter.title = toString(x);
        break;
      case "description":
        frontmatter.description = toHtml(x.children);
        break;
      case "quest giver":
      case "location(s)":
      case "reward":
        frontmatter[x.tagName] = splitByBr(x).map((x) => toHtml(x));
        break;
      default:
        frontmatter[x.tagName] = toHtml(x.children);
    }
  });

  frontmatter.arr = [{ a: 1 }, { b: 2, foo: "bar" }];

  return h(node, "yaml", stringify(frontmatter));
};

/** 获取任务详情 */
async function getQuest(quest: string) {
  const html = await getQuestFromCache(quest);

  const center: Handle = (h, node) => {
    node.properties = { className: ["text-gray-500 text-sm text-center"] };
    node.tagName = "p";
    return h(node, "html", toHtml(node));
  };

  const processor = unified();
  return await processor
    .use(rehypeUesp)
    .use(rehypeParse)
    .use(rehypeRemark, { handlers: { frontmatter, center } })
    .use(remarkUesp)
    .use(remarkStringify, {
      bullet: "-",
      bulletOther: "*", // see https://github.com/syntax-tree/mdast-util-to-markdown/tree/main#optionsbulletother
    })
    .process(html);
}

if (import.meta.main) {
  const vfile = await getQuest("Storm_on_the_Horizon");
  await Deno.writeTextFile(
    vfile.path,
    vfile.toString(),
  );
}
