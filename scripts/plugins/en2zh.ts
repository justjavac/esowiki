import { type Plugin } from "unified";
import type { Root } from "hast";
import { visit } from "unist-util-visit";
import { isElement } from "hast-util-is-element";
import toZH, { isEnglish } from "../toZH.ts";

const en2zh: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node) => {
    if (isElement(node, "a") && node.properties?.title && isEnglish(node.properties.title as string)) {
      const en = (node.properties.title as string).replace("Online:", "");
      const zh = toZH(en);
      node.properties!.title = isEnglish(zh) ? zh : `${zh} (${en})`;
    }
  });

  visit(tree, "text", (node) => {
    if (node.value) {
      node.value = toZH(node.value);
    }
  });
};

export default en2zh;
