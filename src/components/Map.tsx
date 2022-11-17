import type { ComponentChild } from "preact";
import { Link, RoutableProps } from "preact-router";
import type { PathData, PoiData } from "@/types";
import { CDN_URL, MAP_SIZE, MARKER_SIZE } from "@/consts";
import { usePanZoom } from "@/hooks";
import { mapData, poisOnMap } from "@/store";

export function Map(props: RoutableProps) {
  const mapRef = usePanZoom();
  if (mapData.value == null) return null;

  return (
    <div class="relative w-[100vh] h-full mx-auto border-slate-600 touch-none">
      <h1 class="absolute z-10 p-2 font-medium">{mapData.value.name}</h1>
      <svg ref={mapRef} viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`}>
        <image
          href={`${CDN_URL}${mapData.value.file}?imageMogr2/format/webp`}
          width={MAP_SIZE}
        />
        {mapData.value.id === 439 && (
          <Circle
            map_id={27}
            circle_r={500}
            circle_x={MAP_SIZE / 2}
            circle_y={MAP_SIZE / 2}
            name="泰姆瑞尔"
            showName
          />
        )}
        {mapData.value.paths.map((path) =>
          path.svg_path ? (
            <Path key={path.id} {...path} showName={mapData.value?.id === 27} />
          ) : (
            <Circle
              key={path.id}
              {...path}
              showName={mapData.value?.id === 439}
            />
          )
        )}
        {poisOnMap.value.map((poi) => (
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
      aria-label={props.name}
    >
      <image
        class="poi cursor-default hover:drop-shadow-[0_0_4px_#e0af70]"
        href={`${CDN_URL}${props.icon}?imageMogr2/format/webp`}
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

type PathProps = Pick<PathData, "svg_path" | "map_id" | "name"> & {
  showName: boolean;
};

function Path(props: PathProps) {
  const points = props.svg_path.split(" ").map((point) => {
    const [x, y] = point.split(",").map(Number);
    return { x, y };
  });

  const minX = Math.min(...points.map((point) => point.x));
  const maxX = Math.max(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const maxY = Math.max(...points.map((point) => point.y));

  const x = (minX + maxX) / 2;
  const y = (minY + maxY) / 2;

  return (
    <Link href={`/map/${props.map_id}`} aria-label={props.name}>
      <polygon
        class="hover:fill-[#e0af705d]"
        points={props.svg_path}
        fill="transparent"
      />
      {props.showName && (
        <Text x={x} y={y}>
          {props.name}
        </Text>
      )}
    </Link>
  );
}

type CircleProps = Pick<
  PathData,
  "map_id" | "name" | "circle_r" | "circle_x" | "circle_y"
> & {
  showName: boolean;
};

function Circle(props: CircleProps) {
  return (
    <Link href={`/map/${props.map_id}`} aria-label={props.name}>
      <circle
        class="hover:fill-[#e0af705d]"
        r={props.circle_r!}
        cx={props.circle_x!}
        cy={props.circle_y!}
        fill="transparent"
      />
      {props.showName && (
        <Text x={props.circle_x!} y={props.circle_y!}>
          {props.name}
        </Text>
      )}
    </Link>
  );
}

interface TextProps {
  x: number;
  y: number;
  children: ComponentChild;
}

function Text(props: TextProps) {
  return (
    <text
      class="fill-slate-900 font-bold"
      font-size={MARKER_SIZE / 2}
      x={props.x}
      y={props.y}
      text-anchor="middle"
    >
      {props.children}
    </text>
  );
}
