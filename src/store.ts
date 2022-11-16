import { batch, computed, effect, signal } from "@preact/signals";
import type { MapData, PoiType } from "@/types";

export const mapData = signal<MapData>(null!);
export const poiTypes = signal<PoiType[]>([]);

export const selectedPoiIds = signal<number[]>([]);
export const selectedAchievementIds = signal<number[]>([]);

export const poiTypesOnMap = computed(() => {
  return poiTypes.value.filter((poi) =>
    mapData.value?.pois.find((p) => p.type === poi.id)
  );
});

export const poisOnMap = computed(() => {
  return mapData.value.pois.filter((poi) =>
    selectedPoiIds.value.includes(poi.type)
  );
});

export function togglePoiType(id: number) {
  if (selectedPoiIds.value.includes(id)) {
    selectedPoiIds.value = selectedPoiIds.value.filter((x) => x !== id);
  } else {
    selectedPoiIds.value = [...selectedPoiIds.value, id];
  }
}

export function toggleAchievementType(id: number) {
  if (selectedAchievementIds.value.includes(id)) {
    selectedAchievementIds.value = selectedAchievementIds.value.filter((x) =>
      x !== id
    );
  } else {
    selectedAchievementIds.value = [...selectedAchievementIds.value, id];
  }
}

export function initAppState(data: MapData, types: PoiType[]) {
  batch(() => {
    mapData.value = data;
    poiTypes.value = types;
  });
  setupBrowser();
}

function setupBrowser() {
  if (import.meta.env.SSR) return;

  const defaultIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 21];
  selectedPoiIds.value =
    JSON.parse(localStorage.getItem("selectedPoiIds") as string) ?? defaultIds;
  selectedAchievementIds.value =
    JSON.parse(localStorage.getItem("selectedAchievementIds") as string) ?? [];

  effect(() => {
    localStorage.setItem(
      "selectedPoiIds",
      JSON.stringify(selectedPoiIds.value),
    );
  });

  effect(() => {
    localStorage.setItem(
      "selectedAchievementIds",
      JSON.stringify(selectedAchievementIds.value),
    );
  });

  effect(() => {
    document.title = document.title.replace(
      /^(.*?)( - .*)$/,
      `${mapData.value.name}$2`,
    );
  });
}
