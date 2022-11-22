import html2md from "npm:html-to-md";
import { DOMParser } from "https://esm.sh/linkedom@0.14.12";

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
export async function getNewsList() {
  const newsList = await fetch("https://www.elderscrollsonline.com/cn/news?page=2").then((res) => res.text());
  const document = new DOMParser().parseFromString(newsList, "text/html");
  const newsListItemsEl = document.querySelectorAll("article.tier-2-list-item");

  return Array.from(newsListItemsEl).map((item) => {
    const title = item.querySelector("h3").textContent;
    const url = item.querySelector("a").getAttribute("href");
    const pubDate = item.querySelector("p.date").textContent.trim().substring(0, 10);
    const image = item.querySelector("img").getAttribute("data-lazy-src");
    const description = item.querySelector("p").textContent;
    const tags = Array.from(item.querySelectorAll("p.date a")).map((tag: any) => tag.textContent);
    return { title, url, pubDate, image, description, tags } as NewsItem;
  });
}

/** 获取新闻详情 */
async function getNewsDetail(item: NewsItem) {
  const newsDetail = await fetch(`https://www.elderscrollsonline.com${item.url}`).then((res) => res.text());
  const document = new DOMParser().parseFromString(newsDetail, "text/html");
  const newsDetailContent = document.querySelector("div.blog-body-box");
  newsDetailContent.querySelector(".col-sm-12").remove();
  newsDetailContent.querySelector(".tags").remove();
  // 用 data-lazy-s 属性替换 src 属性
  Array.from(newsDetailContent.querySelectorAll("img")).forEach((img) => {
    img.setAttribute("src", img.getAttribute("data-lazy-src"));
    img.parentNode.parentNode.replaceWith(img);
  });

  newsDetailContent.querySelector("p").remove();

  // 删除多余的换行
  return html2md(newsDetailContent.innerHTML).replace(/\n{3,}/g, "\n\n");
}

// save to src/pages/news/
export async function saveNewsAsMD(item: NewsItem) {
  const content = await getNewsDetail(item);
  const md = `---
title: ${item.title}
pubDate: ${item.pubDate}
description: ${item.description}
image: ${item.image}
tags: ${JSON.stringify(item.tags)}
layout: ../../layouts/NewsLayout.astro
---

${content}
`;

  await Deno.writeTextFile(`src/pages/news/${item.url.substring(14)}.md`, md);
}

const newsList = await getNewsList();

for (const item of newsList) {
  if (await Deno.stat(`src/pages/news/${item.url.substring(14)}.md`).catch(() => false)) continue;
  await saveNewsAsMD(item);
  console.log(`save ${item.url} success`);
}
