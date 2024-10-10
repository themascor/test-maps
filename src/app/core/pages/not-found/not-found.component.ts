import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<div id="main">
  <div class="fof">
        <h1>Not found. 404</h1>
  </div>
</div>`,
  styleUrl: './not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent { }
