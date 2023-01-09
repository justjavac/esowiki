import { route, useRouter } from "preact-router";
import { useCallback, useEffect, useRef } from "preact/hooks";
import Panzoom, { CurrentValues } from "@panzoom/panzoom";
import { MAP_SIZE, MARKER_SIZE } from "@/consts";
import { mapData, panzoom, togglePoiTypeOn } from "@/store";
import type { PoiData } from "@/types";

export function usePanZoom() {
  const mapRef = useRef<SVGSVGElement>(null);
  const [{ matches }] = useRouter();

  useEffect(() => {
    if (mapRef.current == null) return;
    if (mapData.value == null) return;

    const map = mapRef.current;
    panzoom.value = Panzoom(map, {
      maxScale: 10,
      step: 0.1,
      contain: "outside",
      setTransform(_elem: SVGSVGElement, { scale, x, y }: CurrentValues) {
        panzoom.value?.setStyle(
          "transform",
          `scale(${scale}) translate(${x}px, ${y}px)`,
        );
        map.querySelectorAll<SVGImageElement>(".poi").forEach((poi) => {
          adjustPoi(scale, poi);
        });
      },
    });

    const parent = map.parentElement!;
    parent.addEventListener("wheel", panzoom.value.zoomWithWheel, {
      passive: false,
    });
    parent.addEventListener("dblclick", panzoom.value.zoomIn);

    return () => {
      if (!panzoom.value) return;
      parent.removeEventListener("wheel", panzoom.value.zoomWithWheel);
      parent.removeEventListener("dblclick", panzoom.value.zoomIn);
      panzoom.value.destroy();
      panzoom.value = null;
    };
  }, []);

  const backToParent = useCallback((e: MouseEvent) => {
    e.preventDefault();
    if (mapData.value?.parent_map_id == null) return;
    route(`/map/${mapData.value.parent_map_id}`);
  }, []);

  // 右键返回上一层
  useEffect(() => {
    if (!mapRef.current) return;

    const parent = mapRef.current.parentElement!;
    parent.addEventListener("contextmenu", backToParent);

    return () => {
      parent.removeEventListener("contextmenu", backToParent);
    };
  }, [mapData.value?.parent_map_id]);

  // 地图切换时，重置缩放
  useEffect(() => {
    panzoom.value?.reset({ animate: false });
  }, [matches?.id]);

  // // 根据 poi 参数，聚焦 poi 元素
  // useEffect(() => {
  //   if (panzoom.value == null) return;
  //   if (mapData.value == null) return;
  //   if (mapRef.current == null) return;

  //   const poi = mapData.value.pois.find((poi) => poi.id === matches?.poi);
  //   if (poi == null) return;

  //   togglePoiTypeOn(poi.type);
  //   const { x, y } = calcPoiPosition(poi, mapRef.current);

  //   panzoom.value.zoom(5);
  //   requestAnimationFrame(() => panzoom.value!.pan(x, y, { animate: true }));
  // }, [matches?.poi]);

  return mapRef;
}

/**
 * 计算 poi 的位置
 * @param poi poi 数据
 * @param mapEl 地图元素
 */
function calcPoiPosition(poi: PoiData, mapEl: SVGSVGElement) {
  const parent = mapEl.parentElement!;
  const poiCenterX = poi.x + MARKER_SIZE / 2 / 5 / MAP_SIZE;
  const poiCenterY = poi.y + MARKER_SIZE / 2 / 5 / MAP_SIZE;
  const x = (0.5 - poiCenterX) * parent.getBoundingClientRect().width;
  const y = (0.5 - poiCenterY) * parent.getBoundingClientRect().height;
  return { x, y };
}

/**
 * 调整 poi 的位置
 * @param scale 缩放比例
 */
function adjustPoi(scale: number, poi: SVGImageElement) {
  const size = MARKER_SIZE / scale;
  const x = parseFloat(poi.dataset.x!) * MAP_SIZE - size / 2;
  const y = parseFloat(poi.dataset.y!) * MAP_SIZE - size / 2;
  poi.setAttribute("width", `${size}px`);
  poi.setAttribute("height", `${size}px`);
  poi.setAttribute("x", `${x}px`);
  poi.setAttribute("y", `${y}px`);
}
