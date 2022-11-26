import { parse, stringify } from "https://deno.land/std@0.162.0/encoding/csv.ts";

type LangItem = {
  ID: string;
  Unknown: string;
  Index: string;
  Offset: string;
  Text: string;
};

const columns = ["ID", "Unknown", "Index", "Offset", "Text"];

const langEN = await parseLang("./gamedata/lang/en.lang.csv");
const langZH = await parseLang("./gamedata/lang/zh.lang.csv");

if (langEN.length !== langZH.length) {
  console.log("中文文件不完整");
  Deno.exit(1);
}

// 构建官方英文到中文的映射
const en2zh = new Map<string, string>();
langEN.forEach(({ Text: en }, i) => {
  const zh = langZH[i].Text;

  const zh0 = en2zh.get(en); // 已经存在的翻译

  if (zh0 == null) {
    en2zh.set(en, zh);
    return;
  }

  // 如果已经翻译的是英文，那么就用新的翻译
  if (isEnglish(zh0)) {
    en2zh.set(en, zh);
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
  en2zh.forEach((zh, en) => {
    if (isEnglish(zh)) {
      console.log("未翻译 %s", en);
    }
  });
}

async function parseLang(path: string) {
  return parse(await Deno.readTextFile(path), {
    skipFirstRow: true,
    columns,
  }) as LangItem[];
}

function isEnglish(str?: string) {
  if (str == null) return false;
  // deno-lint-ignore no-control-regex
  return !/[^\x00-\xff]/.test(str);
}

export default function (en: string) {
  if (en == null) return "";

  const zh = en2zh.get(en);

  if (zh != null) {
    return zh;
  }

  // 去掉英文中的引号，再次尝试翻译
  if (en.at(0) === '"' && en.at(-1) === '"') {
    if (en2zh.get(en.slice(1, -1)!) != null) {
      return `${en.at(0)}${en2zh.get(en.slice(1, -1))}${en.at(-1)}`;
    }
  }

  // 去掉末尾的冒号，再次尝试翻译
  if (en.at(-1) === ":") {
    if (en2zh.get(en.slice(0, -1)) != null) {
      return `${en2zh.get(en.slice(0, -1))}${en.at(-1)}`;
    }
  }

  // 如果中间包含冒号，分开翻译
  if (en.includes(":")) {
    const parts = en.split(":");
    const zhParts = parts.map((part) => en2zh.get(part.trim()));
    if (zhParts.every((part) => part != null)) {
      return zhParts.join(": ");
    }
  }

  return en2zh.get(en) ?? en;
}
