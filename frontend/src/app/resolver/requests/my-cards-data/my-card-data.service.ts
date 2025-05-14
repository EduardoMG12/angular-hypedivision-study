import { Injectable } from "@angular/core";
import {
	Resolve,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
} from "@angular/router";
import { Observable, of, forkJoin } from "rxjs";
import { catchError } from "rxjs/operators";

import type { Topic } from "../../../common/api/interfaces/my-cards-list.interface";
import { TopicService } from "../../../services/topic/topic.service";
import {
	CardService,
	Card,
} from "../../../services/requests/card/card.service";

export interface MyCardsResolvedData {
	topics: Topic[];
	cardsWithoutTags: Card[];
}

@Injectable({
	providedIn: "root",
})
export class MyCardsDataResolver
	implements Resolve<MyCardsResolvedData | null>
{
	constructor(
		private topicService: TopicService,
		private cardService: CardService,
	) {}

	resolve(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot,
	): Observable<MyCardsResolvedData | null> {
		return forkJoin({
			topics: this.topicService.getTopics(),
			cardsWithoutTags: this.cardService.findAllWithoutTags(),
		}).pipe(
			catchError((error) => {
				console.error("Erro no resolver ao carregar dados:", error);
				return of(null);
			}),
		);
	}
}
