import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import type { Element } from "hast";
import type { Content } from "mdast";
import { select, selectAll } from "hast-util-select";
import { toHtml } from "hast-util-to-html";
import { type Handle, toMdast } from "hast-util-to-mdast";
import { toString } from "nlcst-to-string";
import remarkStringify from "remark-stringify";

import { uesp } from "./plugins/mod.ts";

/** 获取任务详情 */
async function getQuest(quest: string) {
  const html = await fetch(`https://en.uesp.net/wiki/Online:${quest}`).then((res) => res.text());

  const table: Handle = (h, node) => h(node, "html", "");
  const frontmatter: Handle = (h, node) => h(node, "frontmatter", node.children.map(toString).join("\n"));

  const file = await unified()
    .use(uesp)
    .use(rehypeParse)
    .use(rehypeRemark, { handlers: { table, frontmatter } })
    .use(remarkStringify, {
      handlers: {
        frontmatter(node) {
          return node.value;
        },
      },
    })
    .process(html);

  return file.toString();
}

if (import.meta.main) {
  const quest = await getQuest("Soul_Shriven_in_Coldharbour");
  await Deno.writeTextFile("./src/pages/quest/main/soul_shriven_in_coldharbour.md", quest);
}
