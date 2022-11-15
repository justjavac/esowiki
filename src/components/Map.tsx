import { Link, RoutableProps, route } from "preact-router";
import { useEffect, useRef } from "preact/hooks";
import { useComputed } from "@preact/signals";
import type { Signal } from "@preact/signals";
import Panzoom, { CurrentValues } from "@panzoom/panzoom";
import type { MapData, PathData, PoiData } from "@/types";

const MAP_SIZE = 1600;
const MARKER_SIZE = 64;

interface MapProps extends RoutableProps {
  mapData: Signal<MapData>;
  selected: Signal<number[]>;
}

export default function Map({ mapData, selected }: MapProps) {
  const mapRef = useRef<SVGSVGElement>(null);

  const pois = useComputed(() => {
    return mapData.value.pois.filter((poi) =>
      selected.value.includes(poi.type)
    );
  });

  useEffect(() => {
    const map = mapRef.current!;

    const panzoom = Panzoom(map, {
      contain: "outside",
      setTransform(elem: SVGSVGElement, { scale, x, y }: CurrentValues) {
        panzoom.setStyle(
          "transform",
          `scale(${scale}) translate(${x}px, ${y}px)`
        );
        map.querySelectorAll<SVGImageElement>(".poi").forEach((poi) => {
          adjustPoi(scale, poi);
        });
      },
    });

    const parent = map.parentElement!;
    parent.addEventListener("wheel", panzoom.zoomWithWheel);
    parent.addEventListener("dblclick", panzoom.zoomIn);
    parent.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (mapData.value.parent_map_id == null) return;

      route(`/map/${mapData.value.parent_map_id}`);
    });

    return () => {
      panzoom.destroy();
    };
  }, []);

  return (
    <div class="relative w-[100vh] h-full mx-auto border-slate-600">
      <h1 class="absolute z-10 p-2 font-medium">{mapData.value.name}</h1>
      <svg ref={mapRef} viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`}>
        <image href={`${import.meta.env.PUBLIC_CDN_URL}${mapData.value.file}`} width={MAP_SIZE} />
        {mapData.value.id === 439 && (
          <Circle
            map_id={27}
            circle_r={500}
            circle_x={MAP_SIZE / 2}
            circle_y={MAP_SIZE / 2}
          />
        )}
        {mapData.value.paths.map((path) =>
          path.svg_path ? (
            <Path key={path.id} {...path} />
          ) : (
            <Circle key={path.id} {...path} />
          )
        )}
        {pois.value.map((poi) => (
          <Poi key={poi.id} {...poi} />
        ))}
      </svg>
    </div>
  );
}

function Poi(props: PoiData) {
  return (
    <Link
      href={
        props.sub_zone_map_ids.length >= 1
          ? `/map/${props.sub_zone_map_ids[0]}`
          : undefined
      }
    >
      <image
        class="poi cursor-default hover:drop-shadow-[0_0_4px_#e0af70]"
        href={`${import.meta.env.PUBLIC_CDN_URL}${props.icon}`}
        width={MARKER_SIZE}
        height={MARKER_SIZE}
        x={props.x * MAP_SIZE - MARKER_SIZE / 2}
        y={props.y * MAP_SIZE - MARKER_SIZE / 2}
        data-x={props.x}
        data-y={props.y}
      >
        <title>{props.name}</title>
      </image>
    </Link>
  );
}

type PathProps = Pick<PathData, "svg_path" | "map_id">;

function Path(props: PathProps) {
  return (
    <Link href={`/map/${props.map_id}`}>
      <polygon
        class="hover:fill-[#e0af705d]"
        points={props.svg_path}
        fill="transparent"
      />
    </Link>
  );
}

type CircleProps = Pick<
  PathData,
  "map_id" | "circle_r" | "circle_x" | "circle_y"
>;

function Circle(props: CircleProps) {
  return (
    <Link href={`/map/${props.map_id}`}>
      <circle
        class="hover:fill-[#e0af705d]"
        r={props.circle_r!}
        cx={props.circle_x!}
        cy={props.circle_y!}
        fill="transparent"
      />
    </Link>
  );
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
