#!/usr/bin/env -S deno run --allow-env --allow-net

import { DOMParser, Element } from "https://deno.land/x/deno_dom@v0.1.33-alpha/deno-dom-wasm.ts";
import toZh, { en2zh, initLang } from "./toZH.ts";

const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36";

async function getDailyLoginRewards() {
  const headers = new Headers({
    "user-agent": DEFAULT_USER_AGENT,
  });

  const response = await fetch("https://eso-hub.com/en/daily-login-rewards", { headers });
  const html = await response.text();

  const document = new DOMParser().parseFromString(html, "text/html");
  if (document === null) return [];
  const loginRewards = [...document.querySelectorAll(".login-reward")].map((el) => ({
    name: (el as Element).querySelector(".reward-name")?.textContent?.trim() || "",
    amount: (el as Element).querySelector(".amount")?.textContent?.trim(),
    milestone: Boolean((el as Element).querySelector(".milestone img")?.getAttribute("src")),
    thumb: (el as Element).querySelector("img")?.getAttribute("src") ?? "/storage/icons/unknown.png",
  })).map((x) => ({
    ...x,
    name: toZh(x.name),
    thumb: `https://eso-cdn.denohub.com${x.thumb}`,
  }));

  return loginRewards;
}

async function saveToStrapi(data: unknown) {
  const response = await fetch(`https://esoapi.denohub.com/api/daily-login-reward`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("STRAPI_TOKEN")}`,
    },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    throw new Error(`Failed to save to strapi: ${response.status} ${response.statusText}`);
  }
}

if (import.meta.main) {
  initLang();

  while (true) {
    try {
      const rewards = await getDailyLoginRewards();
      await saveToStrapi({ rewards });
      console.log("Success at " + new Date().toString());
    } catch (error) {
      console.error(error);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1000 * 60 * 60 * 24));
    }
  }
}
