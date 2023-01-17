#!/usr/bin/env -S deno run --allow-env --allow-net --allow-read --allow-write

// deno-lint-ignore-file no-explicit-any
import { readLines } from "https://deno.land/std@0.173.0/io/read_lines.ts";
import { decompress } from "https://deno.land/x/zip@v1.2.3/mod.ts";

const ITEM: [string, number][] = [
  [
    "翡翠",
    810,
  ],
  [
    "绿松石",
    813,
  ],
  [
    "绿宝石",
    4442,
  ],
  [
    "石英",
    4456,
  ],
  [
    "红宝石",
    4486,
  ],
  [
    "黄水晶",
    16291,
  ],
  [
    "火焰蛋白石",
    23149,
  ],
  [
    "红玉髓",
    23165,
  ],
  [
    "石榴石",
    23171,
  ],
  [
    "蓝宝石",
    23173,
  ],
  [
    "橄榄石",
    23203,
  ],
  [
    "紫水晶",
    23204,
  ],
  [
    "钻石",
    23219,
  ],
  [
    "贵榴石",
    23221,
  ],
  [
    "血石",
    30219,
  ],
  [
    "红玛瑙",
    30221,
  ],
  [
    "加固奈恩核心",
    56862,
  ],
  [
    "强效奈恩核心",
    56863,
  ],
  [
    "钴",
    135155,
  ],
  [
    "锑",
    135156,
  ],
  [
    "锌",
    135157,
  ],
  [
    "钴粉",
    135158,
  ],
  [
    "锑粉",
    135159,
  ],
  [
    "锌粉",
    135160,
  ],
  [
    "黎明晶石",
    139409,
  ],
  [
    "钛",
    139410,
  ],
  [
    "琥珀石",
    139411,
  ],
  [
    "润滑蜡",
    139412,
  ],
  [
    "集簇石",
    139413,
  ],
  [
    "罗刹石",
    139414,
  ],
  [
    "黎明晶石粉",
    139415,
  ],
  [
    "钛粉",
    139416,
  ],
  [
    "琥珀石粉",
    139417,
  ],
  [
    "粉状镀金蜡",
    139418,
  ],
  [
    "集簇石粉",
    139419,
  ],
  [
    "罗刹石粉",
    139420,
  ],
];

async function download() {
  const response = await fetch("https://us.tamrieltradecentre.com/download/PriceTable");
  const file = await Deno.open("./PriceTable.zip", { write: true, create: true });
  await response.body?.pipeTo(file.writable);
  try {
    await Deno.remove("./PriceTable", { recursive: true });
    // deno-lint-ignore no-empty
  } catch {}
  await decompress("./PriceTable.zip", "PriceTable");
  await Deno.remove("./PriceTable.zip");
}

async function lua2js(filename: string, exportName: string) {
  const fileReader = await Deno.open(`PriceTable/${filename}`);

  let content = "";

  for await (const line of readLines(fileReader)) {
    if (line.startsWith("self")) {
      content += line;
      break;
    }
  }

  const data = content
    .replaceAll("[", "")
    .replaceAll("]", "")
    .replaceAll("=", ":")
    .replaceAll("-1", '"-1"')
    .replaceAll(`self.${exportName}:`, `export const ${exportName} = `)
    .replace("end\r\n", "");
  await Deno.writeTextFile(`scripts/tmp/${exportName}.js`, data);
}

async function getItemId(name: string) {
  const { ItemLookUpTable } = await import("./tmp/ItemLookUpTable.js");
  for (const [key, value] of Object.entries(ItemLookUpTable)) {
    if (key !== name) {
      continue;
    }

    const values = Object.values(value);
    if (values.length > 1) {
      console.error(key);
    }

    return values[0];
  }
}

async function getPrice(name: string) {
  const { PriceTable } = await import("./tmp/PriceTable.js");

  const id = await getItemId(name);

  for (const [key, value] of Object.entries(PriceTable.Data)) {
    if (key !== String(id)) continue;

    const values = Object.values(value);
    return Object.values(values[0][1])[0];
  }
}

async function saveToStrapi(data: Record<string, unknown>) {
  const token = Deno.env.get("STRAPI_TOKEN");

  if (token == null) {
    throw new Error("没有设置 STRAPI_TOKEN 环境变量");
  }

  const response = await fetch(`https://esoapi.denohub.com/api/prices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("STRAPI_TOKEN")}`,
    },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message);
  }
}

if (import.meta.main) {
  while (true) {
    try {
      await download();
      await lua2js("ItemLookUpTable_ZH.lua", "ItemLookUpTable");
      await lua2js("PriceTableNA.lua", "PriceTable");

      const prices = ITEM.map(async (item) => {
        const x: any = await getPrice(item[0]);
        return ({ ...x, itemId: item[1] });
      });

      const failed = [];
      for await (const item of prices) {
        try {
          const data: Record<string, number> = {};
          data.avg = item.Avg || undefined;
          data.max = item.Max || undefined;
          data.min = item.Min || undefined;
          data.suggested = item.SuggestedPrice || undefined;
          data.entryCount = item.EntryCount || undefined;
          data.amountCount = item.AmountCount || undefined;
          data.item = item.itemId || undefined;
          await saveToStrapi(data);
        } catch (e) {
          failed.push({ ...item, reason: e.message });
        }
      }

      console.log(`失败 ${failed.length} 条`);
    } catch (error) {
      console.error(error);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1000 * 60 * 60 * 24));
    }
  }
}
