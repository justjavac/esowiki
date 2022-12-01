import { assertEquals } from "asserts";
import { resove } from "./template.ts";

Deno.test("解析单个", () => {
  const template = "Foo <<1>> Bar";

  assertEquals(resove("Foo 123 Bar", template), ["123"]);
  assertEquals(resove("foo 123 bar", template), undefined);
  assertEquals(resove("Foo 123 Bar xxx", template), undefined);
  assertEquals(resove("Foo hello Bar", template), ["hello"]);
  assertEquals(resove("foo bar", template), undefined);
});

Deno.test("解析开始", () => {
  const template = "<<1>> Bar";

  assertEquals(resove("123 Bar", template), ["123"]);
  assertEquals(resove("12-3 Bar", template), ["12-3"]);
  assertEquals(resove("hello Bar", template), ["hello"]);
  assertEquals(resove("Foo bar", template), undefined);
});

Deno.test("解析结束", () => {
  const template = "Foo <<1>>";

  assertEquals(resove("Foo 123", template), ["123"]);
  assertEquals(resove("Foo 123 xxx", template), ["123 xxx"]);
  assertEquals(resove("Foo hello", template), ["hello"]);
  assertEquals(resove("Foo", template), undefined);
});

Deno.test("解析多个", () => {
  const template = "Foo <<1>> and <<2>> Bar";

  assertEquals(resove("Foo 40 and 1752 Bar", template), ["40", "1752"]);
  assertEquals(resove("Foo hello and world Bar", template), ["hello", "world"]);
  assertEquals(resove("Add 123 Maximum Stamina", template), undefined);
});

Deno.test("eso 套装效果解析", () => {
  const template = "Gain <<1>> and <<2>> at all times, increasing <<3>>.";
  const en = "Gain Major Gallop and Major Expedition at all times, increasing 30%.";

  assertEquals(resove(en, template), ["Major Gallop", "Major Expedition", "30%"]);
});
