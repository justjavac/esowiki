import { type Plugin } from "unified";
import type { Root } from "hast";
import { visit } from "unist-util-visit";
import { isElement } from "hast-util-is-element";
import toZH from "../toZH.ts";

const en2zh: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node) => {
    if (isElement(node, "a") && node.properties?.title) {
      const title = (node.properties.title as string).replace("Online:", "");
      node.properties!.title = toZH(title);
    }
  });

  visit(tree, "text", (node) => {
    if (node.value) {
      node.value = toZH(node.value);
    }
  });
};

export default en2zh;
