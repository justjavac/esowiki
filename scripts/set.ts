/** 从网络或者缓存里获取任务详情 */
async function getRemoteFromCache(name: string) {
  const cachePath = `.cache/quest/${name}.html`;

  try {
    const html = await Deno.readTextFile(cachePath);
    return html;
  } catch {
    const url = `https://en.uesp.net/wiki/Online:${name}`;
    const res = await fetch(url);
    const html = await res.text();
    await Deno.writeTextFile(cachePath, html);
    return html;
  }
}

/** 解析内容 */
async function parseContent(
  name: string,
): Promise<boolean> {
  const content = await getRemoteFromCache(name);
  return content.includes(
    `This quest is part of the <a href="/wiki/Online:Story_Quests" title="Online:Story Quests">Zone Story</a>`,
  );
}

async function saveToStrapi(id: string, isZoneStory: boolean, local: boolean) {
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
    `${local ? "http://localhost:1337/api/" : "https://esoapi.denohub.com/api/"}quests/${id}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({ data: { type: isZoneStory ? "地区剧情任务" : "" } }),
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message);
  }
}

if (import.meta.main) {
  const local = Deno.args[0] === "local";

  for (let i = 0; i < 3000; i++) {
    const quest = await fetch(
      "https://esoapi.denohub.com/api/set-summaries?fields[0]=id&fields[0]=nameEn&fields[0]=name&pagination[pageSize]=500&pagination[page]=0&filters[type][$eq]=制造",
    ).then((x) => x.json());

    const failed = [];
    let success = 0;
    for (const x of quest.data) {
      const isZoneStory = await parseContent(x.attributes.nameEn);
      try {
        await saveToStrapi(x.id, isZoneStory, local);
        success++;
      } catch (e) {
        failed.push({ id: x.id, name: x.attributes.name, nameEn: x.attributes.nameEn, reason: e.message });
      }
    }

    if (failed.length > 0) {
      Deno.writeTextFile(`gamedata/quest_${i}.json`, JSON.stringify(failed, null, 2));
    }

    console.log(`成功导入 ${success} 条数据，失败 ${failed.length} 条`);
  }
}
