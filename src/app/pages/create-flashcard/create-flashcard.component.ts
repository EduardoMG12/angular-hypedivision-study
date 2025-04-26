import { Component } from '@angular/core';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { ImportIconComponent } from '../../components/icons/import-icon/import-icon.component';
import { PlusIconComponent } from '../../components/icons/plus-icon/plus-icon.component';

@Component({
  selector: 'app-create-flashcard',
  imports: [SideBarComponent, ImportIconComponent, PlusIconComponent],
  templateUrl: './create-flashcard.component.html',
  styleUrl: './create-flashcard.component.css'
})
export class CreateFlashcardComponent {

}
