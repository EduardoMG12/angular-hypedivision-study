import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, tap, map } from "rxjs/operators";
import type {
	Topic,
	TopicsApiResponse,
} from "../../common/api/interfaces/my-cards-list.interface";

@Injectable({
	providedIn: "root",
})
export class TopicService {
	private apiUrl = "http://localhost:3000/tags/getAllTags";

	constructor(private http: HttpClient) {}

	/**
	 * Find all tags.
	 * Return a Observable to emit array of Topics.
	 */
	getTopics(): Observable<Topic[]> {
		return this.http.get<TopicsApiResponse>(this.apiUrl).pipe(
			map((response) => response.tags),
			tap((data) => console.log("Dados de tópicos carregados:", data)),
			catchError(this.handleError),
		);
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private handleError(error: any) {
		console.error("Erro ao buscar tópicos:", error);
		return throwError(
			() =>
				new Error(
					"Ocorreu um erro ao carregar os tópicos. Por favor, tente novamente mais tarde.",
				),
		);
	}
}
