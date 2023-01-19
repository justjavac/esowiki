import { unified } from "unified";
import rehypeParse from "rehype-parse";
import { toString } from "nlcst-to-string";
import type { Element } from "hast";
import { select, selectAll } from "hast-util-select";
import toZh, { initLang } from "./toZH.ts";
import { array, boolean, type InferType, number, object, ref, string } from "yup";
import paramCase from "https://deno.land/x/case@2.1.1/paramCase.ts";

const achievementCategoriesSchema = object({
  id: number().required().integer().positive(),
  name: string().required(),
  categoryName: string().required().transform(toZh),
  subCategoryName: string().required().transform(toZh),
  categoryIndex: number().required().integer().positive(),
  subCategoryIndex: number().required().integer(),
  numAchievements: number().required().integer().positive(),
  points: number().required().integer().positive(),
  hidesPoints: number().required().integer().positive(),
  icon: string().required().url(),
  pressedIcon: string().required().url(),
  mouseoverIcon: string().required().url(),
  gamepadIcon: string().required().url(),
});

const achievementCriteriaSchema = object({
  id: number().required().integer().positive(),
  achievementId: number().required().integer().positive(),
  name: string().required(),
  description: string().required().transform(toZh),
  numRequired: number().required().integer().positive(),
  criteriaIndex: number().required().integer().positive(),
});

const achievementsSchema = object({
  id: number().required().integer().positive(),
  name: string().required(),
  description: string().required().transform(toZh),
  categoryIndex: number().required().integer().positive(),
  subCategoryIndex: number().required().integer(),
  achievementIndex: number().required().integer(),
  categoryName: string().required(),
  points: number().required().integer().positive(),
  icon: string().required(),
  numRewards: number().required().integer().positive(),
  itemLink: string().required(),
  link: string().required(),
  firstId: number().required().integer().positive(),
  prevId: number().required().integer().positive(),
  nextId: number().required().integer().positive(),
  itemName: string().required().transform(toZh),
  itemIcon: string().required(),
  itemQuality: number().required().integer().positive(),
  title: string().required(),
  collectibleId: number().required().integer().positive(),
  dyeId: string().required(),
  dyeName: string().required().transform(toZh),
  dyeRarity: number().required().integer(),
  dyeHue: number().required().integer(),
  dyeColor: string().required(),
});

const antiquityLeadsSchema = object({
  id: number().required().integer().positive(),
  name: string().required(),
  icon: string().required(),
  quality: number().required().integer().positive(),
  difficulty: number().required().integer().positive(),
  requiresLead: number().required().integer().positive(),
  isRepeatable: number().required().integer().positive(),
  rewardId: number().required().integer().positive(),
  zoneId: number().required().integer().positive(),
  setId: number().required().integer().positive(),
  setName: string().required().transform(toZh),
  setIcon: string().required(),
  setQuality: number().required().integer().positive(),
  setRewardId: number().required().integer().positive(),
  setCount: number().required().integer().positive(),
  categoryId: number().required().integer().positive(),
  categoryOrder: number().required().integer().positive(),
  categoryName: string().required().transform(toZh),
  categoryIcon: string().required(),
  categoryCount: number().required().integer().positive(),
  loreName1: string().required().transform(toZh),
  loreDescription1: string().required().transform(toZh),
  loreName2: string().required().transform(toZh),
  loreDescription2: string().required().transform(toZh),
  loreName3: string().required().transform(toZh),
  loreDescription3: string().required().transform(toZh),
  loreName4: string().required().transform(toZh),
  loreDescription4: string().required().transform(toZh),
  loreName5: string().required().transform(toZh),
  loreDescription5: string().required().transform(toZh),
});

const bookSchema = object({
  id: number().required().integer().positive(),
  bookId: number().required().integer().positive(),
  title: string().required().transform(toZh),
  titleEn: string().required(),
  slug: string().required(),
  icon: string().required().transform((x) => x.replace("//esoicons.uesp.net", "https://eso-cdn.denohub.com")),
  isLore: boolean().transform((x) => x === "Yes"),
  skill: string().required().transform(toZh),
  mediumIndex: string().required().transform(toZh),
  body: string().required().transform(() => ""),
});

const minedItemSummarySchema = object({
  id: ref("itemId"),
  name: string().required().transform(toZh),
  description: string().required().transform(toZh),
  style: string().required().transform(toZh),
  trait: string().required().transform(toZh),
  type: string().required().transform(toZh),
  specialType: string().required().transform(toZh),
  equipType: string().required().transform(toZh),
  weaponType: string().required().transform(toZh),
  armorType: string().required().transform(toZh),
  craftType: string().required().transform(toZh),
  enchantName: string().required().transform(toZh),
  enchantDesc: string().required().transform(toZh),
  setName: string().required().transform(toZh),
  traitDesc: string().required().transform(toZh),
  traitAbilityDesc: string().required().transform(toZh),
  materialLevelDesc: string().required().transform(toZh),
  isUnique: boolean().transform((x) => x === "Yes"),
  isUniqueEquipped: boolean().transform((x) => x === "Yes"),
  isVendorTrash: boolean().transform((x) => x === "Yes"),
  isArmorDecay: boolean().transform((x) => x === "Yes"),
  isConsumable: boolean().transform((x) => x === "Yes"),
  bindType: number().required().integer().positive(),
  recipeIndex: number().required().integer(),
  recipeListIndex: number().required().integer(),
  itemId: number().required().integer().positive(),
  icon: string().required().transform((x) => x.replace("//esoicons.uesp.net", "https://eso-cdn.denohub.com")),
});

const minedSkillLinesSchema = object({
  id: number().required().integer().positive(),
  name: string().required(),
  fullName: string().required().transform((x) => x.split("::").map(toZh).join("::")),
  skillType: string().required().transform(toZh),
  raceType: string().required().transform(toZh),
  classType: string().required().transform(toZh),
  numRanks: number().required().integer().positive(),
  totalXp: number().required().integer().positive(),
});

const npcSchema = object({
  id: number().required().integer().positive(),
  name: string().required().transform(toZh),
  level: number().required().integer().positive(),
  gender: number().required().integer().positive(),
  difficulty: number().required().integer().positive(),
  ppClass: string().required().transform(toZh),
  ppDifficulty: number().required().integer().positive(),
  count: number().required().integer().positive(),
  reaction: string().required().transform(toZh),
});

const setTypeSchema = string()
  .oneOf([
    "Crafted",
    "Monster",
    "Dropped",
    "Purchased",
    "Quest",
    "Achievement",
    "Vendor",
    "Other",
  ]);

function toBonusDescZh(en: string) {
  if (en === "") return "";

  const match = en.match(/^\((\d+)( perfected)? items?\) (.*)$/);
  if (!match) throw new Error(`Unexpected bonus description: ${en}`);

  const [, count, perfected, desc] = match;
  const prefix = `（${count}件${perfected ? "完美" : ""}）`;

  if (desc.startsWith("Adds ")) {
    // return desc.replace(/^Adds ([\d-%]+) (.*)$/, (match, num, stat) => `${prefix}增加${num}${toZh(stat)}`);
    return `${prefix}增加${toZh(desc.substring(5), true)}`;
  }

  return `${prefix}${toZh(desc, true)}`;
}

const setSummarySchema = object({
  gameId: number().required().integer().positive(),
  setName: string().required().transform(toZh),
  type: setTypeSchema.strict().required(),
  sources: array(string()).required().transform((_, x) => x.split(",").map((x: string) => toZh(x.trim()))),
  setMaxEquipCount: number().required().integer().positive(),
  setBonusCount: number().required().integer().positive(),
  itemSlots: string().required().transform(toZh),
  itemCount: number().required().integer().positive(),
  setBonusDesc1: string().required().transform(toBonusDescZh),
  setBonusDesc2: string().required().transform(toBonusDescZh),
  setBonusDesc3: string().required().transform(toBonusDescZh),
  setBonusDesc4: string().required().transform(toBonusDescZh),
  setBonusDesc5: string().required().transform(toBonusDescZh),
  setBonusDesc6: string().required().transform(toBonusDescZh),
  setBonusDesc7: string().required().transform(toBonusDescZh),
  "Internal ID": number().required().integer().positive(),
});

const zonesSchema = object({
  id: number().required().integer().positive(),
  zoneId: number().required().integer().positive(),
  zoneIndex: number().required().integer().positive(),
  zoneName: string().required().transform(toZh),
  subZoneName: string().required().transform(toZh),
  description: string().required().transform(toZh),
  mapName: string().required().transform(toZh),
  mapType: number().required().integer().positive(),
  mapContentType: number().required().integer().positive(),
  mapFilterType: number().required().integer().positive(),
  numPOIs: number().required().integer().positive(),
  allowsScaling: number().required().integer().positive(),
  allowsBattleScaling: number().required().integer().positive(),
  minLevel: number().required().integer().positive(),
  maxLevel: number().required().integer().positive(),
  isAvA1: number().required().integer().positive(),
  isAvA2: number().required().integer().positive(),
  isBattleground: number().required().integer().positive(),
  telvarBehavior: number().required().integer().positive(),
  isOutlaw: number().required().integer().positive(),
  isJustice: number().required().integer().positive(),
  isTutorial: number().required().integer().positive(),
  isGroupOwnable: number().required().integer().positive(),
  isDungeon: number().required().integer().positive(),
  dungeonDifficulty: number().required().integer().positive(),
  count: number().required().integer().positive(),
});

const poiSchema = object({
  id: number().required().integer().positive(),
  zoneId: number().required().integer().positive(),
  zoneName: string().required().transform(toZh),
  subZoneName: string().required().transform(toZh),
  objName: string().required().transform(toZh),
  objStartDesc: string().required().transform(toZh),
  objEndDesc: string().required().transform(toZh),
  mapIcon: string().required().transform((x: string) => x.replace(".dds", ".png")),
  poiIndex: number().required().integer().positive(),
  normX: number().required().positive(),
  normY: number().required().positive(),
  pinType: number().required().integer(),
  isShown: boolean().required(),
  poiType: number().required().integer().positive(),
  objLevel: number().required().integer(),
  count: number().required().integer().positive(),
});

const uniqueQuestSchema = object({
  id: number().required().integer().positive(),
  internalId: number().required().integer().positive(),
  zone: string().required().transform(toZh),
  locationZone: string().required().transform(toZh),
  name: string().required().transform(toZh),
  level: number().required().integer().positive(),
  type: string().required().transform(toZh),
  displayType: number().required().integer().positive(),
  backgroundText: string().required().transform(toZh),
  objective: string().required().transform(toZh),
  poiIndex: number().required().integer().positive(),
  goalText: string().required().transform(toZh),
  confirmText: string().required().transform(toZh),
  declineText: string().required().transform(toZh),
  endDialogText: string().required().transform(toZh),
  endJournalText: string().required().transform(toZh),
  endBackgroundText: string().required().transform(toZh),
  isShareable: number().required().integer().positive(),
  numTools: number().required().integer().positive(),
  hasTimer: number().required().integer().positive(),
  timerCaption: string().required().transform(toZh),
  timerDuration: number().required().integer().positive(),
  numSteps: number().required().integer().positive(),
  numRewards: number().required().integer().positive(),
  count: number().required().integer().positive(),
  uniqueId: number().required().integer().positive(),
});

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
  icon: string().required().transform((x: string) => `https://eso-cdn.denohub.com/${x.replace(".dds", ".png")}`),
});

const questStepSchema = object({
  id: number().required().integer().positive(),
  x: number().required().positive(),
  y: number().required().positive(),
  questId: number().required().integer().positive(),
  uniqueId: number().required().integer().positive(),
  stageIndex: number().required().integer().positive(),
  stepIndex: number().required().integer().positive(),
  text: string().required().transform(toZh),
  overrideText: string().required().transform(toZh),
  numConditions: number().required().integer().positive(),
  count: number().required().integer().positive(),
});

const collectiblesSchema = object({
  id: number().required().integer().positive(),
  name: string().required().transform(toZh),
  nickname: string().required().transform(toZh),
  description: string().required().transform(toZh),
  // TODO
});

const schemaMap = {
  achievementCategories: achievementCategoriesSchema,
  achievementCriteria: achievementCriteriaSchema,
  achievements: achievementsSchema,
  book: bookSchema,
  setSummary: setSummarySchema,
  antiquityLeads: antiquityLeadsSchema,
  zones: zonesSchema,
  minedSkillLines: minedSkillLinesSchema,
  minedItemSummary: minedItemSummarySchema,
  npc: npcSchema,
  uniqueQuest: uniqueQuestSchema,
  questReward: questRewardSchema,
  questStep: questStepSchema,
  zonePois: poiSchema,
  collectibles: collectiblesSchema,
};

type Key = keyof typeof schemaMap;

/** 缩小语言包范围，让翻译更精准 */
const langMap: Record<Key | string, number[] | undefined> = {
  achievementCategories: [115337253],
};

/** 从网络或者缓存里获取任务详情 */
async function getRemoteFromCache(name: string, start: number) {
  const path = `.cache/${name}_${start}.html`;

  try {
    return await Deno.readTextFile(path);
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 10));
    const input = `https://esoitem.uesp.net/viewlog.php?record=${name}&start=${start}`;
    const response = await fetch(input);
    const data = await response.text();
    await Deno.writeTextFile(path, data);
    return data;
  }
}

async function getTotal<K extends keyof typeof schemaMap>(name: K) {
  const file = await getRemoteFromCache(name, 0);
  return Number(
    file.match(
      /Displaying \d+ of (\d+) records from \d+ to \d+\./,
    )?.[1] ?? 0,
  );
}

/** 解析内容 */
async function parseContent<K extends keyof typeof schemaMap>(
  name: K,
  start = 0,
): Promise<InferType<typeof schemaMap[K]>[]> {
  const file = await getRemoteFromCache(name, start);

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
      return schemaMap[name].cast(obj) as InferType<typeof schemaMap[K]>;
    });
}

function isSupportedRecord(record: string): record is keyof typeof schemaMap {
  return record in schemaMap;
}

async function saveToStrapi(data: InferType<typeof schemaMap[Key]>, local: boolean) {
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
    `${local ? "http://localhost:1337/api/" : "https://esoapi.denohub.com/api/"}quest-steps`,
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
  const name = Deno.args[0];
  const local = Deno.args[1] === "local";

  if (!isSupportedRecord(name)) {
    console.warn("暂不支持 %s 的解析", name);
    console.log("请尝试：");
    console.log(
      Object.keys(schemaMap)
        .map((x) => `deno task esoitem ${x}`)
        .join("\n"),
    );
    Deno.exit(1);
  }
  initLang(langMap[name]);

  const total = await getTotal(name);
  console.log(`共有 ${total} 条数据`);

  const result: any[] = [];
  for (let i = 0; i < 1; i += 500) {
    console.log(`正在解析第 ${i + 1} 到 ${Math.min(i + 500, total)} 条数据`);
    result.push(...await parseContent(name, i));
  }

  const failed = [];
  for (const data of result) {
    try {
      await saveToStrapi(data, local);
    } catch (e) {
      failed.push({ ...data, reason: e.message });
    }
  }

  Deno.writeTextFile(`gamedata/${name}.json`, JSON.stringify(failed, null, 2));
  console.log(`成功导入 ${result.length - failed.length} 条数据，失败 ${failed.length} 条`);
}
