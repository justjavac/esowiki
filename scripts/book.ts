import { unified } from "unified";
import rehypeParse from "rehype-parse";
import { toString } from "nlcst-to-string";
import type { Element } from "hast";
import { select, selectAll } from "hast-util-select";
import { closest } from "fastest-levenshtein";
import toZh, { en2zh, initLang } from "./toZH.ts";

async function saveToStrapi(id: number, body: string) {
  const token = Deno.env.get("STRAPI_TOKEN");

  if (token == null) {
    throw new Error("没有设置 STRAPI_TOKEN 环境变量");
  }

  const response = await fetch(`https://esoapi.denohub.com/api/books/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("STRAPI_TOKEN")}`,
    },
    body: JSON.stringify({ data: { body } }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message);
  }
}

if (import.meta.main) {
  initLang();
  const enLines = [...en2zh.keys()];

  const failed = [];
  for (let id = 2; id < 8498; id++) {
    try {
      const response = await fetch(`https://esolog.uesp.net/viewlog.php?record=book&field=body&id=${id}&action=view`);
      const html = await response.text();
      const node = unified().use(rehypeParse).parse(html);
      const body = toString(select(".elvRecordView", node) as Element);

      const found = closest(body, enLines.filter((x) => x.length > body.length - 10 && x.length < body.length + 10));
      if (!found) {
        throw new Error("未翻译");
      }

      const zh = toZh(found).replaceAll("\\n", "\n").replaceAll(
        "\\r",
        "",
      );
      await saveToStrapi(id as number, zh);
    } catch (e) {
      if (e.message === "未翻译") {
        failed.push({ id, reason: e.message });
      }
    }
  }

  Deno.writeTextFile("gamedata/book_1.json", JSON.stringify(failed, null, 2));
  console.log(`未翻译 ${failed.length} 条`);
}
