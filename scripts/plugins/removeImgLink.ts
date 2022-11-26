import { type Plugin } from "unified";
import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";
import { select } from "hast-util-select";
import { isElement } from "hast-util-is-element";

function isImageLink(node: Element) {
  if (node.properties?.className == null) return false;
  if (!Array.isArray(node.properties.className)) return false;

  return node.properties.className.includes("zl-link") ||
    node.properties.className.includes("image");
}

const removeImgLink: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node, index, parent) => {
    if (isElement(node, "a") && isImageLink(node)) {
      const img = select("img", node);
      if (img == null) return;
      parent!.children[index!] = img;
    }
  });
};

export default removeImgLink;
