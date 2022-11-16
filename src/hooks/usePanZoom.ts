import { route, useRouter } from "preact-router";
import { useCallback, useEffect, useRef } from "preact/hooks";
import Panzoom, { CurrentValues, PanzoomObject } from "@panzoom/panzoom";
import { MAP_SIZE, MARKER_SIZE } from "@/consts";
import { mapData } from "@/store";

export function usePanZoom() {
  const mapRef = useRef<SVGSVGElement>(null);
  const panzoomRef = useRef<PanzoomObject | null>();
  const [{ url }] = useRouter();

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const panzoom = Panzoom(map, {
      contain: "outside",
      setTransform(elem: SVGSVGElement, { scale, x, y }: CurrentValues) {
        panzoom.setStyle(
          "transform",
          `scale(${scale}) translate(${x}px, ${y}px)`,
        );
        map.querySelectorAll<SVGImageElement>(".poi").forEach((poi) => {
          adjustPoi(scale, poi);
        });
      },
    });
    panzoomRef.current = panzoom;

    const parent = map.parentElement!;
    parent.addEventListener("wheel", panzoom.zoomWithWheel, { passive: false });
    parent.addEventListener("dblclick", panzoom.zoomIn);
    parent.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (mapData.value.parent_map_id == null) return;

      route(`/map/${mapData.value.parent_map_id}`);
    });

    return () => {
      parent.removeEventListener("wheel", panzoom.zoomWithWheel);
      parent.removeEventListener("dblclick", panzoom.zoomIn);
      panzoomRef.current = null;
      panzoom.destroy();
    };
  }, []);

  const backToParent = useCallback((e: MouseEvent) => {
    e.preventDefault();
    if (mapData.value.parent_map_id == null) return;
    route(`/map/${mapData.value.parent_map_id}`);
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!panzoomRef.current) return;

    const parent = mapRef.current.parentElement!;
    parent.addEventListener("contextmenu", backToParent);

    return () => {
      parent.removeEventListener("contextmenu", backToParent);
    };
  }, [mapData.value.parent_map_id]);

  useEffect(() => {
    panzoomRef.current?.reset({animate: false});
  }, [url]);

  return mapRef;
}

function adjustPoi(scale: number, poi: SVGImageElement) {
  const size = MARKER_SIZE / scale;
  const x = parseFloat(poi.dataset.x!) * MAP_SIZE - size / 2;
  const y = parseFloat(poi.dataset.y!) * MAP_SIZE - size / 2;
  poi.setAttribute("width", `${size}px`);
  poi.setAttribute("height", `${size}px`);
  poi.setAttribute("x", `${x}px`);
  poi.setAttribute("y", `${y}px`);
}
