import toZh, { initLang, isEnglish } from "./toZH.ts";

async function saveToStrapi(id: string, name: string, local: boolean) {
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
    `${local ? "http://localhost:1337/api/" : "https://esoapi.denohub.com/api/"}classes/${id}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({ data: { name } }),
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

  for (let i = 1; i <= 1; i++) {
    const npc = await fetch(
      `https://esoapi.denohub.com/api/classes?fields[0]=id&fields[0]=nameEn&fields[0]=name&pagination[pageSize]=500&pagination[page]=${i}`,
    ).then((x) => x.json());

    const failed = [];
    let success = 0;
    for (const x of npc.data) {
      const nameZh = toZh(x.attributes.nameEn);

      if (isEnglish(nameZh)) {
        continue;
      }

      if (nameZh === x.attributes.name) {
        // failed.push({ id: x.id, name: x.attributes.name, nameEn: x.attributes.nameEn, nameZh });
        continue;
      }

      try {
        await saveToStrapi(x.id, nameZh, local);
        success++;
      } catch (e) {
        failed.push({ id: x.id, name: x.attributes.name, nameEn: x.attributes.nameEn, nameZh, reason: e.message });
      }
    }

    if (failed.length > 0) {
      Deno.writeTextFile(`gamedata/classes-${i}.json`, JSON.stringify(failed, null, 2));
    }

    console.log(`成功导入 ${success} 条数据，失败 ${failed.length} 条`);
  }
}
