import { computed, signal } from "@preact/signals";
import type { MapData, PoiType } from "@/types";

const mapData = signal<MapData | null>(null);
const poiTypes = signal<PoiType[] | null>(null);

export const selectedPoiIds = signal<number[]>(
  JSON.parse(
    localStorage.getItem("selectedPoiIds") ||
      "[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 21]",
  ),
);

export function togglePoiType(id: number) {
  if (selectedPoiIds.value.includes(id)) {
    selectedPoiIds.value = selectedPoiIds.value.filter((x) => x !== id);
  } else {
    selectedPoiIds.value = [...selectedPoiIds.value, id];
  }
}

export function initAppState(data: MapData, types: PoiType[]) {
  mapData.value = data;
  poiTypes.value = types;
}
