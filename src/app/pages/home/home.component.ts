import { CommonModule } from '@angular/common';
import { CardStackComponent } from './../../components/card-stack/card-stack.component';
import { Component } from "@angular/core";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { OpenBookIconComponent } from '../../components/icons/open-book-icon/open-book-icon.component';
import { AlbumIconComponent } from '../../components/icons/album-icon/album-icon.component';
import { BookMarkIconComponent } from '../../components/icons/book-mark-icon/book-mark-icon.component';
import { CardWihtIconComponent } from "../../components/card-with-icon/card-with-icon.component";

@Component({
	selector: "app-home",
	standalone: true,
	imports: [CommonModule, SideBarComponent, CardStackComponent, CardWihtIconComponent],
	templateUrl: "./home.component.html",
	styleUrl: "./home.component.css",
})
export class HomeComponent {}
