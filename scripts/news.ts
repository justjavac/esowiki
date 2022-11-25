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

import { official } from "./plugins/mod.ts";

interface Frontmatter {
  title: string;
  description: string;
  image: string;
  tags: string[];
  pubDate: string;
}

interface ListItem extends Frontmatter {
  url: string;
}

/** 获取新闻列表 */
async function getNewsList(): Promise<ListItem[]> {
  const html = await fetch("https://www.elderscrollsonline.com/cn/news?page=1").then((res) => res.text());

  const root = unified()
    .use(rehypeParse)
    .parse(html);

  const newsList = selectAll("article.tier-2-list-item", root) as Element[];

  return newsList.map((news) => ({
    title: toString(select("h3", news)),
    url: select("a", news)?.properties?.href as string,
    pubDate: toString(select("p.date", news)).trim().substring(0, 10),
    description: toString(select("p", news)),
    image: select("img", news)?.properties?.dataLazySrc as string,
    tags: selectAll("p.date a", news).map((tag) => toString(tag)),
  }));
}

/** 获取新闻详情 */
async function getNewsDetail(url: string) {
  const newsDetail = await fetch(`https://www.elderscrollsonline.com${url}`).then((res) => res.text());
  return html2md(newsDetail);
}

async function html2md(html: string) {
  const video: Handle = (h, node) => h(node, "html", toHtml(node));
  const frontmatter: Handle = (h, node) => h(node, "frontmatter", node.children.map(toString).join("\n"));
  const p: Handle = (h, node) => {
    if (node.properties?.align === "center") {
      node.properties = { className: ["text-gray-500 text-sm text-center"] };
      return h(node, "html", toHtml(node));
    }
    return toMdast(node, { handlers: { video } }) as Content;
  };

  const file = await unified()
    .use(official)
    .use(rehypeParse, { fragment: true })
    .use(rehypeRemark, { handlers: { video, p, frontmatter } })
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
  const newsList = await getNewsList();

  for (const item of newsList) {
    const file = `src/pages/news/post/${item.url.substring(14)}.md`;
    // if (await Deno.stat(file).catch(() => false)) continue;
    const content = await getNewsDetail(item.url);
    await Deno.writeTextFile(file, content);
    console.log(`save ${item.url} success`);
  }
}
