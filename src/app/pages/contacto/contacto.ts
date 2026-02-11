import { Component } from '@angular/core';
import {NavbarComponent} from '../../core/navbar/navbar';
import {FooterComponent} from '../../core/footer/footer';

@Component({
  selector: 'app-contacto',
  imports: [
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
})
export class ContactoComponent {

}
