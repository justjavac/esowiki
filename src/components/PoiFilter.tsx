import { useCallback } from "preact/hooks";
import type { Signal } from "@preact/signals";
import type { PoiType } from "@/types";

interface PoiFilterProps {
  poiTypes: Signal<PoiType[]>;
  selected: Signal<number[]>;
}

export default function PoiFilter({ poiTypes, selected }: PoiFilterProps) {
  const toggle = useCallback(
    (id: number) => {
      if (selected.value.includes(id)) {
        selected.value = selected.value.filter((x) => x !== id);
      } else {
        selected.value = [...selected.value, id];
      }
    },
    [selected]
  );

  if (!poiTypes.value.length) return null;

  return (
    <div class="absolute top-5 right-5 p-2 w-60 h-[90vh] divide-y bg-gray-900 bg-opacity-80 divide-gray-900 divide-opacity-80 overflow-y-auto">
      {poiTypes.value.map((type) => (
        <button
          class={`${
            selected.value.includes(type.id) ? "opacity-100" : "opacity-50"
          } group flex w-full items-center py-1 text-xs text-white`}
          onClick={() => toggle(type.id)}
        >
          <img
            class={`${
              selected.value.includes(type.id) ? "opacity-100" : "opacity-50"
            } mr-1 h-5 w-5`}
            src={`${import.meta.env.PUBLIC_CDN_URL}${type.icon}`}
            alt=""
          />{" "}
          {type.name}
        </button>
      ))}
    </div>
  );
}
