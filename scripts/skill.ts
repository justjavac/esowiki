import { unified } from "unified";
import rehypeParse from "rehype-parse";
import { toString } from "nlcst-to-string";
import type { Element } from "hast";
import { select, selectAll } from "hast-util-select";
import toZh, { initLang, isEnglish } from "./toZH.ts";
import { apply, resove } from "./template.ts";
import skills from "../gamedata/skillTree.json" assert { type: "json" };

async function getRemote(abilityId: number) {
  const response = await fetch(
    `https://esoitem.uesp.net/viewlog.php?action=view&record=minedSkills&id=${abilityId}`,
  );
  const html = await response.text();
  return html;
}

/** 解析内容 */
async function parseContent(
  abilityId: number,
): Promise<Record<string, string>> {
  const html = await getRemote(abilityId);

  const root = unified().use(rehypeParse).parse(html);
  const table = select("table", root) as Element;

  const entries = selectAll("table tr", root)
    .slice(5)
    .map((node) => {
      const key = toString(select("th", node) as Element).trim();
      const td = select("td", node) as Element;
      let value = select("img", td) ? (select("img", td)?.properties?.src as string) : toString(td).trim();
      if (key.startsWith("type") && value === "Invalid") {
        value = "";
      }
      return [key, value];
    });

  return Object.fromEntries(entries);
}

async function saveToStrapi(id: number, data: Record<string, string>) {
  const response = await fetch(`https://esoapi.denohub.com/api/skills/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("STRAPI_TOKEN")}`,
    },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    console.error(await response.text());
  }
}

if (import.meta.main) {
  initLang();
  for (const item of skills) {
    // const result = await parseContent(Number(item.abilityId));
    // result.mechanic = toZh(result.mechanic);
    // result.target = toZh(result.target);
    // result.skillType = toZh(result.skillType);
    // result.skillLine = toZh(result.skillLine);
    // result.classType = toZh(result.classType);
    // result.raceType = toZh(result.raceType);
    // result.rawTooltip = toZh(result.rawTooltip);
    // result.rawCoef = toZh(result.rawCoef);
    // result.coefTypes = toZh(result.coefTypes);
    // result.effectLines = toZh("@E" + result.effectLines).substring(2);
    // result.upgradeLines = toZh("@U" + result.upgradeLines).substring(2);
    // result.type1 = toZh(result.type1);
    // result.type2 = toZh(result.type2);
    // result.type3 = toZh(result.type3);
    // result.type4 = toZh(result.type4);
    // result.type5 = toZh(result.type5);
    // result.type6 = toZh(result.type6);
    // result.cost = Number(result.cost) ? result.cost : null;

    // // 将 rawDescription 的 |cffffff20|r 替换为 20
    // // 将 rawDescription 的换行符去掉
    // const template = result.rawDescription.replace(/\|c[0-9a-fA-F]{6}(.+)\|r/g, "$1").replace(/\n/g, " ");
    // const slots = resove(result.description, template);
    // // 翻译 slots 对象的内容
    // for (const key in slots) {
    //   slots[key] = toZh(slots[key]);
    // }
    // result.rawDescription = toZh(result.rawDescription).replaceAll("\\n", "\n").replaceAll("\\r", "");
    // result.description = apply(result.rawDescription.replace(/\|c[0-9a-fA-F]{6}(.+)\|r/g, "$1"), slots);

    await saveToStrapi(Number(item.id), {
      skillTypeName: item.skillTypeName.split("::").map((x) => toZh(x)).join("::"),
      baseName: toZh(item.baseName),
    });
    console.log(item.id);
  }
}
