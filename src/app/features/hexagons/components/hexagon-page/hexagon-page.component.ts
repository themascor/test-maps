import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HexagonsMapComponent } from '../../../../shared/UI/hexagons-map/hexagons-map.component';
import { HexagonsProviderService } from '../../services/hexagons-provider.service';
import { HexagonAggregatorService } from '../../services/hexagon-aggregator.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-hexagon-page',
  standalone: true,
  imports: [HexagonsMapComponent, AsyncPipe],
  providers: [HexagonsProviderService],
  template: `
    <app-hexagons-map [source]="source$ | async"> </app-hexagons-map>
  `,
  styleUrl: './hexagon-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HexagonPageComponent {
  private readonly dataProvider = inject(HexagonsProviderService);
  private readonly aggregator = inject(HexagonAggregatorService);
  public readonly source$ = this.dataProvider
    .getSource()
    .pipe(map((src) => this.aggregator.mutateGeoJsonEPSG3857toEPSG4326(src)));
}
