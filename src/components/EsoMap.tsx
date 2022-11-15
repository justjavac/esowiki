import Router from "preact-router";
import { useSignal, useComputed } from "@preact/signals";
import type { Signal } from "@preact/signals";
import type { MapData, PoiType } from "@/types";
import PoiFilter from "@/components/PoiFilter";
import Map from "@/components/Map";
import { useEffect } from "preact/hooks";

interface EsoMapProps {
  mapData: Signal<MapData>;
  poiTypes: Signal<PoiType[]>;
}

export default function EsoMap({ mapData, poiTypes }: EsoMapProps) {
  const selectedPoiIds = useSignal<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 21,
  ]);
  const pois = useComputed(() => {
    return poiTypes.value.filter((poi) =>
      mapData.value.pois.find((p) => p.type === poi.id)
    );
  });

  useEffect(() => {
    document.title = `${mapData.value.name} - 上古卷轴OL在线地图 - Elder Scrolls Online Map`;
  }, [mapData.value.name]);

  return (
    <>
      <Router
        onChange={async (r) => {
          if (r.previous == null) return;
          if (r.matches?.id == null) return;
          const response = await fetch(`${import.meta.env.PUBLIC_CDN_URL}/maps/${r.matches.id}.json`);
          mapData.value = await response.json();
        }}
      >
        <Map mapData={mapData} selected={selectedPoiIds} path="/map/:id" />
      </Router>
      <PoiFilter poiTypes={pois} selected={selectedPoiIds} />
    </>
  );
}
