import { CDN_URL } from "@/consts";
import { selectedPoiIds, togglePoiType, poiTypesOnMap } from "@/store";

export function Achievements() {
  if (!poiTypesOnMap.value.length) return null;

  return (
    <>
      {poiTypesOnMap.value.map((type) => (
        <button
          class={`${
            selectedPoiIds.value.includes(type.id)
              ? "opacity-100"
              : "opacity-50"
          } group flex w-full items-center py-1`}
          onClick={() => togglePoiType(type.id)}
        >
          <img
            class={`${
              selectedPoiIds.value.includes(type.id)
                ? "opacity-100"
                : "opacity-50"
            } mr-1 h-5 w-5`}
            src={`${CDN_URL}${type.icon}?imageMogr2/format/webp`}
            alt=""
          />{" "}
          {type.name}
        </button>
      ))}
    </>
  );
}
