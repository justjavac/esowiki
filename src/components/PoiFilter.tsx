import { CDN_URL } from "@/consts";
import { selectedPoiIds, togglePoiType, poiTypesOnMap } from "@/store";

export function PoiFilter() {
  if (!poiTypesOnMap.value.length) return null;

  return (
    <div class="absolute top-5 right-5 p-2 w-60 h-[90vh] divide-y bg-gray-900 bg-opacity-80 divide-gray-900 divide-opacity-80 overflow-y-auto scrollbar:bg-transparent scrollbar-thumb:rounded scrollbar-thumb:bg-slate-500">
      {poiTypesOnMap.value.map((type) => (
        <button
          class={`${
            selectedPoiIds.value.includes(type.id)
              ? "opacity-100"
              : "opacity-50"
          } group flex w-full items-center py-1 text-xs text-white`}
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
    </div>
  );
}
