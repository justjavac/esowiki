interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
}

const response = await fetch(`https://api.github.com/repos/justjavac/esomap/contributors`);
const contributors: Contributor[] = (await response.json()).map((item: Contributor) => ({
  login: item.login,
  avatar_url: item.avatar_url,
  html_url: item.html_url,
}));

await Deno.writeTextFile("src/data/contributors.json", JSON.stringify(contributors, null, 2));
