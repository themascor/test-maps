import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FeatureCollection, MultiPolygon } from 'geojson';


@Injectable({
  providedIn: 'root'
})
export class HexagonsProviderService {
private  readonly httpClient = inject(HttpClient)

  constructor() { }

  public getSource(): Observable<FeatureCollection<MultiPolygon>> {
    return this.httpClient.get<FeatureCollection<MultiPolygon>>('/assets/data.json')
  }
}
