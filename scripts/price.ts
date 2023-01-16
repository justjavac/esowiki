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
  const lookup = await Deno.readTextFile("gamedata/ItemLookUpTable_ZH.lua");

  const tmp = `function TamrielTradeCentre:LoadItemLookUpTable()`;
  // 删除第一行
  const data = lookup
    .replace(tmp, "")
    .replaceAll("[", "")
    .replaceAll("]", "")
    .replaceAll("=", ":")
    .replaceAll("self.ItemLookUpTable:", "export const ItemLookUpTable = ")
    .replace("end\r\n", "");
  await Deno.writeTextFile("gamedata/ItemLookUpTable_ZH.js", data);

  Deno.exit();

  const content = await Deno.readTextFile("gamedata/PriceTableNA.lua");

  const regex =
    /\[3790\]={\[\d+\]={\[\d+\]={\[\d+\]={\[\"Avg\"\]=([0-9.]+),\[\"Max\"\]=([0-9.]+),\[\"Min\"\]=([0-9.]+),\[\"EntryCount\"\]=([0-9.]+),\[\"AmountCount\"\]=([0-9.]+),\[\"SuggestedPrice\"\]=([0-9.]+),},},},},/;

  const [, avg, max, min, entryCount, amountCount, suggestedPrice] = content.match(regex) || [];

  console.log({ avg, max, min, entryCount, amountCount, suggestedPrice });

  // const failed = [];
  // for (const item of data) {
  //   try {
  //     item.categoryIndex = item.categoryIndex || undefined;
  //     item.collectionIndex = item.collectionIndex || undefined;
  //     item.bookIndex = item.bookIndex || undefined;
  //     item.guildIndex = item.guildIndex || undefined;
  //     await saveToStrapi(item);
  //   } catch (e) {
  //     failed.push({ ...item, reason: e.message });
  //   }
  // }

  // console.log(`成功导入 ${data.length - failed.length} 条数据，失败 ${failed.length} 条`);
}
