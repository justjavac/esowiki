declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof typeof entryMap> =
		(typeof entryMap)[C][keyof (typeof entryMap)[C]] & Render;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<
				import('astro/zod').AnyZodObject,
				import('astro/zod').AnyZodObject
		  >;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	type BaseCollectionConfig<S extends BaseSchema> = {
		schema?: S;
		slug?: (entry: {
			id: CollectionEntry<keyof typeof entryMap>['id'];
			defaultSlug: string;
			collection: string;
			body: string;
			data: import('astro/zod').infer<S>;
		}) => string | Promise<string>;
	};
	export function defineCollection<S extends BaseSchema>(
		input: BaseCollectionConfig<S>
	): BaseCollectionConfig<S>;

	type EntryMapKeys = keyof typeof entryMap;
	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidEntrySlug<C extends EntryMapKeys> = AllValuesOf<(typeof entryMap)[C]>['slug'];

	export function getEntryBySlug<
		C extends keyof typeof entryMap,
		E extends ValidEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getCollection<C extends keyof typeof entryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof typeof entryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	type InferEntrySchema<C extends keyof typeof entryMap> = import('astro/zod').infer<
		Required<ContentConfig['collections'][C]>['schema']
	>;

	type Render = {
		render(): Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	};

	const entryMap: {
		"news": {
"62811.md": {
  id: "62811.md",
  slug: "62811",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"62813.md": {
  id: "62813.md",
  slug: "62813",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"62817.md": {
  id: "62817.md",
  slug: "62817",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"62825.md": {
  id: "62825.md",
  slug: "62825",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"62833.md": {
  id: "62833.md",
  slug: "62833",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"62839.md": {
  id: "62839.md",
  slug: "62839",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"62845.md": {
  id: "62845.md",
  slug: "62845",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"62847.md": {
  id: "62847.md",
  slug: "62847",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"62861.md": {
  id: "62861.md",
  slug: "62861",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"62901.md": {
  id: "62901.md",
  slug: "62901",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"62925.md": {
  id: "62925.md",
  slug: "62925",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"62959.md": {
  id: "62959.md",
  slug: "62959",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"62961.md": {
  id: "62961.md",
  slug: "62961",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"62997.md": {
  id: "62997.md",
  slug: "62997",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"62999.md": {
  id: "62999.md",
  slug: "62999",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63009.md": {
  id: "63009.md",
  slug: "63009",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63015.md": {
  id: "63015.md",
  slug: "63015",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63027.md": {
  id: "63027.md",
  slug: "63027",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63033.md": {
  id: "63033.md",
  slug: "63033",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63067.md": {
  id: "63067.md",
  slug: "63067",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63073.md": {
  id: "63073.md",
  slug: "63073",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63075.md": {
  id: "63075.md",
  slug: "63075",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63077.md": {
  id: "63077.md",
  slug: "63077",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63087.md": {
  id: "63087.md",
  slug: "63087",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63101.md": {
  id: "63101.md",
  slug: "63101",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63107.md": {
  id: "63107.md",
  slug: "63107",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63113.md": {
  id: "63113.md",
  slug: "63113",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63115.md": {
  id: "63115.md",
  slug: "63115",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63121.md": {
  id: "63121.md",
  slug: "63121",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63139.md": {
  id: "63139.md",
  slug: "63139",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63149.md": {
  id: "63149.md",
  slug: "63149",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63163.md": {
  id: "63163.md",
  slug: "63163",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63169.md": {
  id: "63169.md",
  slug: "63169",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63175.md": {
  id: "63175.md",
  slug: "63175",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63247.md": {
  id: "63247.md",
  slug: "63247",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63249.md": {
  id: "63249.md",
  slug: "63249",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63255.md": {
  id: "63255.md",
  slug: "63255",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63257.md": {
  id: "63257.md",
  slug: "63257",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63295.md": {
  id: "63295.md",
  slug: "63295",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63301.md": {
  id: "63301.md",
  slug: "63301",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63311.md": {
  id: "63311.md",
  slug: "63311",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63317.md": {
  id: "63317.md",
  slug: "63317",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63319.md": {
  id: "63319.md",
  slug: "63319",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63329.md": {
  id: "63329.md",
  slug: "63329",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63335.md": {
  id: "63335.md",
  slug: "63335",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63337.md": {
  id: "63337.md",
  slug: "63337",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63343.md": {
  id: "63343.md",
  slug: "63343",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63349.md": {
  id: "63349.md",
  slug: "63349",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63363.md": {
  id: "63363.md",
  slug: "63363",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63377.md": {
  id: "63377.md",
  slug: "63377",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63379.md": {
  id: "63379.md",
  slug: "63379",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63381.md": {
  id: "63381.md",
  slug: "63381",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63391.md": {
  id: "63391.md",
  slug: "63391",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63401.md": {
  id: "63401.md",
  slug: "63401",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63403.md": {
  id: "63403.md",
  slug: "63403",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63417.md": {
  id: "63417.md",
  slug: "63417",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63419.md": {
  id: "63419.md",
  slug: "63419",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63437.md": {
  id: "63437.md",
  slug: "63437",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63443.md": {
  id: "63443.md",
  slug: "63443",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63457.md": {
  id: "63457.md",
  slug: "63457",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63467.md": {
  id: "63467.md",
  slug: "63467",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63477.md": {
  id: "63477.md",
  slug: "63477",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63483.md": {
  id: "63483.md",
  slug: "63483",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63493.md": {
  id: "63493.md",
  slug: "63493",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63495.md": {
  id: "63495.md",
  slug: "63495",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63497.md": {
  id: "63497.md",
  slug: "63497",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63499.md": {
  id: "63499.md",
  slug: "63499",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63501.md": {
  id: "63501.md",
  slug: "63501",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63503.md": {
  id: "63503.md",
  slug: "63503",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63509.md": {
  id: "63509.md",
  slug: "63509",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63511.md": {
  id: "63511.md",
  slug: "63511",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63513.md": {
  id: "63513.md",
  slug: "63513",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63581.md": {
  id: "63581.md",
  slug: "63581",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63613.md": {
  id: "63613.md",
  slug: "63613",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63631.md": {
  id: "63631.md",
  slug: "63631",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
"63645.md": {
  id: "63645.md",
  slug: "63645",
  body: string,
  collection: "news",
  data: InferEntrySchema<"news">
},
},

	};

	type ContentConfig = typeof import("../src/content/config");
}
