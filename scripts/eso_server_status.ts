const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36";

const CSRF_TOKEN_RE = /XSRF-TOKEN=([^;]+)/;

const matchRequestHeaders = async (): Promise<Headers> => {
  const response = await fetch("https://esoserverstatus.net/", {
    headers: {
      Accept: "text/html",
      "user-agent": DEFAULT_USER_AGENT,
    },
  });

  const rawCookieHeader = response.headers.get("set-cookie") || "";
  const csrfTokenValue = rawCookieHeader.match(CSRF_TOKEN_RE)?.[1] || "";

  return new Headers({
    "user-agent": DEFAULT_USER_AGENT,
    "x-requested-with": "XMLHttpRequest",
    "x-xsrf-token": csrfTokenValue,
  });
};

const response = await fetch("https://esoserverstatus.net/api/refresh", {
  headers: await matchRequestHeaders(),
});

const json = await response.json();

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
    console.error(await response.text());
  }
}

if (import.meta.main) {
  await saveToStrapi(json);
}
