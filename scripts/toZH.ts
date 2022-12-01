import { parse } from "https://deno.land/std@0.162.0/encoding/csv.ts";
import { apply, resove } from "./template.ts";
import { closest } from "fastest-levenshtein";

type LangItem = {
  ID: string;
  Unknown: string;
  Index: string;
  Offset: string;
  Text: string;
};

const columns = ["ID", "Unknown", "Index", "Offset", "Text"];

// 构建官方英文到中文的映射
const en2zh = new Map<string, string>();
const enLines: string[] = [];

export function initLang(ids?: number[]) {
  const langEN = parseLang("./gamedata/lang/en.lang.csv");
  const langZH = parseLang("./gamedata/lang/zh.lang.csv");

  if (langEN.length !== langZH.length) {
    console.log("中文文件不完整");
    Deno.exit(1);
  }

  langEN
    .forEach(({ Text: en, ID }, i) => {
      if (ids != null && !ids.includes(Number(ID))) return;

      // 变小写，去掉空格
      const enKey = en.toLowerCase().split("^")[0].replace(/\|c[a-zA-Z]{6}(.*)\|r/g, "$1");
      const zh = langZH[i].Text.split("^")[0];

      if (en.length > 6 && en.includes("<<1>>") && !enLines.includes(en)) {
        enLines.push(en.replace(/\|c[a-zA-Z]{6}(.*)\|r/g, "$1"));
      }

      const zh0 = en2zh.get(enKey); // 已经存在的翻译

      if (zh0 == null) {
        en2zh.set(enKey, zh);
        return;
      }

      // 如果已经翻译的是英文，那么就用新的翻译
      if (isEnglish(zh0)) {
        en2zh.set(enKey, zh);
        return;
      }

      // 如果已经翻译的是中文，那么就不用新的翻译
      if (zh0 !== zh) {
        if (Deno.args.includes("--debug")) {
          console.info("%s 重复翻译: %s, %s", en, zh0, zh);
        }
      }
    });

  if (Deno.args.includes("--debug")) {
    en2zh.forEach((zh, enKey) => {
      if (isEnglish(zh)) {
        console.log("未翻译 %s", enKey);
      }
    });
  }

  enLines.sort((a, b) => a.length > b.length ? -1 : 1);
}

function parseLang(path: string) {
  return parse(Deno.readTextFileSync(path), {
    skipFirstRow: true,
    columns,
  }) as LangItem[];
}

export function isEnglish(str?: string) {
  if (str == null) return false;
  // deno-lint-ignore no-control-regex
  return !/[^\x00-\xff]/.test(str);
}

export default function toZH(en: string, useSlot = false): string {
  if (en == null) return "";

  const enKey = en.toLowerCase().trim();
  const zh = en2zh.get(enKey);

  if (zh != null) {
    return zh;
  }

  // 去掉英文中的引号，再次尝试翻译
  if (en.at(0) === '"' && en.at(-1) === '"') {
    return `"${toZH(en.slice(1, -1))}"`;
  }

  // 去掉末尾的冒号，再次尝试翻译
  if (en.at(-1) === ":") {
    return `${toZH(en.slice(0, -1))}：`;
  }

  // 去掉末尾的换行符，翻译后再加上
  if (en.at(-1) === "\n") {
    return `${toZH(en.slice(0, -1))}\n`;
  }

  // 如果中间包含冒号，分开翻译
  if (en.includes(":")) {
    const parts = en.split(":");
    const zhParts = parts.map((part) => toZH(part));
    return zhParts.join(": ");
  }

  // 如果有括号，则分开翻译 Chill House (Death's Wind) --> 冷却房间 (死亡之风)
  if (en.includes("(") && en.includes(")")) {
    const parts = en.split(/(\(|\))/);
    const zhParts = parts.map((part) => toZH(part));
    return zhParts.join("");
  }

  // `Adds 40-1752 Maximum Stamina` --> `Adds <<1>> Maximum Stamina`
  if (useSlot) {
    let slots: Record<string, string> | undefined = undefined;
    let template = "";
    let i = 0;
    for (; i < enLines.length; i++) {
      template = enLines[i];
      slots = resove(en, template);
      if (slots != null) break;
    }

    if (i === enLines.length) {
      return en;
    }

    if (slots == null) {
      return en;
    }

    Object.keys(slots).forEach((key) => {
      slots![key] = toZH(slots![key]);
    });

    const templateZh = toZH(template).replace(/\|c[a-zA-Z]{6}(.*)\|r/g, "$1");

    // 如果没有翻译成功，尝试用最接近的翻译
    if (isEnglish(templateZh)) {
      const closestZh = closest(template, enLines);
      return apply(closestZh, slots);
    }

    return apply(templateZh, slots);
  }

  return en2zh.get(enKey) ?? en;
}

if (import.meta.main) {
  initLang();
  const str =
    "When you deal critical damage with a Martial melee attack, summon a Lesser Aegis for 11 seconds. After 2.5 seconds, the Lesser Aegis spins its blades, dealing 478 Bleed Damage every 1 second. This effect can occur once every 12 seconds and scales off the higher of your Weapon or Spell Damage.";

  console.log(toZH(str, true));
}
