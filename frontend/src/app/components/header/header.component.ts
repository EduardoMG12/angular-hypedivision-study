import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { HamburguerMenuComponent } from "../hamburguer-menu/hamburguer-menu.component";

@Component({
	selector: "app-header",
	imports: [RouterLink, CommonModule, HamburguerMenuComponent],
	templateUrl: "./header.component.html",
	styleUrl: "./header.component.css",
})
export class HeaderComponent {
	isMobileMenuOpen = false;

	toggleMobileMenu() {
	  this.isMobileMenuOpen = !this.isMobileMenuOpen;
	}
}
