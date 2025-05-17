import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import {
	Card,
	MoveCardDto,
} from "../../../common/api/interfaces/my-cards-list.interface";

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
			.get<CardsWithoutTagsResponse>(
				`${this.apiUrl}/card/find-all-without-tags`,
			)
			.pipe(
				tap((cards) => console.log("Cards sem tags carregados:", cards)),
				catchError(this.handleError),
			);
	}

	/**
	 * Envia requisição para mover um card para um tópico/tag no backend.
	 * @param cardId O ID do card a ser movido.
	 * @param targetTopicId O ID do tópico de destino.
	 * @param originalTopicId Opcional: O ID do tópico de origem.
	 * @returns Um Observable com a resposta do backend (o CardDto atualizado, por exemplo).
	 */
	// Ajuste a tipagem do retorno conforme o backend retorna (CardDto, any, etc.)
	moveCardToTopic(
		cardId: string,
		targetTopicId: string,
		originalTopicId: string | undefined,
	): Observable<Card> {
		// Usando Card como exemplo de retorno, ajuste conforme backend
		// Crie o objeto DTO que o backend espera
		const requestBody: MoveCardDto = {
			cardId: cardId,
			targetTopicId: targetTopicId,
			originalTopicId: originalTopicId,
		};

		// Use a URL correta que o Controller está escutando
		const url = `${this.apiUrl}/card/move-to-topic`; // <-- URL CORRETA

		// Envie o DTO completo no corpo da requisição PUT
		return this.http
			.put<Card>(url, requestBody) // <-- Envie requestBody no corpo
			.pipe(
				tap((updatedCard) =>
					console.log("Card movido com sucesso:", updatedCard),
				),
				catchError(this.handleError),
			);
	}

	private handleError(error: any) {
		console.error("Ocorreu um erro na requisição:", error);

		return throwError(
			() => new Error(error.message || "Erro desconhecido na requisição."),
		);
	}
}
