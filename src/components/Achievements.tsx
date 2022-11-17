import { CDN_URL } from "@/consts";
import {
  selectedAchievementIds,
  toggleAchievementType,
  achievementsOnMap,
} from "@/store";

export function Achievements() {
  if (!achievementsOnMap.value.length) {
    return <div class="w-full pt-1 text-center">当前地图没有成就点。</div>;
  }

  return (
    <>
      {achievementsOnMap.value.map((x) => (
        <button
          class={`${
            selectedAchievementIds.value.includes(x.id)
              ? "opacity-100"
              : "opacity-50"
          } group flex w-full items-center py-1`}
          onClick={() => toggleAchievementType(x.id)}
        >
          <img
            class={`${
              selectedAchievementIds.value.includes(x.id)
                ? "opacity-100"
                : "opacity-50"
            } mr-1 h-5 w-5`}
            src={`${CDN_URL}${x.icon}?imageMogr2/format/webp`}
            alt=""
          />{" "}
          {x.name}
        </button>
      ))}
    </>
  );
}
