import { assertEquals } from "asserts";
import { parse } from "./template.ts";

Deno.test("解析单个", () => {
  const template = "Foo <<1>> Bar";

  assertEquals(parse("Foo 123 Bar", template), ["123"]);
  assertEquals(parse("foo 123 bar", template), undefined);
  assertEquals(parse("Foo 123 Bar xxx", template), undefined);
  assertEquals(parse("Foo hello Bar", template), ["hello"]);
  assertEquals(parse("foo bar", template), undefined);
});

Deno.test("解析开始", () => {
  const template = "<<1>> Bar";

  assertEquals(parse("123 Bar", template), ["123"]);
  assertEquals(parse("12-3 Bar", template), ["12-3"]);
  assertEquals(parse("hello Bar", template), ["hello"]);
  assertEquals(parse("Foo bar", template), undefined);
});

Deno.test("解析结束", () => {
  const template = "Foo <<1>>";

  assertEquals(parse("Foo 123", template), ["123"]);
  assertEquals(parse("Foo 123 xxx", template), undefined);
  assertEquals(parse("Foo hello", template), ["hello"]);
  assertEquals(parse("Foo", template), undefined);
});

Deno.test("解析多个", () => {
  const template = "Foo <<1>> and <<2>> Bar";

  assertEquals(parse("Foo 40 and 1752 Bar", template), ["40", "1752"]);
  assertEquals(parse("Foo hello and world Bar", template), ["hello", "world"]);
  assertEquals(parse("Add 123 Maximum Stamina", template), undefined);
});

Deno.test("eso 套装效果解析", () => {
  const template = "Gain <<1>> and <<2>> at all times, increasing your Movement Speed and Mounted Speed by <<3>>.";
  const en =
    "Gain Major Gallop and Major Expedition at all times, increasing your Movement Speed and Mounted Speed by 30%.";

  assertEquals(parse(en, template), ["Major Gallop", "Major Expedition", "30%"]);
});
