import { Component } from '@angular/core';
import { CardStackComponent } from '../../components/card-stack/card-stack.component';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-welcome',
  imports: [HeaderComponent, CardStackComponent,FooterComponent],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

}
