import { Component } from '@angular/core';
import { CardStackComponent } from '../../components/card-stack/card-stack.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, CardStackComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
