import { assertEquals } from "asserts";
import { apply, resove } from "./template.ts";

Deno.test("解析单个", () => {
  const template = "Foo <<1>> Bar";

  assertEquals(resove("Foo 123 Bar", template), { 1: "123" });
  assertEquals(resove("foo 123 bar", template), undefined);
  assertEquals(resove("Foo 123 Bar xxx", template), undefined);
  assertEquals(resove("Foo hello Bar", template), { 1: "hello" });
  assertEquals(resove("foo bar", template), undefined);
});

Deno.test("解析开始", () => {
  const template = "<<c>> Bar";

  assertEquals(resove("123 Bar", template), { c: "123" });
  assertEquals(resove("12-3 Bar", template), { c: "12-3" });
  assertEquals(resove("hello Bar", template), { c: "hello" });
  assertEquals(resove("Foo bar", template), undefined);
});

Deno.test("解析结束", () => {
  const template = "Foo <<1>>";

  assertEquals(resove("Foo 123", template), { 1: "123" });
  assertEquals(resove("Foo 123 xxx", template), { 1: "123 xxx" });
  assertEquals(resove("Foo hello", template), { 1: "hello" });
  assertEquals(resove("Foo", template), undefined);
});

Deno.test("解析多个", () => {
  const template = "Foo <<foo>> and <<bar>> Bar";

  assertEquals(resove("Foo 40 and 1752 Bar", template), { foo: "40", bar: "1752" });
  assertEquals(resove("Foo hello and world Bar", template), { foo: "hello", bar: "world" });
  assertEquals(resove("Add 123 Maximum Stamina", template), undefined);
});

Deno.test("eso 套装效果解析", () => {
  const template = "Gain <<1>> and <<2>> at all times, increasing <<c1>>.";
  const en = "Gain Major Gallop and Major Expedition at all times, increasing 30%.";

  assertEquals(resove(en, template), { 1: "Major Gallop", 2: "Major Expedition", c1: "30%" });
});

Deno.test("构建单个", () => {
  const template = "Foo <<1>> Bar";

  assertEquals(apply(template, { 1: "123" }), "Foo 123 Bar");
  assertEquals(apply(template, { 1: "123 3434" }), "Foo 123 3434 Bar");
  assertEquals(apply(template, { 2: "123" }), "Foo undefined Bar");
});

Deno.test("构建 eso 套装效果", () => {
  const template = "Gain <<1>> and <<2>> at all times, increasing <<c1>>.";
  const en = "Gain Major Gallop and Major Expedition at all times, increasing 30%.";

  assertEquals(apply(template, { 1: "Major Gallop", 2: "Major Expedition", c1: "30%" }), en);
});
