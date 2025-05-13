import { Injectable } from "@angular/core";
import {
	Resolve,
	Router,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

import type { Topic } from "../../../common/api/interfaces/my-cards-list.interface";
import { TopicService } from "../../../services/topic/topic.service";

@Injectable({
	providedIn: "root",
})
export class MyCardsDataResolver implements Resolve<Topic[] | null> {
	// should be return Topic[] or null
	constructor(
		private topicService: TopicService,
		private router: Router,
	) {}

	resolve(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot,
	): Observable<Topic[] | null> {
		return this.topicService.getTopics().pipe(
			map((topics) => {
				if (topics.length === 0) {
					this.router.navigate(["/no-cards"]);
					return null;
				}
				topics;
				return topics;
			}),
			catchError((error) => {
				console.error("Erro no resolver ao carregar dados de tópicos:", error);

				this.router.navigate(["/no-cards"]);
				return of(null);
			}),
		);
	}
}
