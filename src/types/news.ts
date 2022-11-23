export interface Frontmatter {
  title: string;
  description: string;
  image: string;
  tags: string[];
  pubDate: string;
}

export interface Post {
  file: string;
  url: string;
  rawContent: string;
  frontmatter: Frontmatter;
}
