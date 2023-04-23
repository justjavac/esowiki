import { type Plugin } from "unified";
import type { Root } from "hast";
import { visit } from "unist-util-visit";
import { isElement } from "hast-util-is-element";

const replaceHref: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node) => {
    if (isElement(node, "a") && node.properties?.href) {
      node.properties.href = (node.properties.href as string).replace(
        "https://www.elderscrollsonline.com/cn/news/post/",
        "/news/post/",
      );
    }
  });
};

export default replaceHref;
