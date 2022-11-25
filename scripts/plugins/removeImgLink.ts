import { type Plugin } from "unified";
import type { Root } from "hast";
import { visit } from "unist-util-visit";
import { select } from "hast-util-select";
import { isElement } from "hast-util-is-element";

export const removeImgLink: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node, index, parent) => {
    if (isElement(node, "a") && (node.properties?.className as string[])?.includes("zl-link")) {
      const img = select("img", node);
      if (img == null) return;
      parent!.children[index!] = img;
    }
  });
};
