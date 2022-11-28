import achievements from "../gamedata/category/achievements.json" assert { type: "json" };
import books from "../gamedata/category/books.json" assert { type: "json" };
import crafting from "../gamedata/category/crafting.json" assert { type: "json" };
import factions from "../gamedata/category/factions.json" assert { type: "json" };
// import items from "../gamedata/category/items.json" assert { type: "json" };
import locations from "../gamedata/category/locations.json" assert { type: "json" };
import quests from "../gamedata/category/quests.json" assert { type: "json" };
import skills from "../gamedata/category/skills.json" assert { type: "json" };
import npcs from "../gamedata/category/npcs.json" assert { type: "json" };

const linkType: Record<string, string> = {};

function genSearchMap(item: string[][], type: string) {
  for (const [en, zh, href] of item) {
    linkType[href] = type;
  }
}

genSearchMap(achievements, "achievement");
genSearchMap(books, "book");
genSearchMap(crafting, "crafting");
genSearchMap(factions, "faction");
// genSearchMap(items, "item");
genSearchMap(locations, "location");
genSearchMap(quests, "quest");
genSearchMap(skills, "skill");
genSearchMap(npcs, "npc");

export default linkType;
