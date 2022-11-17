import { CDN_URL } from "@/consts";
import { housingOnMap } from "@/store";
import { Link } from "preact-router";

export function Housing() {
  if (!housingOnMap.value.length) {
    return <div class="w-full pt-1 text-center">当前地图没有房屋。</div>;
  }

  return (
    <>
      {housingOnMap.value.map((poi) => (
        <Link
          href={`/map/${poi.map_id}?poi=${poi.id}`}
          class="group flex w-full items-center py-1"
        >
          <img
            class="mr-1 h-5 w-5"
            src={`${CDN_URL}${poi.icon}?imageMogr2/format/webp`}
            alt=""
          />
          {poi.name}
        </Link>
      ))}
    </>
  );
}
