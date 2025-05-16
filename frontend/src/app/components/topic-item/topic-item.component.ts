import { CommonModule, NgClass, NgStyle } from "@angular/common";
import {
	Component,
	Input,
	Output,
	EventEmitter,
	OnInit,
	OnDestroy,
} from "@angular/core";
import {
	CARD_TYPE,
	DraggedCardItem,
	Topic,
} from "../../common/api/interfaces/my-cards-list.interface";
import { CardDragDropComponent } from "../card-drag-drop/card-drag-drop.component";

import {
	DndService,
	DropTarget,
	DropTargetDirective,
	DropTargetMonitor,
} from "@ng-dnd/core";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

type TopicDropResult = { targetTopicId: string };

@Component({
	selector: "app-topic-item",
	standalone: true,
	imports: [
		CommonModule,
		NgStyle,
		NgClass,
		CardDragDropComponent,
		DropTargetDirective,
	],
	templateUrl: "./topic-item.component.html",
})
export class TopicItemComponent implements OnInit, OnDestroy {
	@Input() topic!: Topic;
	@Input() level = 0;
	@Input() expandedTopics!: Map<string, boolean>;

	isHovered = false;

	@Output() toggle = new EventEmitter<string>();

	@Output() cardDroppedOnTopic = new EventEmitter<{
		cardId: string;
		originalTopicId: string | undefined;
		targetTopicId: string;
	}>();

	private readonly CARD_TYPE = CARD_TYPE;

	private destroy$ = new Subject<void>();

	topicTarget!: DropTarget<DraggedCardItem, TopicDropResult>;

	constructor(private dnd: DndService) {}

	ngOnInit(): void {
		this.topicTarget = this.dnd.dropTarget<DraggedCardItem, TopicDropResult>(
			this.CARD_TYPE,
			{
				// canDrop é opcional, para controlar se o item pode ser solto aqui
				// canDrop: (monitor: DropTargetMonitor<DraggedCardItem, TopicDropResult>) => {
				//   // Exemplo: não permite soltar um card no próprio tópico
				//   const draggedItem = monitor.getItem();
				//   return draggedItem.originalTopicId !== this.topic.id;
				// },

				// drop é chamado quando um item é solto NESTE target
				drop: (
					monitor: DropTargetMonitor<DraggedCardItem, TopicDropResult>,
				) => {
					const draggedItem = monitor.getItem(); // O item arrastado (do tipo DraggedCardItem)
					const didDrop = monitor.didDrop(); // Deve ser true aqui

					if (!draggedItem) {
						console.error("Drop chamado sem item arrastado disponível.");
						return;
					}

					console.log(
						`Card ${draggedItem.card.title} soltado no tópico ${this.topic.name}`,
					);
					console.log(`Origem: ${draggedItem.originalTopicId || "Sem Tag"}`);
					console.log(`Destino: ${this.topic.id}`);

					// EMITIR O EVENTO AQUI!
					// Este componente DropTarget notifica o pai (CardListComponent)
					// que um card foi solto, passando as informações necessárias.
					this.cardDroppedOnTopic.emit({
						cardId: draggedItem.card.id, // Assume que o Card tem _id
						originalTopicId: draggedItem.originalTopicId,
						targetTopicId: this.topic.id,
					});

					// Opcional: Retornar um resultado para o endDrag do DragSource
					return { targetTopicId: this.topic.id };
				},

				// hover: Opcional, chamado enquanto um item arrastado está sobre este target
				// hover: (monitor: DropTargetMonitor<DraggedCardItem, TopicDropResult>) => {
				//   // Adicionar feedback visual aqui, se necessário
				// }
			},
		);

		/*

    this.isOver$ = this.topicTarget.isOver$.pipe(
      takeUntil(this.destroy$)
    );
    */
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();

		if (this.topicTarget) {
			this.topicTarget.unsubscribe();
		}
	}

	toggleTopic(topicId: string): void {
		this.toggle.emit(topicId);
	}

	isExpanded(topicId: string): boolean {
		return this.expandedTopics.get(topicId) || false;
	}
}
