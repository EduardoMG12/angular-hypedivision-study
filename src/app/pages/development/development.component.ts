import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CardComponent } from '../../components/card/card.component';

@Component({
  selector: 'app-development',
  imports: [HeaderComponent, CardComponent],
  templateUrl: './development.component.html',
  styleUrl: './development.component.css'
})
export class DevelopmentComponent {

}
