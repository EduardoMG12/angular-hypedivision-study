import {
	Component,
	Input,
	Output,
	EventEmitter,
	SimpleChanges,
	OnInit,
	OnDestroy,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { TopicItemComponent } from "../topic-item/topic-item.component";
import { CardDragDropComponent } from "../card-drag-drop/card-drag-drop.component";
import type {
	Card,
	CardSimple,
	Topic,
	MoveCardDto,
	MoveTopicDto,
	DraggedTopicItem,
} from "../../../../common/api/interfaces/my-cards-list.interface";
import {
	DndService,
	DropTarget,
	DropTargetDirective,
	DropTargetMonitor,
} from "@ng-dnd/core";
import { Subject } from "rxjs";
import { TOPIC_TYPE } from "../../../../common/api/interfaces/my-cards-list.interface";

@Component({
	selector: "app-card-list",
	standalone: true,
	imports: [
		CommonModule,
		TopicItemComponent,
		CardDragDropComponent,
		DropTargetDirective,
	],
	templateUrl: "./card-list.component.html",
	styleUrl: "./card-list.component.css",
})
export class CardListComponent implements OnInit, OnDestroy {
	@Input() topics: Topic[] = [];
	@Input() expandedTopics: Map<string, boolean> = new Map<string, boolean>();
	@Input() allExpanded = false;
	@Input() cardsWithoutTags: (Card | CardSimple)[] = [];
	@Input() expandAllCardsWithoutTags = false;

	@Output() toggleAllTopics = new EventEmitter<void>();
	@Output() toggleTopic = new EventEmitter<string>();
	@Output() cardDroppedOnTopic = new EventEmitter<MoveCardDto>();
	@Output() topicDropped = new EventEmitter<MoveTopicDto>();

	areCardsWithoutTagsExpanded = false;
	topLevelTarget!: DropTarget<DraggedTopicItem, { targetTopicId: null }>;

	private destroy$ = new Subject<void>();

	constructor(private dnd: DndService) {}

	ngOnInit(): void {
		this.topLevelTarget = this.dnd.dropTarget<
			DraggedTopicItem,
			{ targetTopicId: null }
		>(TOPIC_TYPE, {
			canDrop: (
				monitor: DropTargetMonitor<DraggedTopicItem, { targetTopicId: null }>,
			) => {
				const item = monitor.getItem();
				return !!item && item.topicId !== "";
			},
			drop: (
				monitor: DropTargetMonitor<DraggedTopicItem, { targetTopicId: null }>,
			) => {
				const draggedItem = monitor.getItem();
				if (!draggedItem) {
					console.error("Drop chamado sem item arrastado disponível.");
					return;
				}

				console.log(
					`Tópico ${draggedItem.topicId} soltado em nível superior (top-level)`,
				);
				this.topicDropped.emit({
					topicId: draggedItem.topicId,
					originalParentId: draggedItem.originalParentId,
					targetParentId: null,
				});

				return { targetTopicId: null };
			},
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		// biome-ignore lint/complexity/useLiteralKeys: <explanation>
		if (changes["expandAllCardsWithoutTags"]) {
			this.areCardsWithoutTagsExpanded = this.expandAllCardsWithoutTags;
		}
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
		if (this.topLevelTarget) {
			this.topLevelTarget.unsubscribe();
		}
	}

	toggleCardsWithoutTags(): void {
		this.areCardsWithoutTagsExpanded = !this.areCardsWithoutTagsExpanded;
	}

	onCardDroppedOnTopic(event: MoveCardDto): void {
		console.log("CardListComponent recebeu card drop:", event);
		this.cardDroppedOnTopic.emit(event);
	}

	onTopicDropped(event: MoveTopicDto): void {
		console.log("CardListComponent recebeu topic drop:", event);
		this.topicDropped.emit(event);
	}
}
