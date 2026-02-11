import { Component } from '@angular/core';
import {NavbarComponent} from '../../core/navbar/navbar';
import {FooterComponent} from '../../core/footer/footer';

@Component({
  selector: 'app-proceso',
  imports: [
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './proceso.html',
  styleUrl: './proceso.css',
})
export class ProcesoComponent {

}
