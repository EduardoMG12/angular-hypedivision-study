import { CardStackComponent } from './../../components/card-stack/card-stack.component';
import { Component } from "@angular/core";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";

@Component({
	selector: "app-home",
	standalone: true,
	imports: [SideBarComponent,CardStackComponent],
	templateUrl: "./home.component.html",
	styleUrl: "./home.component.css",
})
export class HomeComponent {}
