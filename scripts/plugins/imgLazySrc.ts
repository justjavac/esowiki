import { type Plugin } from "unified";
import type { Root } from "hast";
import { visit } from "unist-util-visit";
import { isElement } from "hast-util-is-element";

const imgLazySrc: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node) => {
    if (isElement(node, "img")) {
      if (node.properties?.src == null) return;
      node.properties.src = (node.properties.dataLazySrc as string)?.replace(
        "esosslfiles-a.akamaihd.net",
        "eso-cdn.denohub.com",
      );
    }
  });
};

export default imgLazySrc;
