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
		const cardTags = await this.cardTagRepository.find({
			where: { card: { owner: { id: userId } } },
			relations: ["tag", "card"],
		});

		const allTags = await this.tagRepository.find({
			where: { deletedAt: IsNull() },
			relations: ["children"],
		});

		const tagMap: { [id: string]: TagNodeDto } = {};
		const rootTags: TagNodeDto[] = [];

		for (const tag of allTags) {
			tagMap[tag.id] = {
				id: tag.id,
				name: tag.name,
				cards: [],
				children: [],
			};
			if (!tag.parentId) {
				rootTags.push(tagMap[tag.id]);
			} else {
				const parent = tagMap[tag.parentId];
				if (parent) {
					parent.children.push(tagMap[tag.id]);
				}
			}
		}

		for (const cardTag of cardTags) {
			const tagId = cardTag.tagId;
			const card = toPlainToInstance(SimpleCardDto, cardTag.card);
			if (tagMap[tagId]) {
				tagMap[tagId].cards.push(card);
			}
		}

		return { tags: rootTags };
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
