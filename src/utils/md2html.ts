import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeRaw from "rehype-raw";
import rehypeExternalLinks from "rehype-external-links";

export function md2html(md: string): string {
  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer", "nofollow"] })
    .use(rehypeStringify)
    .processSync(md);

  return file.toString();
}
