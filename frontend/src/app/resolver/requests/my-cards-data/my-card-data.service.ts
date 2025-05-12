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
	// Pode retornar Topic[] ou null
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
				// Em caso de erro na requisição, você pode redirecionar para uma página de erro
				// ou retornar um Observable de array vazio, dependendo do comportamento desejado.
				// Por simplicidade, vamos redirecionar para 'no-cards' ou uma página de erro genérica.
				this.router.navigate(["/no-cards"]); // ou para uma rota de erro específica
				return of(null); // Retorna um observable de null para finalizar o resolver
			}),
		);
	}
}
