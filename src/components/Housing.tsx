import { CDN_URL, MAP_SIZE, MARKER_SIZE } from "@/consts";
import { housingOnMap, panzoom } from "@/store";

export function Housing() {
  if (!housingOnMap.value.length) {
    return <div class="w-full pt-1 text-center">当前地图没有房屋。</div>;
  }

  return (
    <>
      {housingOnMap.value.map((house) => (
        <button
          class="group flex w-full items-center py-1"
          onClick={() => {
            if (panzoom.value == null) return;

            // const x = house.x * MAP_SIZE - MARKER_SIZE / 2;
            // const y = house.y * MAP_SIZE - MARKER_SIZE / 2;
            // panzoom.value.zoom(2);
            // setTimeout(() => {
            //   const x = house.x * MAP_SIZE - MARKER_SIZE / 2;
            //   const y = house.y * MAP_SIZE - MARKER_SIZE / 2;
            //   panzoom.value!.pan(x, y, { animate: true });
            // });
          }}
        >
          <img
            class="mr-1 h-5 w-5"
            src={`${CDN_URL}${house.icon}?imageMogr2/format/webp`}
            alt=""
          />
          {house.name}
        </button>
      ))}
    </>
  );
}
