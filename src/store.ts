import { batch, computed, effect, signal } from "@preact/signals";
import type { PanzoomObject } from "@panzoom/panzoom";
import type { MapData, PoiType } from "@/types";

export const panzoom = signal<PanzoomObject | null>(null);

export const mapData = signal<MapData | null>(null);
export const poiTypes = signal<PoiType[]>([]);

export const selectedPoiIds = signal<number[]>([]);
export const selectedAchievementIds = signal<number[]>([]);

export const poiTypesOnMap = computed(() => {
  return poiTypes.value
    .filter((poi) => mapData.value?.pois.find((p) => p.type === poi.id));
});

export const poisOnMap = computed(() => {
  if (mapData.value == null) return [];

  const achievements = mapData.value.achievements
    .filter((x) => selectedAchievementIds.value.includes(x.id))
    .flatMap((x) => x.pois);

  return mapData.value.pois
    .filter((poi) => selectedPoiIds.value.includes(poi.type))
    .concat(achievements);
});

export const achievementsOnMap = computed(() => {
  if (mapData.value == null) return [];
  return mapData.value.achievements;
});

export const housingOnMap = computed(() => {
  if (mapData.value == null) return [];
  return mapData.value.pois.filter((poi) => poi.type === 14);
});

export function togglePoiType(id: number) {
  if (selectedPoiIds.value.includes(id)) {
    selectedPoiIds.value = selectedPoiIds.value.filter((x) => x !== id);
  } else {
    selectedPoiIds.value = [...selectedPoiIds.value, id];
  }
}

export function togglePoiTypeOn(id: number) {
  if (selectedPoiIds.value.includes(id)) return;
  selectedPoiIds.value = [...selectedPoiIds.value, id];
}

export function toggleAchievementType(id: number) {
  if (selectedAchievementIds.value.includes(id)) {
    selectedAchievementIds.value = selectedAchievementIds.value.filter(
      (x) => x !== id,
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

  const defaultIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 21, 23];
  selectedPoiIds.value = JSON.parse(localStorage.getItem("selectedPoiIds") as string) ?? defaultIds;
  selectedAchievementIds.value = JSON.parse(localStorage.getItem("selectedAchievementIds") as string) ?? [];

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
    if (mapData.value == null) return;
    document.title = document.title.replace(
      /^(.*?)( - .*)$/,
      `${mapData.value.name}$2`,
    );
  });
}
