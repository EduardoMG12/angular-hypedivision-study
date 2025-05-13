import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { TopicItemComponent } from "../../components/topic-item/topic-item.component";
import type { Topic } from "../../common/api/interfaces/my-cards-list.interface";
import { ActivatedRoute, Data, RouterLink } from "@angular/router";

@Component({
	selector: "app-my-cards",
	standalone: true,
	imports: [CommonModule, SideBarComponent, TopicItemComponent, RouterLink],
	templateUrl: "./my-cards.component.html",
	styleUrl: "./my-cards.component.css",
})
export class MyCardsComponent implements OnInit {
	topics: Topic[] = [];
	expandedTopics: Map<string, boolean> = new Map<string, boolean>();
	allExpanded = false;

	constructor(private route: ActivatedRoute) {}

	ngOnInit(): void {
		this.route.data.subscribe((data: Data) => {
			// biome-ignore lint/complexity/useLiteralKeys: <explanation>
			const resolvedTopics = data["topics"] as Topic[] | null;
			if (resolvedTopics) {
				this.topics = resolvedTopics;
				this.initializeExpandedState(this.topics);
			}
		});
	}

	private initializeExpandedState(topics: Topic[]): void {
		// biome-ignore lint/complexity/noForEach: <explanation>
		topics.forEach((topic) => {
			this.expandedTopics.set(topic.id, false);
			if (topic.children && topic.children.length > 0) {
				this.initializeExpandedState(topic.children);
			}
		});
	}

	toggleTopic(topicId: string): void {
		const currentState = this.expandedTopics.get(topicId) || false;
		this.expandedTopics.set(topicId, !currentState);
	}

	isExpanded(topicId: string): boolean {
		return this.expandedTopics.get(topicId) || false;
	}

	toggleAllTopics(): void {
		this.allExpanded = !this.allExpanded;
		this.setExpandedStateForAll(this.topics, this.allExpanded);
	}

	private setExpandedStateForAll(topics: Topic[], state: boolean): void {
		// biome-ignore lint/complexity/noForEach: <explanation>
		topics.forEach((topic) => {
			this.expandedTopics.set(topic.id, state);
			if (topic.children && topic.children.length > 0) {
				this.setExpandedStateForAll(topic.children, state);
			}
		});
	}
}
