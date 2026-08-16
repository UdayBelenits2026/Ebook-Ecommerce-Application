import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from '../../components/shared/navbar/navbar';
import { FooterComponent } from '../../components/shared/footer/footer';

@Component({
  selector: 'app-public-layout',
  standalone: true,

  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent
  ],

  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css'
})
export class PublicLayout {

}