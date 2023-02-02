let i = 1;
const permalinks: Record<string, string> = {};

while (true) {
  const query = new URLSearchParams();
  query.set("pagination[pageSize]", "500");
  query.set("pagination[page]", String(i));

  const response = await fetch(`https://esoapi.denohub.com/api/posts?${query}`);
  const { data } = await response.json();

  if (data.length === 0) {
    break;
  }

  for (const x of data) {
    permalinks[x.attributes.name] = x.attributes.slug;
  }

  i++;
}

await Deno.writeTextFile("gamedata/permalinks.json", JSON.stringify(permalinks, null, 2));
