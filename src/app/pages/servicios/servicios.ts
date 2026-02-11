import { Component } from '@angular/core';
import {NavbarComponent} from "../../core/navbar/navbar";
import {FooterComponent} from '../../core/footer/footer';

@Component({
  selector: 'app-servicios',
  imports: [
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css',
})
export class ServiciosComponent {

}
