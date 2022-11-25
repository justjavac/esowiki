import { type Plugin } from "unified";
import type { Root } from "hast";
import { visit } from "unist-util-visit";
import { isElement } from "hast-util-is-element";

const imgOriginSrc: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node) => {
    if (isElement(node, "img")) {
      if (node.properties?.src == null) return;
      node.properties.src = (node.properties.src as string).replace(/\/\d+px-.*/, "");
    }
  });
};

export default imgOriginSrc;
