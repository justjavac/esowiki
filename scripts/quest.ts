// deno-lint-ignore-file no-explicit-any
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import { toString } from "nlcst-to-string";
import type { Element } from "hast";
import { select, selectAll } from "hast-util-select";
import toZh, { initLang } from "./toZH.ts";
import { array, boolean, type InferType, number, object, ref, string } from "yup";

const questRewardSchema = object({
  id: number().required().integer().positive(),
  logId: number().required().integer().positive(),
  questId: number().required().integer().positive(),
  uniqueId: number().required().integer().positive(),
  quantity: number().required().integer().positive(),
  itemId: number().required().integer().positive(),
  collectId: number().required().integer().positive(),
  count: number().required().integer().positive(),
  name: string().required().transform((x) => toZh(x, true)),
  quality: string().required().transform(toZh),
  type: string().required().transform(toZh),
  icon: string().required().transform((x: string) => `https://eso-cdn.denohub.com${x.replace(".dds", ".png")}`),
});

/** 从网络或者缓存里获取任务详情 */
async function getRemoteFromCache(id: string) {
  const input = `https://esoitem.uesp.net/viewlog.php?record=questReward&filter=questId&filterid=${id}`;
  const response = await fetch(input);
  const data = await response.text();
  return data;
}

/** 解析内容 */
async function parseContent(
  id: string,
): Promise<any> {
  const file = await getRemoteFromCache(id);

  const node = unified().use(rehypeParse).parse(file);

  const table = select("table", node) as Element;
  const headers = (selectAll("th", table) as Element[])
    .map((node) => toString(node))
    .slice(1, -1);

  return selectAll("tr", table)
    .slice(1)
    .map((node) => {
      const cells = selectAll("td", node)
        .map((node) => select("img", node) ? (select("img", node)?.properties?.src as string) : toString(node))
        .slice(1, -1);
      const pairs = headers.map((x, i) => [x, cells[i].trim()]);
      const obj = Object.fromEntries(pairs);
      obj.nameEn = obj.name;
      return questRewardSchema.cast(obj) as InferType<typeof questRewardSchema>;
    });
}

async function saveToStrapi(data: InferType<typeof questRewardSchema>, local: boolean) {
  const token = Deno.env.get("STRAPI_TOKEN");

  if (!local && token == null) {
    throw new Error("没有设置 STRAPI_TOKEN 环境变量");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (!local) {
    headers["Authorization"] = `Bearer ${Deno.env.get("STRAPI_TOKEN")}`;
  }

  const response = await fetch(
    `${local ? "http://localhost:1337/api/" : "https://esoapi.denohub.com/api/"}quest-rewards`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ data }),
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message);
  }
}

if (import.meta.main) {
  const local = Deno.args[0] === "local";
  initLang();

  for (let i = 0; i < 3000; i++) {
    const quest = await fetch(
      "https://esoapi.denohub.com/api/quests?fields[0]=id&pagination[pageSize]=500&populate[0]=rewards&filters[rewards][id][$null]=true",
    ).then((x) => x.json());

    const questIds = quest.data.map((x: any) => x.id);

    const failed = [];
    let success = 0;
    for (const id of questIds) {
      const result = await parseContent(id);
      for (const data of result) {
        try {
          data.itemId && (data.item = data.itemId);
          data.quest = id;
          await saveToStrapi(data, local);
          success++;
        } catch (e) {
          failed.push({ ...data, reason: e.message });
        }
      }
    }

    if (failed.length > 0) {
      Deno.writeTextFile(`gamedata/quest_${i}.json`, JSON.stringify(failed, null, 2));
    }
    console.log(`成功导入 ${success} 条数据，失败 ${failed.length} 条`);
  }
}
