import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {GoogleMap, MapPolygon} from '@angular/google-maps';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
}
