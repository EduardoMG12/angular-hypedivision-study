import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { Card } from "../../../common/api/interfaces/my-cards-list.interface";

interface CreateCardSuccessResponse {
	id: string;
	message?: string;
}

type CardsWithoutTagsResponse = Card[];

@Injectable({
	providedIn: "root",
})
export class CardService {
	private apiUrl = "http://localhost:3000";

	constructor(private http: HttpClient) {}

	/**
	 * Envia os dados de um novo card para o backend.
	 * @param cardData Os dados do card a ser criado.
	 * @returns Um Observable com a resposta do backend (ajuste a tipagem conforme o backend).
	 */

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	createCard(cardData: Card): Observable<CreateCardSuccessResponse | any> {
		return this.http
			.post<CreateCardSuccessResponse>(`${this.apiUrl}/card/create`, cardData)
			.pipe(
				tap((response) => {
					console.log("Resposta da criação do card:", response);
				}),
				catchError(this.handleError),
			);
	}

	/**
	 * Busca todos os cards do usuário logado que NÃO estão associados a nenhuma tag.
	 * @returns Um Observable que emite um array de Cards.
	 */
	findAllWithoutTags(): Observable<CardsWithoutTagsResponse> {
		return this.http
			.get<CardsWithoutTagsResponse>(`${this.apiUrl}/card/findAllWithoutTags`)
			.pipe(
				tap((cards) => console.log("Cards sem tags carregados:", cards)),
				catchError(this.handleError),
			);
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private handleError(error: any) {
		console.error("Ocorreu um erro na requisição:", error);

		return throwError(
			() => new Error(error.message || "Erro desconhecido na requisição."),
		);
	}
}
