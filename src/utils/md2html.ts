import { marked } from "marked";

export function md2html(md: string): string {
  return marked(md);
}
