import { type Plugin, unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import type { Element, Root } from "hast";
import type { Content } from "mdast";
import { visit } from "unist-util-visit";
import { select, selectAll } from "hast-util-select";
import { toHtml } from "hast-util-to-html";
import { type Handle, toMdast } from "hast-util-to-mdast";
import { isElement } from "hast-util-is-element";
import { h } from "hastscript";
import { toString } from "nlcst-to-string";
import { DOMParser, HTMLAnchorElement, HTMLElement } from "https://esm.sh/v99/linkedom@0.14.12";
import remarkStringify from "remark-stringify";

interface Frontmatter {
  title: string;
  description: string;
  image: string;
  tags: string[];
  pubDate: string;
}

interface NewsItem extends Frontmatter {
  url: string;
  content: string;
}

/** 获取新闻列表 */
async function getNewsList() {
  const newsList = await fetch("https://www.elderscrollsonline.com/cn/news?page=1").then((res) => res.text());
  const document = new DOMParser().parseFromString(newsList, "text/html");
  const newsListItemsEl = document.querySelectorAll("article.tier-2-list-item");

  return Array.from<HTMLElement>(newsListItemsEl).map((item) => {
    const title = item.querySelector("h3").textContent;
    const url = item.querySelector("a").getAttribute("href");
    const pubDate = item.querySelector("p.date").textContent.trim().substring(0, 10);
    const image = item.querySelector("img").getAttribute("data-lazy-src");
    const description = item.querySelector("p").textContent;
    const tags = Array.from(item.querySelectorAll("p.date a")).map((tag: HTMLAnchorElement) => tag.textContent);
    return { title, url, pubDate, image, description, tags } as NewsItem;
  });
}

/** 获取新闻详情 */
async function getNewsDetail(item: NewsItem) {
  const newsDetail = await fetch(`https://www.elderscrollsonline.com${item.url}`).then((res) => res.text());
  const document = new DOMParser().parseFromString(newsDetail, "text/html");
  const newsDetailContent = document.querySelector("div.blog-body-box");
  newsDetailContent.querySelector("p").remove();
  return (await html2md(newsDetail)).replace(/\n{3,}/g, "\n\n");
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
    .use(esoNews)
    .use(removeBanner)
    .use(replaceHref)
    .use(imgLazySrc)
    .use(removeImgLink)
    .use(removeTags)
    .use(fixNestedList)
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

const esoNews: Plugin<[], Root> = () => (tree) => {
  const title = toString(select("#post-title h1", tree));
  const pubDate = toString(select("#post-title .date", tree));
  const image = select("#blog-body .lead-img", tree)?.properties?.src as string;
  const description = toString(select("#blog-body p", tree));
  const tags = selectAll("#blog-body .tags a", tree).map((tag) => toString(tag));

  const frontmatter = [
    `---`,
    `title: ${title}`,
    `description: ${description}`,
    `pubDate: ${pubDate}`,
    `image: ${image}`,
    `tags: ${JSON.stringify(tags)}`,
    `layout: ../../../layouts/NewsLayout.astro`,
    `---`,
  ];

  const root = h(null, select("#blog-body", tree));
  root.children.unshift(h("frontmatter", frontmatter.map((x) => h("text", x))));
  select("p", root)!.children = []; // remove description
  return root;
};

function isBanner(node: Element, parent: Element) {
  return isElement(node, "div") &&
    (node.properties?.className as string[])?.includes("col-sm-12") &&
    (parent.properties?.className as string[])?.includes("blog-body-box");
}

const removeBanner: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node, index, parent) => {
    if (isBanner(node, parent as Element)) {
      parent!.children.splice(index!, 1);
    }
  });
};

const removeTags: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node, index, parent) => {
    if (isElement(node, "div") && (node.properties?.className as string[])?.includes("tags")) {
      parent!.children.splice(index!, 1);
    }
  });
};

const replaceHref: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node) => {
    if (isElement(node, "a")) {
      node.properties!.href = (node.properties!.href as string).replace(
        "https://www.elderscrollsonline.com/cn/news/post/",
        "/news/post/",
      );
    }
  });
};

const imgLazySrc: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node) => {
    if (isElement(node, "img")) {
      if (node.properties?.src == null) return;
      node.properties.src = node.properties.dataLazySrc;
    }
  });
};

const removeImgLink: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node, index, parent) => {
    if (isElement(node, "a") && (node.properties?.className as string[])?.includes("zl-link")) {
      const img = select("img", node);
      if (img == null) return;
      parent!.children[index!] = img;
    }
  });
};

const fixNestedList: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node, index, parent) => {
    if (isElement(node, "ul") && isElement(parent, "ul")) {
      parent!.children.splice(index!, 1);
      const previous = parent!.children[index! - 1] as Element;
      previous.children.push(node);
    }
  });
};

async function saveNewsAsMD(item: NewsItem) {
  const content = await getNewsDetail(item);
  await Deno.writeTextFile(`src/pages/news/post/${item.url.substring(14)}.md`, content);
}

const newsList = await getNewsList();

for (const item of newsList) {
  if (await Deno.stat(`src/pages/news/post/${item.url.substring(14)}.md`).catch(() => false)) continue;
  await saveNewsAsMD(item);
  console.log(`save ${item.url} success`);
}
