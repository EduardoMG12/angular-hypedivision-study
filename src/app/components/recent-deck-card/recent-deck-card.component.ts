import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recent-deck-card',
  standalone: true,
  templateUrl: './recent-deck-card.component.html',
  styleUrls: ['./recent-deck-card.component.css']
})
export class RecentDeckCardComponent {
  @Input() title = '';
  @Input() cardsCount = '';
  @Input() studyTime = '';
}