import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenBookIconComponent } from '../icons/open-book-icon/open-book-icon.component';
import { BookMarkIconComponent } from '../icons/book-mark-icon/book-mark-icon.component';
import { AlbumIconComponent } from '../icons/album-icon/album-icon.component';

@Component({
  selector: 'app-card-with-icon',
  standalone: true,
  imports: [
    CommonModule,
    OpenBookIconComponent,
    BookMarkIconComponent,
    AlbumIconComponent
  ],
  templateUrl: './card-with-icon.component.html',
  styleUrl: './card-with-icon.component.css'
})
export class CardWihtIconComponent {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() icon: string = ''; // Nome do ícone: 'open-book', 'book-mark', 'album'
  @Input() strokeColor: string = '#FFFFFF'; // Cor padrão branca
}