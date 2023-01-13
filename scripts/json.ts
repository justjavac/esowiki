async function saveToStrapi(data: Record<string, unknown>) {
  const token = Deno.env.get("STRAPI_TOKEN");

  if (token == null) {
    throw new Error("没有设置 STRAPI_TOKEN 环境变量");
  }

  const response = await fetch(`https://esoapi.denohub.com/api/books`, {
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
  const file = Deno.args[0];

  const data = JSON.parse(await Deno.readTextFile(file)) as Record<string, unknown>[];

  const failed = [];
  for (const item of data) {
    try {
      item.categoryIndex = item.categoryIndex || undefined;
      item.collectionIndex = item.collectionIndex || undefined;
      item.bookIndex = item.bookIndex || undefined;
      item.guildIndex = item.guildIndex || undefined;
      await saveToStrapi(item);
    } catch (e) {
      failed.push({ ...item, reason: e.message });
    }
  }

  Deno.writeTextFile(file, JSON.stringify(failed, null, 2));
  console.log(`成功导入 ${data.length - failed.length} 条数据，失败 ${failed.length} 条`);
}
