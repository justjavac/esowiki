const query = new URLSearchParams();
query.set("sort[0]", "id:asc");
query.set("populate", "*");

const response = await fetch(
  `https://esoapi.denohub.com/api/mundus-stones?${query}`
);
const result = await response.json();
const data = result?.data;

const html = data
  .map(
    (x: any) =>
      `-- [${x.attributes.name}](${x.attributes.slug}.md) - ${x.attributes.effect}`
  )
  .join("\n");

console.log(html);
