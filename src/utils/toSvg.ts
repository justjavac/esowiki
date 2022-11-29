import fs from "node:fs/promises";
import { join } from "node:path";
import type { JSX } from "preact/jsx-runtime";
import satori, { type SatoriOptions } from "satori";

const fontPath = join(
  process.cwd(),
  "gamedata",
  "fonts",
  "eso_fwntlgudc70-db.ttf",
);
const fontData = await fs.readFile(fontPath);

const options: SatoriOptions = {
  width: 400,
  height: 600,
  fonts: [
    {
      name: "EsoFontStyle",
      data: fontData,
      weight: 400,
      style: "normal",
    },
  ],
};

export function toSvg(element: JSX.Element) {
  return satori(element, options);
}
