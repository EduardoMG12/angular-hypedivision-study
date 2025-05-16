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
	DndService,
	DragSource,
	DropTarget,
	DragSourceMonitor,
	DropTargetMonitor,
	DragSourceDirective,
	DropTargetDirective,
} from "@ng-dnd/core";
import { Subject } from "rxjs";
import {
	CARD_TYPE,
	TOPIC_TYPE,
	Topic,
	DraggedCardItem,
	DraggedTopicItem,
	MoveCardDto,
	MoveTopicDto,
} from "../../common/api/interfaces/my-cards-list.interface";
import { CardDragDropComponent } from "../card-drag-drop/card-drag-drop.component";

type TopicDropResult = { targetTopicId: string };

@Component({
	selector: "app-topic-item",
	standalone: true,
	imports: [
		CommonModule,
		NgStyle,
		NgClass,
		DragSourceDirective,
		DropTargetDirective,
		CardDragDropComponent,
	],
	templateUrl: "./topic-item.component.html",
})
export class TopicItemComponent implements OnInit, OnDestroy {
	@Input() topic!: Topic;
	@Input() level = 0;
	@Input() expandedTopics!: Map<string, boolean>;
	@Input() topics: Topic[] = [];

	isHovered = false;

	@Output() toggle = new EventEmitter<string>();
	@Output() cardDroppedOnTopic = new EventEmitter<MoveCardDto>();
	@Output() topicDropped = new EventEmitter<MoveTopicDto>();

	private readonly CARD_TYPE = CARD_TYPE;
	private readonly TOPIC_TYPE = TOPIC_TYPE;

	private destroy$ = new Subject<void>();
	private hoverTimeout: any = null;
	private readonly HOVER_DELAY = 500;
	private isHovering = false;

	topicSource!: DragSource<DraggedTopicItem, TopicDropResult>;
	topicTarget!: DropTarget<DraggedCardItem | DraggedTopicItem, TopicDropResult>;

	constructor(private dnd: DndService) {}

	ngOnInit(): void {
		this.topicSource = this.dnd.dragSource<DraggedTopicItem, TopicDropResult>(
			this.TOPIC_TYPE,
			{
				beginDrag: () => {
					console.log("Iniciando arrasto do tópico:", this.topic.name);
					const parentId = this.findParentId(this.topic.id, this.topics);
					const item: DraggedTopicItem = {
						topicId: this.topic.id,
						originalParentId: parentId,
					};
					return item;
				},
				endDrag: (
					monitor: DragSourceMonitor<DraggedTopicItem, TopicDropResult>,
				) => {
					const draggedItem = monitor.getItem();
					const dropResult = monitor.getDropResult();
					const didDrop = monitor.didDrop();

					if (!draggedItem) {
						console.error("endDrag chamado sem item arrastado disponível.");
						return;
					}

					console.log("Arrasto finalizado para o tópico:", draggedItem.topicId);
					if (didDrop && dropResult) {
						console.log("Soltado em:", dropResult);
					} else {
						console.log("Arrasto cancelado ou não soltado em um local válido.");
					}
				},
			},
		);

		this.topicTarget = this.dnd.dropTarget<
			DraggedCardItem | DraggedTopicItem,
			TopicDropResult
		>([this.CARD_TYPE, this.TOPIC_TYPE], {
			canDrop: (
				monitor: DropTargetMonitor<
					DraggedCardItem | DraggedTopicItem,
					TopicDropResult
				>,
			) => {
				const item = monitor.getItem();
				if (!item) return false;

				if ("card" in item) {
					return item.originalTopicId !== this.topic.id;
				}
				if ("topicId" in item) {
					return (
						item.topicId !== this.topic.id && !this.isDescendant(item.topicId)
					);
				}
				return true;
			},
			hover: (monitor) => {
				if (
					monitor.canDrop() &&
					!this.isExpanded(this.topic.id) &&
					!this.isHovering
				) {
					this.isHovering = true;
					this.hoverTimeout = setTimeout(() => {
						if (this.isHovering && !this.isExpanded(this.topic.id)) {
							this.toggleTopic(this.topic.id); // Expand the topic
						}
						this.hoverTimeout = null;
					}, this.HOVER_DELAY);
				}
			},
			drop: (monitor) => {
				this.isHovering = false;
				if (this.hoverTimeout) {
					clearTimeout(this.hoverTimeout);
					this.hoverTimeout = null;
				}
				const draggedItem = monitor.getItem();
				if (!draggedItem) {
					console.error("Drop chamado sem item arrastado disponível.");
					return;
				}

				if ("card" in draggedItem) {
					console.log(
						`Card ${draggedItem.card.title} soltado no tópico ${this.topic.name}`,
					);
					this.cardDroppedOnTopic.emit({
						cardId: draggedItem.card.id,
						originalTopicId: draggedItem.originalTopicId,
						targetTopicId: this.topic.id,
					});
				} else if ("topicId" in draggedItem) {
					console.log(
						`Tópico ${draggedItem.topicId} soltado no tópico ${this.topic.name}`,
					);
					this.topicDropped.emit({
						topicId: draggedItem.topicId,
						originalParentId: draggedItem.originalParentId,
						targetParentId: this.topic.id,
					});
				}

				return { targetTopicId: this.topic.id };
			},
		});

		this.topicTarget
			.listen((monitor) => {
				if (!monitor.isOver() || !monitor.canDrop()) {
					if (this.hoverTimeout) {
						clearTimeout(this.hoverTimeout);
						this.hoverTimeout = null;
					}
					this.isHovering = false;
				}
			})
			.subscribe();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
		if (this.topicSource) {
			this.topicSource.unsubscribe();
		}
		if (this.topicTarget) {
			this.topicTarget.unsubscribe();
		}
		if (this.hoverTimeout) {
			clearTimeout(this.hoverTimeout);
		}
	}

	toggleTopic(topicId: string): void {
		this.toggle.emit(topicId);
	}

	isExpanded(topicId: string): boolean {
		return this.expandedTopics.get(topicId) || false;
	}

	private findParentId(topicId: string, topics: Topic[]): string | undefined {
		for (const topic of topics) {
			if (topic.children?.some((child) => child.id === topicId)) {
				return topic.id;
			}
			if (topic.children && topic.children.length > 0) {
				const parentId = this.findParentId(topicId, topic.children);
				if (parentId) return parentId;
			}
		}
		return undefined;
	}

	private isDescendant(topicId: string): boolean {
		const checkChildren = (children: Topic[]): boolean => {
			return children.some((child) => {
				if (child.id === topicId) return true;
				if (child.children) return checkChildren(child.children);
				return false;
			});
		};
		return checkChildren(this.topic.children || []);
	}
}
