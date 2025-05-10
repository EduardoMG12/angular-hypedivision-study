import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-side-bar-cards-library',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-bar-cards-library.component.html',
  styleUrl: './side-bar-cards-library.component.css'
})
export class SideBarCardsLibraryComponent {
@Output() close = new EventEmitter<void>(); 

  onClose() {
    console.log("onClose called")
    this.close.emit(); 
  }
}
