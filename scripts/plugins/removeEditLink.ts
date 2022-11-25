import { type Plugin } from "unified";
import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";
import { isElement } from "hast-util-is-element";

function isEditLink(node: Element, parent: Element) {
  return isElement(node, "span") &&
    (node.properties?.className as string[])?.includes("mw-editsection");
}

const removeEditLink: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node, index, parent) => {
    if (isEditLink(node, parent as Element)) {
      parent!.children.splice(index!, 1);
    }
  });
};

export default removeEditLink;
