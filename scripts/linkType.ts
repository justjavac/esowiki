import achievements from "../gamedata/category/achievements.json" with { type: "json" };
import books from "../gamedata/category/books.json" with { type: "json" };
import crafting from "../gamedata/category/crafting.json" with { type: "json" };
import factions from "../gamedata/category/factions.json" with { type: "json" };
// import items from "../gamedata/category/items.json" with { type: "json" };
import locations from "../gamedata/category/locations.json" with { type: "json" };
import quests from "../gamedata/category/quests.json" with { type: "json" };
import skills from "../gamedata/category/skills.json" with { type: "json" };
import npcs from "../gamedata/category/npcs.json" with { type: "json" };
import races from "../gamedata/category/races.json" with { type: "json" };

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
genSearchMap(races, "race");

export default linkType;
