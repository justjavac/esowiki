import { assert, assertEquals } from "asserts";
import { parseSlot } from "./parseSlot.ts";

Deno.test("解析单个", () => {
  const template = "Foo <<1>> Bar";

  assertEquals(parseSlot("Foo 123 Bar", template), ["123"]);
  assertEquals(parseSlot("Foo 123 Bar xxx", template), undefined);
  assertEquals(parseSlot("Foo hello Bar", template), ["hello"]);
  assertEquals(parseSlot("Foo bar", template), undefined);
});

Deno.test("解析开始", () => {
  const template = "<<1>> Bar";

  assertEquals(parseSlot("123 Bar", template), ["123"]);
  assertEquals(parseSlot("hello Bar", template), ["hello"]);
  assertEquals(parseSlot("Foo bar", template), undefined);
});

Deno.test("解析结束", () => {
  const template = "Foo <<1>>";

  assertEquals(parseSlot("Foo 123", template), ["123"]);
  assertEquals(parseSlot("Foo 123 xxx", template), undefined);
  assertEquals(parseSlot("Foo hello", template), ["hello"]);
  assertEquals(parseSlot("Foo", template), undefined);
});

Deno.test("解析多个", () => {
  const template = "Foo <<1>> and <<2>> Bar";

  assertEquals(parseSlot("Foo 40 and 1752 Bar", template), ["40", "1752"]);
  assertEquals(parseSlot("Foo hello and world Bar", template), ["hello", "world"]);
  assertEquals(parseSlot("Add 123 Maximum Stamina", template), undefined);
});
