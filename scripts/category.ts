import { unified } from "unified";
import rehypeParse from "rehype-parse";
import type { Element } from "hast";
import { select, selectAll } from "hast-util-select";
import { toString } from "nlcst-to-string";
import toZH from "./toZH.ts";

const NAME = "Books";

const NPC_URL = `https://en.uesp.net/w/index.php?title=Category:Online-${NAME}`;

type Item = string[];

async function fetchData(url: string): Promise<Item[] | []> {
  const html = await fetch(url).then((res) => res.text());

  const root = unified()
    .use(rehypeParse)
    .parse(html);

  const list = selectAll("#mw-pages ul li a", root) as Element[];
  const nextPage = (selectAll("#mw-pages > a", root) as Element[])
    .find((x) => toString(x) === "next page");

  return list.map((x) => {
    const en = toString(x)
      .replace("Online:", "")
      .replace("(NPC)", "")
      .replace("(Condition)", "")
      .replace("(quest)", "")
      .trim();
    return [en, toZH(en), x.properties!.href as string];
  }).concat(nextPage ? await fetchData(`https://en.uesp.net${nextPage.properties!.href}`) : []);
}

if (import.meta.main) {
  const list = await fetchData(NPC_URL);
  const file = `src/data/category/${NAME.toLowerCase()}.json`;
  await Deno.writeTextFile(file, JSON.stringify(list, null, 2));
}
