import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hamburguer-menu',
  imports: [RouterLink, CommonModule],
  templateUrl: './hamburguer-menu.component.html',
  styleUrl: './hamburguer-menu.component.css'
})
export class HamburguerMenuComponent {
  isOpen = true;

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }
}
