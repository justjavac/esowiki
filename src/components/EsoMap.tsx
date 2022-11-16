import Router from "preact-router";
import { CDN_URL } from "@/consts";
import type { MapData, PoiType } from "@/types";
import { Map } from "@/components";
import { initAppState, mapData } from "@/store";

interface EsoMapProps {
  mapData: MapData;
  poiTypes: PoiType[];
}

export function EsoMap(props: EsoMapProps) {
  initAppState(props.mapData, props.poiTypes);

  return (
    <Router
      onChange={async (r) => {
        if (r.previous == null) return;
        if (r.matches?.id == null) return;
        const response = await fetch(`${CDN_URL}/maps/${r.matches.id}.json`);
        mapData.value = await response.json();
      }}
    >
      <Map path="/map/:id" />
    </Router>
  );
}
