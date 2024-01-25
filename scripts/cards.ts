const cards = [];

for (let i = 1; i <= 44; i++) {
  const response = await fetch("https://teslegends.pro/dc/do.php", {
    method: "POST",
    body: `filter%5Battribute%5D%5B%5D=all&srt=3&direct=1&page=${i}&lib=1`,
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "cache-control": "no-cache",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      pragma: "no-cache",
      "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
    },
    referrerPolicy: "strict-origin-when-cross-origin",
    referrer: "https://teslegends.pro/cards/",
    mode: "cors",
    credentials: "include",
  });

  const { data } = await response.json();

  cards.push(...data);

  Deno.writeTextFile(`gamedata/cards.json`, JSON.stringify(cards, null, 2));
}
