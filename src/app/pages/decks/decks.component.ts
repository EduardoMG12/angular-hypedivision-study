import { Component } from '@angular/core';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { PlusIconComponent } from '../../components/icons/plus-icon/plus-icon.component';
import { LupeIconComponent } from '../../components/icons/lupe-icon/lupe-icon.component';
import { DeckCardComponent } from '../../components/deck-card/deck-card.component';

@Component({
  selector: 'app-decks',
  imports: [SideBarComponent, PlusIconComponent,LupeIconComponent, DeckCardComponent],
  templateUrl: './decks.component.html',
  styleUrl: './decks.component.css'
})
export class DecksComponent {

}
