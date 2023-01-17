#!/usr/bin/env -S deno run --allow-env --allow-net

const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36";

const CSRF_TOKEN_RE = /XSRF-TOKEN=([^;]+)/;

/** 获取 xsrf-token */
async function getXsrfToken(): Promise<string> {
  const response = await fetch("https://esoserverstatus.net", {
    headers: {
      Accept: "text/html",
      "user-agent": DEFAULT_USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch CSRF token: ${response.status} ${response.statusText}`);
  }

  const rawCookieHeader = response.headers.get("set-cookie") || "";
  return rawCookieHeader.match(CSRF_TOKEN_RE)?.[1] || "";
}

async function getServerStatus(csrfToken: string) {
  const headers = new Headers({
    "user-agent": DEFAULT_USER_AGENT,
    "x-requested-with": "XMLHttpRequest",
    "x-xsrf-token": csrfToken,
  });

  return await fetch("https://esoserverstatus.net/api/refresh", { headers });
}

async function saveToStrapi(data: unknown) {
  const response = await fetch(`https://esoapi.denohub.com/api/server-status`, {
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
  let csrfTokenValue = await getXsrfToken();
  while (true) {
    try {
      let response = await getServerStatus(csrfTokenValue);
      if (response.status === 401) {
        csrfTokenValue = await getXsrfToken();
        response = await getServerStatus(csrfTokenValue);
      }
      const json = await response.json();
      await saveToStrapi(json);
      console.log("Success at " + new Date().toString());
    } catch (error) {
      console.error(error);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1000 * 60));
    }
  }
}
