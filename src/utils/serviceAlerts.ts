export type ServerStatus = "up" | "down" | "issues";

export type ServerSlug =
  | "pc_eu"
  | "pc_na"
  | "ps_eu"
  | "ps_na"
  | "xbox_eu"
  | "xbox_na"
  | "site_web"
  | "pts"
  | "web_forum"
  | "crown_store"
  | "eso_store"
  | "account_system";

export type ServerZone = "na" | "eu" | "unknown";

export type ServerSupport = "xbox" | "ps" | "pc" | "unknown";

export type ServiceAlertInfo = {
  raw: string;
  slug: ServerSlug;
  zone: ServerZone;
  support: ServerSupport;
  status: ServerStatus;
};

export interface ServiceAlert extends ServiceAlertInfo {
  timestamp: number;
}

export const toDate = (dateline: string): Date => {
  // 2022.06.13 - 05:40 UTC (01:40 EST)
  // 2022.06.13 - 02:40 UTC (2022.06.12 - 22:40 EST)
  // 2022.06.13 - 02:40 UTC (22:40 EDT)
  // 2022.06.13 - 02:40 UTC (2022.06.12 - 22:40 EDT)
  // 2022.06.21 - 4:45 EST (8:45 UTC)
  // 2022.06.20 - 10:00 EST (2022.06.21 - 02:00 UTC)
  // 2022.06.21 - 4:45 EDT (8:45 UTC)
  // 2022.06.20 - 10:00 EDT (2022.06.21 - 02:00 UTC)
  const [head, tail] = dateline.replace(")", "").split("(");

  // 2022.06.13 - 05:40 UTC | 2022.06.13 - 05:40UTC
  if (head.indexOf("UTC") > -1) {
    const [date, time] = head.split("-");
    return new Date(`${date.trim()} ${time.trim().replace("UTC", "")}`);
  }

  // 2022.06.13 - 05:40 UTC | 2022.06.13 - 05:40UTC
  if (tail.indexOf("-") > -1) {
    const [date, time] = head.split("-");
    return new Date(`${date.trim()} ${time.trim().replace("UTC", "")}`);
  } else {
    return new Date(
      `${head.split("-")[0].trim()} ${tail.trim().replace("UTC", "")}`,
    );
  }
};

export const toServerStatus = (raw: string): ServerStatus => {
  if (raw.includes("unavailable")) {
    return "down";
  }

  if (
    raw.includes("available") ||
    raw.includes("online") ||
    raw.includes("resolved")
  ) {
    return "up";
  }

  if (raw.includes("currently investigating") || raw.includes("interruption")) {
    return "issues";
  }

  return "down";
};

export const toServerSlugs = (raw: string): ServerSlug[] => {
  const slugs: ServerSlug[] = [];

  if (raw.includes("Xbox megaserver")) {
    if (raw.includes("North American")) {
      slugs.push("xbox_na");
    } else if (raw.includes("European")) {
      slugs.push("xbox_eu");
    } else {
      slugs.push("xbox_na");
      slugs.push("xbox_eu");
    }
  }

  if (raw.includes("PlayStation® megaserver")) {
    if (raw.includes("North American") || raw.includes("European")) {
      if (raw.includes("North American")) {
        slugs.push("ps_na");
      }
      if (raw.includes("European")) {
        slugs.push("ps_eu");
      }
    } else {
      slugs.push("ps_na");
      slugs.push("ps_eu");
    }
  }
  if (raw.includes("PC/Mac megaserver")) {
    if (raw.includes("North American")) {
      slugs.push("pc_na");
    } else if (raw.includes("European")) {
      slugs.push("pc_eu");
    } else {
      slugs.push("pc_na");
      slugs.push("pc_eu");
    }
  }
  if (raw.includes("European megaservers")) {
    slugs.push("pc_eu");
    slugs.push("xbox_eu");
    slugs.push("ps_eu");
  }
  if (raw.includes("North American megaservers")) {
    slugs.push("pc_na");
    slugs.push("xbox_na");
    slugs.push("ps_na");
  }
  if (raw.includes("ESO Website")) {
    slugs.push("site_web");
  }
  if (raw.includes("PTS")) {
    slugs.push("pts");
  }
  if (raw.includes("ESO Forums")) {
    slugs.push("web_forum");
  }
  if (raw.includes("Crown Store")) {
    slugs.push("crown_store");
  }

  if (/(eso store)/i.test(raw)) {
    slugs.push("eso_store");
  }

  if (/(account system)/i.test(raw)) {
    slugs.push("account_system");
  }

  if (raw.includes("PlayStation™ Network")) {
    slugs.push("ps_na");
    slugs.push("ps_eu");
  }

  if (raw.includes("Xbox Live™")) {
    slugs.push("xbox_na");
    slugs.push("xbox_eu");
  }

  if (raw.includes("North American and European PC/Mac megaservers")) {
    slugs.push("pc_eu");
  }

  if (raw.includes("the megaservers")) {
    slugs.push("pc_na");
    slugs.push("pc_eu");
    slugs.push("xbox_na");
    slugs.push("xbox_eu");
    slugs.push("ps_na");
    slugs.push("ps_eu");
  }

  return slugs;
};

export const toServerSupport = (slug: ServerSlug): ServerSupport => {
  if (slug.includes("pc")) return "pc";
  if (slug.includes("ps")) return "ps";
  if (slug.includes("xbox")) return "xbox";

  return "unknown";
};

export const toServerZone = (slug: ServerSlug): ServerZone => {
  if (slug.includes("eu")) return "eu";
  if (slug.includes("na")) return "na";
  return "unknown";
};

const getWebSiteContent = async () => {
  const response = await fetch(
    "https://help.elderscrollsonline.com/app/answers/detail/a_id/4320",
  );

  return response.text();
};

const getRawListContent = (htmlContent: string) => {
  const result = htmlContent.split(
    "<div><!-- ENTER ESO SERVICE ALERTS BELOW THIS LINE -->",
  );

  if (result.length > 2) return [];

  const rawContent = result[1].split("<p>&nbsp;</p>")[0];
  if (!rawContent) return [];

  return rawContent.replace(/(?:\\[rn]|[\r\n]+)+/g, "").split("<hr />");
};

export async function* getRawList() {
  const htmlContent = await getWebSiteContent();
  const rawListContent = getRawListContent(htmlContent);

  for (const rawContent of rawListContent) {
    const lines: string[] | null = rawContent.match(/<p>(.*?)<\/p>/g);
    if (!lines) continue;

    const [raw_date, ...info] = lines.map((val) => val.replace(/<\/?p>/g, ""));
    yield [info, raw_date] as const;
  }
}

export function* toServiceAlerts(rawList: string[]) {
  for (const raw of rawList) {
    const status = toServerStatus(raw);

    for (const slug of toServerSlugs(raw)) {
      yield {
        raw,
        slug,
        status,
        zone: toServerZone(slug),
        support: toServerSupport(slug),
      };
    }
  }
}

export const getServiceAlerts = async () => {
  const serverAlerts: Record<string, ServiceAlert> = {};

  for await (const [rawList, rawDate] of getRawList()) {
    const timestamp = toDate(rawDate).getTime();

    for (const alert of toServiceAlerts(rawList)) {
      // 以最新发布为准
      if (alert.slug in serverAlerts) continue;

      serverAlerts[alert.slug] = { ...alert, timestamp };
    }
  }

  return serverAlerts;
};
