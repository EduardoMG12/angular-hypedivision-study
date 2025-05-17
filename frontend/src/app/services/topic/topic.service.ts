import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, tap, map } from "rxjs/operators";
import type {
	MoveTagDto,
	TagDto,
	Topic,
	TopicsApiResponse,
} from "../../common/api/interfaces/my-cards-list.interface";

@Injectable({
	providedIn: "root",
})
export class TopicService {
	private apiUrl = "http://localhost:3000/tags";

	constructor(private http: HttpClient) {}

	getTopics(): Observable<Topic[]> {
		return this.http.get<TopicsApiResponse>(`${this.apiUrl}/find-all`).pipe(
			map((response) => response.tags),
			tap((data) => console.log("Dados de tópicos carregados:", data)),
			catchError(this.handleError),
		);
	}
	moveTag(moveTagDto: MoveTagDto): Observable<TagDto> {
		const url = `${this.apiUrl}/move`;

		return this.http.put<TagDto>(url, moveTagDto).pipe(
			tap((updatedTag) => console.log("Tag movida com sucesso:", updatedTag)),
			catchError(this.handleError),
		);
	}

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
