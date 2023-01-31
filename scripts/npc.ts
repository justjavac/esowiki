import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.33-alpha/deno-dom-wasm.ts";

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
): Promise<string | null> {
  const content = await getRemoteFromCache(name);
  const document = new DOMParser().parseFromString(content, "text/html");
  if (document == null) return null;
  const el = document.querySelector(".thumbinner .image img");
  if (el == null) return null;
  const src = el.getAttribute("src");
  if (src == null) return null;

  if (src.includes("%27")) {
    return src
      .replace("//images.uesp.net", "https://eso-cdn.denohub.com")
      .replace("200px", "400px");
  }

  return src
    .replace("//images.uesp.net", "https://eso-cdn.denohub.com")
    .replace(/\/200px-.+$/, "");
}

async function saveToStrapi(id: string, thumb: string, local: boolean) {
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
    `${local ? "http://localhost:1337/api/" : "https://esoapi.denohub.com/api/"}npcs/${id}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({ data: { thumb } }),
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
    const npc = await fetch(
      "https://esoapi.denohub.com/api/npcs?fields[0]=id&fields[0]=nameEn&fields[0]=name&pagination[pageSize]=500&pagination[page]=0&filters[thumb][$null]=true",
    ).then((x) => x.json());

    const failed = [];
    let success = 0;
    for (const x of npc.data) {
      const thumb = await parseContent(x.attributes.nameEn.replace(/ /g, "_"));

      if (thumb == null) {
        failed.push({ id: x.id, name: x.attributes.name, nameEn: x.attributes.nameEn, thumb, reason: "无法获取图片" });
        continue;
      }

      try {
        await saveToStrapi(x.id, thumb, local);
        success++;
      } catch (e) {
        failed.push({ id: x.id, name: x.attributes.name, nameEn: x.attributes.nameEn, thumb, reason: e.message });
      }
    }

    if (failed.length > 0) {
      Deno.writeTextFile(`gamedata/npc_${i}.json`, JSON.stringify(failed, null, 2));
    }

    console.log(`成功导入 ${success} 条数据，失败 ${failed.length} 条`);
  }
}
