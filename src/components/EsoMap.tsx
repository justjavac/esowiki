import Router from "preact-router";
import { useSignal, useComputed } from "@preact/signals";
import type { Signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { CDN_URL } from "@/consts";
import type { MapData, PoiType } from "@/types";
import { PoiFilter, Map } from "@/components";

interface EsoMapProps {
  mapData: Signal<MapData>;
  poiTypes: Signal<PoiType[]>;
}

export function EsoMap({ mapData, poiTypes }: EsoMapProps) {
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
          const response = await fetch(`${CDN_URL}/maps/${r.matches.id}.json`);
          mapData.value = await response.json();
        }}
      >
        <Map mapData={mapData} path="/map/:id" />
      </Router>
      <PoiFilter poiTypes={pois}  />
    </>
  );
}
