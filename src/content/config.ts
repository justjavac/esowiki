import { defineCollection, z } from "astro:content";
const newsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    image: z.string(),
    tags: z.array(z.string()),
  }),
});

export const collections = {
  news: newsCollection,
};
