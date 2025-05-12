import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { Tag } from "src/entities/tags.entity";

import { Card } from "src/entities/cards.entity";
import { GetAllTagsDto, SimpleCardDto, TagNodeDto } from "./dto/tag-node.dto";
import { toPlainToInstance } from "src/common/utils/toPlainToInstance";
import { CardDto } from "src/card/dto/card.dto";
import { CardTag } from "src/entities/cardTags.entity";

@Injectable()
export class TagService {
	constructor(
		@InjectRepository(Tag)
		private tagRepository: Repository<Tag>,
		@InjectRepository(CardTag)
		private cardTagRepository: Repository<CardTag>,
		@InjectRepository(Card)
		private cardRepository: Repository<Card>,
	) {}

	async getAllTags(userId: string): Promise<GetAllTagsDto> {
		const cardTagsForUser = await this.cardTagRepository.find({
			where: { card: { owner: { id: userId } } },
			relations: ["tag", "card", "card.owner"],
		});

		const allTags = await this.tagRepository.find({
			where: { deletedAt: IsNull() },
			relations: ["children"],
		});

		const tagMap: { [id: string]: TagNodeDto } = {};
		for (const tag of allTags) {
			tagMap[tag.id] = {
				id: tag.id,
				name: tag.name,
				cards: [],
				children: [],
				childrenCardsCount: 0,
			};
		}

		const potentialRootTags: TagNodeDto[] = [];
		for (const tag of allTags) {
			if (!tag.parentId) {
				potentialRootTags.push(tagMap[tag.id]);
			} else {
				const parentTagNode = tagMap[tag.parentId];
				if (parentTagNode) {
					parentTagNode.children.push(tagMap[tag.id]);
				}
			}
		}

		// biome-ignore lint/complexity/noForEach: <explanation>
		Object.values(tagMap).forEach((tagNode) => {
			tagNode.children.sort((a, b) => a.name.localeCompare(b.name));
		});

		for (const cardTag of cardTagsForUser) {
			const tagId = cardTag.tag.id;

			const card = toPlainToInstance(SimpleCardDto, {
				...cardTag.card,
				owner_id: cardTag.card.owner.id,
			});
			if (tagMap[tagId]) {
				tagMap[tagId].cards.push(card);
			}
		}

		const finalRootTags: TagNodeDto[] = [];

		function processTagNode(tagNode: TagNodeDto): number {
			let totalCardsInBranch = tagNode.cards.length;

			const childrenWithOwnedCards: TagNodeDto[] = [];
			for (const childNode of tagNode.children) {
				const cardsInChildBranch = processTagNode(childNode);
				if (cardsInChildBranch > 0) {
					childrenWithOwnedCards.push(childNode);
					totalCardsInBranch += cardsInChildBranch;
				}
			}

			tagNode.children = childrenWithOwnedCards;

			tagNode.childrenCardsCount = totalCardsInBranch;

			return totalCardsInBranch;
		}

		for (const rootNode of potentialRootTags) {
			const totalOwnedCardsInRoot = processTagNode(rootNode);
			if (totalOwnedCardsInRoot > 0) {
				finalRootTags.push(rootNode);
			}
		}

		finalRootTags.sort((a, b) => a.name.localeCompare(b.name));

		return { tags: finalRootTags };
	}

	async findByPath(path: string): Promise<Tag | null> {
		return this.tagRepository.findOne({ where: { path } });
	}

	async create(name: string, parentId?: string): Promise<Tag> {
		if (!name || name.includes("::")) {
			throw new BadRequestException("Nome da tag inválido");
		}
		let path: string;
		if (parentId) {
			const parent = await this.tagRepository.findOne({
				where: { id: parentId },
			});
			if (!parent) {
				throw new BadRequestException("Tag pai não encontrada");
			}
			path = `${parent.path}::${name}`;
		} else {
			path = name;
		}

		const tag = this.tagRepository.create({ name, parentId, path });
		return this.tagRepository.save(tag);
	}
}
