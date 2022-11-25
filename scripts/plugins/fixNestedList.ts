import { type Plugin } from "unified";
import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";
import { isElement } from "hast-util-is-element";

export const fixNestedList: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node, index, parent) => {
    if (isElement(node, "ul") && isElement(parent, "ul")) {
      parent!.children.splice(index!, 1);
      const previous = parent!.children[index! - 1] as Element;
      previous.children.push(node);
    }
  });
};
