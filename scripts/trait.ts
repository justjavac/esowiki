async function saveToStrapi(data: Record<string, unknown>) {
  const token = Deno.env.get("STRAPI_TOKEN");

  if (token == null) {
    throw new Error("没有设置 STRAPI_TOKEN 环境变量");
  }

  const response = await fetch(`https://esoapi.denohub.com/api/traits`, {
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

  const query = new URLSearchParams();
  query.set("filters[type][$endsWith]", "特质");
  query.set("populate", "*");

  const response = await fetch(`https://esoapi.denohub.com/api/items?${query}`);
  const { data } = await response.json();

  const failed = [];
  for (const item of data) {
    try {
      const data = {
        name: item.attributes.trait,
        type: item.attributes.type.replace("特质", ""),
        effect: item.attributes.traitDesc,
        material: item.id,
      };
      await saveToStrapi(data);
    } catch (e) {
      failed.push({ id: item.id, reason: e.message });
    }
  }

  console.log(`成功导入 ${data.length - failed.length} 条数据，失败 ${failed.length} 条`);
}
