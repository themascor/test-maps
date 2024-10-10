import { FeatureCollection, MultiPolygon } from "geojson";

export interface HexagonItemForMap {
  color: string;
  hex: string;
  boundary: BoundaryMapItem[];
}

export interface BoundaryMapItem {
  lat: number;
  lng: number;
}


