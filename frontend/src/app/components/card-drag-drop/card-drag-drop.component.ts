import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
	DndService,
	DragSource,
	DragSourceMonitor,
	DragSourceDirective,
} from "@ng-dnd/core";
import { Subject } from "rxjs";

import {
	CARD_TYPE,
	type Card,
	type CardSimple,
	type DraggedCardItem,
} from "../../common/api/interfaces/my-cards-list.interface";

type CardDropResult = { moved: boolean } | undefined;

@Component({
	selector: "app-card-drag-drop",
	standalone: true,
	imports: [CommonModule, DragSourceDirective],
	templateUrl: "./card-drag-drop.component.html",
	styleUrl: "./card-drag-drop.component.css",
})
export class CardDragDropComponent implements OnInit, OnDestroy {
	@Input() card!: Card | CardSimple;
	@Input() originalTopicId?: string;

	private readonly CARD_TYPE = CARD_TYPE;

	private destroy$ = new Subject<void>();

	cardSource!: DragSource<DraggedCardItem, CardDropResult>;

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
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
		if (this.cardSource) {
			this.cardSource.unsubscribe();
		}
	}
}
