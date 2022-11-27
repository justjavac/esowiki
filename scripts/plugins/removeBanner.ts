import { type Plugin } from "unified";
import type { Element, Root } from "hast";
import { SKIP, visit } from "unist-util-visit";
import { isElement } from "hast-util-is-element";

function isBanner(node: Element, parent: Element) {
  return isElement(node, "div") &&
    (node.properties?.className as string[])?.includes("col-sm-12") &&
    (parent.properties?.className as string[])?.includes("blog-body-box");
}

const removeBanner: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node, index, parent) => {
    if (isBanner(node, parent as Element)) {
      parent!.children.splice(index!, 1);
      return [SKIP, index];
    }
  });
};

export default removeBanner;
