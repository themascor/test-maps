import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  MultiPolygon,
} from 'geojson';

import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  input,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { GoogleMap, MapPolygon } from '@angular/google-maps';
import { GeoToolsService } from '../../services/geo-tools.service';
import { HexagonItemForMap } from './hexagons-map.type';

@Component({
  selector: 'app-hexagons-map',
  standalone: true,
  imports: [GoogleMap, NgIf, NgFor, AsyncPipe, MapPolygon],
  template: `
    Zoom: {{ mapZoom() }} Resolution: {{ resolution() }}
    <google-map
      #map
      height="800px"
      width="1200px"
      [center]="center"
      [zoom]="zoom"
      (mapClick)="moveMap($event)"
      (mapMousemove)="move($event)"
      (zoomChanged)="zoomChanges()"
    >
      @for (item of hexagons; track item.hex){
      <map-polygon
        [paths]="item.boundary"
        [options]="{
          strokeColor: '#000000',
          fillColor: item.color,
          fillOpacity: 0.55,
          strokeWeight: 2
        }"
      />
      }
    </google-map>
  `,
  styleUrl: './hexagons-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HexagonsMapComponent {
  @ViewChild('map') map!: GoogleMap;
  public source = input<FeatureCollection<MultiPolygon> | null>(null);
  public resolution: WritableSignal<number> = signal<number>(4);
  public mapZoom: WritableSignal<number> = signal<number>(8);
  public hexagons: HexagonItemForMap[] = [];
  private readonly geoTools = inject(GeoToolsService);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly zoomResolutionMap: { [key in number]: number } = {
    6: 3,
    8: 4,
    9: 5,
    11: 6,
  };
  center: google.maps.LatLngLiteral = {
    lat: 27.05244294268087,
    lng: 34.865637775650285,
  };
  zoom = 8;
  display!: google.maps.LatLngLiteral;

  constructor() {
    effect(() => {
      this.sourceToHexagons(this.source(), this.resolution()).then((_) => {
        this.cd.detectChanges();
      });
    });
  }

  zoomChanges() {
    const zoom = this.map.getZoom() || this.zoom;
    const res: number = this.zoomResolutionMap[zoom] || this.resolution();
    this.resolution.set(res);
    this.mapZoom.set(zoom);
  }
  moveMap(event: google.maps.MapMouseEvent) {
    this.center = event.latLng?.toJSON() || this.center;
  }

  move(event: google.maps.MapMouseEvent) {
    this.display = event.latLng?.toJSON() || this.display;
  }

  private async sourceToHexagons(
    source: FeatureCollection<MultiPolygon> | null,
    resolution: number
  ): Promise<void> {
    if (!source) {
      return;
    }
    const hexagons = await Promise.all(
      source.features.map((feature) =>
        this.getHexagonFromFeature(feature, resolution)
      )
    );
    this.hexagons = hexagons.flat();
  }

  private async getHexagonFromFeature(
    feature: Feature<MultiPolygon, GeoJsonProperties>,
    resolution: number
  ): Promise<HexagonItemForMap[]> {
    const color = feature.properties?.['COLOR_HEX']
      ? '#' + feature.properties?.['COLOR_HEX']
      : '#000000';
    const hex = await this.geoTools.featureToHexagon(feature, resolution);
    const hexagons: HexagonItemForMap[] = [];
    for (let index = 0; index < hex.length; index++) {
      const boundary = await this.geoTools.hexagonToBoundary(hex[index]);
      hexagons.push({
        hex: hex[index],
        color,
        boundary: boundary.map((point) =>
          this.geoTools.boundaryToLngLat(point)
        ),
      });
    }
    return hexagons;
  }
}
