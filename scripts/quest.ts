import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import { type Handle } from "hast-util-to-mdast";
import { toHtml } from "hast-util-to-html";
import remarkStringify from "remark-stringify";
import { rehypeUesp, remarkUesp } from "./plugins/mod.ts";
import { toString } from "nlcst-to-string";
import { Element, Node, Text } from "hast";

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

const frontmatter: Handle = (h, node) => {
  return h(node, "yaml", node.children.map((x: Element) => `${x.tagName} '${toHtml(x.children)}'`).join("\n"));
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
  const vfile = await getQuest("The_Harborage_(quest)");
  await Deno.writeTextFile(
    vfile.path,
    vfile.toString(),
  );
}
