export interface PoiData {
  id: string;
  map_id: number;
  name: string;
  icon: string;
  x: number;
  y: number;
  sub_zone_map_ids: number[];
  type: number;
  is_custom: boolean;
  achievement_id: number | null;
  achievement_name: string | null;
  achievement_icon: string | null;
  url: string;
  description: string;
}

export interface PathData {
  id: string;
  parent_id: number;
  map_id: number;
  name: string;
  circle_x: number | null;
  circle_y: number | null;
  circle_r: number | null;
  svg_path: string;
}

export interface Achievement {
  pois: PoiData[];
  active: boolean;
  name: string;
  id: number;
  icon: string;
}

export interface MapData {
  id: number;
  name: string;
  file: string;
  parent_map_id: number | null;
  pois: PoiData[];
  paths: PathData[];
  achievements: Achievement[];
  parent_pois: PoiData[];
}

export interface PoiType {
  id: number;
  name: string;
  icon: string;
}

export type Area = Pick<MapData, "id" | "name" | "file" | "parent_map_id">;