import { type Plugin } from "unified";
import type { Root } from "hast";
import { select, selectAll } from "hast-util-select";
import { h } from "hastscript";
import { toString } from "nlcst-to-string";

/** ESO 官方新闻 */
const esoNews: Plugin<[], Root> = () => (tree) => {
  const title = toString(select("#post-title h1", tree));
  const pubDate = toString(select("#post-title .date", tree));
  const image = (select("#blog-body .lead-img", tree)?.properties?.src as string)?.replace(
    "esosslfiles-a.akamaihd.net",
    "eso-cdn.denohub.com",
  );
  const description = toString(select("#blog-body p", tree));
  const tags = selectAll("#blog-body .tags a", tree).map((tag) => toString(tag));

  const frontmatter = [
    `---`,
    `title: ${title}`,
    `description: ${description}`,
    `pubDate: ${pubDate}`,
    `image: ${image}`,
    `tags: ${JSON.stringify(tags)}`,
    ``,
    `---`,
  ];

  const root = h(null, select("#blog-body", tree));
  root.children.unshift(h("frontmatter", frontmatter.map((x) => h("text", x))));
  select("p", root)!.children = []; // remove description
  return root;
};

export default esoNews;
