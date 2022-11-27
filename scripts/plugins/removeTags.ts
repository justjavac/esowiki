import { type Plugin } from "unified";
import type { Root } from "hast";
import { SKIP, visit } from "unist-util-visit";
import { isElement } from "hast-util-is-element";

export const removeTags: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node, index, parent) => {
    if (isElement(node, "div") && (node.properties?.className as string[])?.includes("tags")) {
      parent!.children.splice(index!, 1);
      return [SKIP, index];
    }
  });
};

export default removeTags;
