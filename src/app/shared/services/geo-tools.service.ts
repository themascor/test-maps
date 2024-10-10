import { Injectable } from '@angular/core';
import { Feature, MultiPolygon } from 'geojson';
import { cellToBoundary, H3Index, CoordPair } from 'h3-js';
import proj4 from 'proj4';
import { BoundaryMapItem } from '../UI/hexagons-map/hexagons-map.type';
import geojson2h3 from 'geojson2h3';
@Injectable({
  providedIn: 'root',
})
export class GeoToolsService {
  constructor() {}

  public epsg3857ToEpsg4326(coords: number[]): number[] {
    return proj4('EPSG:3857', 'EPSG:4326', coords);
  }

  public featureToHexagon(
    feature: Feature<MultiPolygon>,
    resolution: number
  ): Promise<H3Index[]> {
    return new Promise((resolve, reject) => {
      const hexIndex = geojson2h3.featureToH3Set(feature, resolution);
      return resolve(hexIndex);
    });
  }

  public hexagonToBoundary(h3Hex: H3Index): Promise<CoordPair[]> {
    return new Promise((resolve, reject) => {
      const boundary = cellToBoundary(h3Hex, true);
      resolve(boundary);
    });
  }

  public boundaryToLngLat(pair: CoordPair): BoundaryMapItem {
    return {
      lng: pair[0],
      lat: pair[1],
    };
  }
}
