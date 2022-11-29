import { Set } from "@/components";
import { toSvg } from "@/utils";
import { h } from "preact";

export async function get() {
  const el = h(Set, { name: "test" });
  return new Response(await toSvg(el), {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
    },
  });
}
