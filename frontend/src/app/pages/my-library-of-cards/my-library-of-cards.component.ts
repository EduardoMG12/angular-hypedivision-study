import { CommonModule } from "@angular/common";
import { Component} from "@angular/core";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { CardLibraryComponent } from "../../components/card-library/card-library.component";


@Component({
	selector: "app-my-library-of-cards",
	standalone: true,
	imports: [
    CommonModule,
    SideBarComponent,
    CardLibraryComponent,
],
	templateUrl: "./my-library-of-cards.component.html",
	styleUrl: "./my-library-of-cards.component.css",
})
export class MyLibraryOfCardsComponent{}
