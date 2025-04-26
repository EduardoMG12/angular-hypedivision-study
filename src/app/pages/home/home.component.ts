import { CommonModule } from '@angular/common';
import { CardStackComponent } from './../../components/card-stack/card-stack.component';
import { Component } from "@angular/core";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { CardWihtIconComponent } from "../../components/card-with-icon/card-with-icon.component";
import { RecentDeckCardComponent } from '../../components/recent-deck-card/recent-deck-card.component';
import { PlusIconComponent } from '../../components/icons/plus-icon/plus-icon.component';

@Component({
	selector: "app-home",
	standalone: true,
	imports: [CommonModule, SideBarComponent, CardStackComponent, CardWihtIconComponent, RecentDeckCardComponent, PlusIconComponent],
	templateUrl: "./home.component.html",
	styleUrl: "./home.component.css",
})
export class HomeComponent {}
