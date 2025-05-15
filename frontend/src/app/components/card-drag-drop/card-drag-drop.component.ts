import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { CommonModule, NgStyle } from "@angular/common"; // Mantenha NgStyle por enquanto se o template o usar
import {
	DndService,
	DragSource,
	DragSourceMonitor,
	DragSourceDirective,
} from "@ng-dnd/core";
import { Observable, Subject } from "rxjs"; // Mantenha Observable/Subject para destroy$
import { map, takeUntil } from "rxjs/operators";

import type {
	Card,
	CardSimple,
} from "../../common/api/interfaces/my-cards-list.interface";

type CardDropResult = { moved: boolean } | undefined;

// Adicione EXPORT para que outros arquivos possam importar esta interface
export interface DraggedCardItem {
	card: Card | CardSimple;
	originalTopicId?: string;
}

@Component({
	selector: "app-card-drag-drop",
	standalone: true,
	imports: [CommonModule, DragSourceDirective], // Mantenha NgStyle se o template ainda o usar para algo
	templateUrl: "./card-drag-drop.component.html",
	styleUrl: "./card-drag-drop.component.css",
})
export class CardDragDropComponent implements OnInit, OnDestroy {
	@Input() card!: Card | CardSimple;
	@Input() originalTopicId?: string;

	private readonly CARD_TYPE = "YOUR_CARD_TYPE";

	private destroy$ = new Subject<void>();

	cardSource!: DragSource<DraggedCardItem, CardDropResult>;

	// REMOVA A DECLARAÇÃO DE isDragging$ AQUI
	// isDragging$!: Observable<boolean>;

	constructor(private dnd: DndService) {}

	ngOnInit(): void {
		this.cardSource = this.dnd.dragSource<DraggedCardItem, CardDropResult>(
			this.CARD_TYPE,
			{
				beginDrag: () => {
					console.log("Iniciando arrasto do card:", this.card.title);
					const item: DraggedCardItem = {
						card: this.card,
						originalTopicId: this.originalTopicId,
					};
					return item;
				},

				endDrag: (
					monitor: DragSourceMonitor<DraggedCardItem, CardDropResult>,
				) => {
					const draggedItem = monitor.getItem();
					const dropResult = monitor.getDropResult();
					const didDrop = monitor.didDrop();

					if (!draggedItem) {
						console.error("endDrag chamado sem item arrastado disponível.");
						return;
					}

					console.log(
						"Arrasto finalizado para o card:",
						(draggedItem as unknown as Card | CardSimple).title,
					); // O cast aqui ainda pode ser necessário dependendo da exatidão do tipo DraggedCardItem

					if (didDrop && dropResult) {
						console.log("Soltado em:", dropResult);
					} else {
						console.log("Arrasto cancelado ou não soltado em um local válido.");
					}
				},
			},
		);

		// REMOVA A LINHA QUE ATRIBUIA isDragging$ AQUI (pois já está comentada)
		// @ts-ignore: Property 'isDragging$' does not exist on type 'DragSource<...>'
		// this.isDragging$ = this.cardSource.isDragging$.pipe(
		//  takeUntil(this.destroy$),
		// );
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
		if (this.cardSource) {
			this.cardSource.unsubscribe();
		}
	}
}
