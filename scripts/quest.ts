import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import { type Handle } from "hast-util-to-mdast";
import { toString } from "nlcst-to-string";
import remarkStringify from "remark-stringify";

import { rehypeUesp, remarkUesp } from "./plugins/mod.ts";

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

/** 获取任务详情 */
async function getQuest(quest: string) {
  const html = await getQuestFromCache(quest);
  const table: Handle = (h, node) => h(node, "html", "");
  const frontmatter: Handle = (h, node) => {
    return h(node, "yaml", node.children.map(toString).join("\n"));
  };

  const file = await unified()
    .use(rehypeUesp)
    .use(rehypeParse)
    .use(rehypeRemark, { handlers: { table, frontmatter } })
    .use(remarkUesp)
    .use(remarkStringify)
    .process(html);

  return file.toString();
}

if (import.meta.main) {
  const quest = await getQuest("Soul_Shriven_in_Coldharbour");
  await Deno.writeTextFile(
    "./src/pages/quest/main/soul_shriven_in_coldharbour.md",
    quest,
  );
}
