import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import axios from "axios";
import { Router } from "@angular/router";

export interface Card {
	type: string;
	title: string;
	description?: string;
	contentFlip?: {
		front: string;
		back: string;
	};
	tagPaths: string[];
}

@Injectable({
	providedIn: "root",
})
export class CardService {
	private apiUrl = "http://localhost:3000";

	constructor(
		private http: HttpClient,
		private router: Router,
	) {}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	createCard(credentials: Card): Observable<any> {
		return this.http
			.post(`${this.apiUrl}/card/create`, credentials)
			.pipe(tap((response) => response));
	}
}
