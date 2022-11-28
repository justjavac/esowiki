import type { Plugin } from "unified";
import type { Root } from "hast";
import { visit } from "unist-util-visit";
import fs from "node:fs";

const rehypeUnreachableLink: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node) => {
    if (node.tagName === "a") {
      if (node.properties?.href == null) return;
      const href = node.properties.href as string;
      if (href.startsWith("http")) return;
      if (href.startsWith("#")) return;
      if (href.startsWith("mailto")) return;

      const path = "src/pages" + href + ".md";
      if (!fs.existsSync(path)) {
        node.properties.href = "";
        node.properties.className = ["unreachable-link text-red-500"];
      }
    }
  });
};

export default rehypeUnreachableLink;
