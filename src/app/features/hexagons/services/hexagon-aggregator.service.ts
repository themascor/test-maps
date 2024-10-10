import { inject, Injectable } from '@angular/core';
import { GeoToolsService } from '../../../shared/services/geo-tools.service';
import { FeatureCollection, Geometry, MultiPolygon } from 'geojson';

@Injectable({
  providedIn: 'root',
})
export class HexagonAggregatorService {
  private  geoTools = inject(GeoToolsService)
  constructor() {}

  public mutateGeoJsonEPSG3857toEPSG4326(src: FeatureCollection<MultiPolygon>): FeatureCollection<MultiPolygon> {
    src.features.forEach((feature) => {
      feature.geometry.coordinates.forEach((figures) =>
        figures.forEach((figure) => {
          figure.forEach((coords, index) => {
            figure[index] = this.geoTools.epsg3857ToEpsg4326(coords);
          });
        })
      );
    });
    return src;
  }

  



}
