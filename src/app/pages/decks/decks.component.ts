import { Component } from '@angular/core';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { PlusIconComponent } from '../../components/icons/plus-icon/plus-icon.component';

@Component({
  selector: 'app-decks',
  imports: [SideBarComponent, PlusIconComponent],
  templateUrl: './decks.component.html',
  styleUrl: './decks.component.css'
})
export class DecksComponent {

}
