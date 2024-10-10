import { Routes } from '@angular/router';
import { NotFoundComponent } from './core/pages/not-found/not-found.component';
import { HexagonPageComponent } from './features/hexagons/components/hexagon-page/hexagon-page.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'hexagons',
        pathMatch: 'full',
      },
      {
        path: 'hexagons',
        component: HexagonPageComponent,
      },
      {
        path: '**',
        component: NotFoundComponent,
      },
];
