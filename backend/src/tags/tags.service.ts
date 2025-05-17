import {
	Injectable,
	BadRequestException,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, IsNull, Like, Not, Repository } from "typeorm";
import { Tag } from "src/entities/tags.entity";

import { Card } from "src/entities/cards.entity";
import { GetAllTagsDto, SimpleCardDto, TagNodeDto } from "./dto/tag-node.dto";
import { toPlainToInstance } from "src/common/utils/to-plain-to-instance";
import { CardDto } from "src/card/dto/card.dto";
import { CardTag } from "src/entities/card-tags.entity";
import { MoveTagDto } from "./dto/move-tag.dto";
import { TagDto } from "./dto/tag.dto";

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

	async findById(tagId: string): Promise<Tag | null> {
		const tag = await this.tagRepository.findOne({
			where: { id: tagId },
		});
		if (!tag) {
			throw new NotFoundException(`Tag with ID "${tagId}" not found.`);
		}
		return tag;
	}

	async moveTag(userId: string, moveTagDto: MoveTagDto): Promise<Tag> {
		const { tagId, targetParentId } = moveTagDto;

		if (tagId === targetParentId) {
			throw new BadRequestException("Cannot move a tag into itself.");
		}

		const movedTagEntity = await this.tagRepository.manager.transaction(
			async (manager: EntityManager) => {
				const tagToMove = await manager.findOne(Tag, {
					where: { id: tagId, deletedAt: IsNull() },
				});
				if (!tagToMove) {
					throw new NotFoundException(
						`Tag with ID "${tagId}" not found or deleted.`,
					);
				}

				let targetParentTag: Tag | null = null;
				let newParentPath = "";
				let newParentId: string | null = null;

				if (targetParentId !== undefined && targetParentId !== null) {
					targetParentTag = await manager.findOne(Tag, {
						where: { id: targetParentId, deletedAt: IsNull() },
					});

					if (!targetParentTag) {
						throw new NotFoundException(
							`Target parent tag with ID "${targetParentId}" not found or deleted.`,
						);
					}

					const targetPath = targetParentTag.path;
					const tagToMovePath = tagToMove.path;
					if (
						targetPath.startsWith(tagToMovePath) &&
						targetPath.length > tagToMovePath.length
					) {
						throw new BadRequestException(
							`Cannot move the tag "${tagToMove.name}" into one of its own descendants ("${targetParentTag.name}").`,
						);
					}

					newParentPath = targetParentTag.path;
					newParentId = targetParentId;
				}

				const newTagPath = newParentPath
					? `${newParentPath}::${tagToMove.name}`
					: tagToMove.name;

				const existingTagWithNewPath = await manager.findOne(Tag, {
					where: {
						path: newTagPath,
						id: Not(tagToMove.id),
						deletedAt: IsNull(),
					},
				});
				if (existingTagWithNewPath) {
					throw new BadRequestException(
						`A tag with the path "${newTagPath}" already exists.`,
					);
				}

				const oldTagPath = tagToMove.path;

				// 1. Update the moved tag's parentId and path
				tagToMove.parentId = newParentId;
				tagToMove.path = newTagPath;
				await manager.save(tagToMove);

				// 2. Update the paths of all descendants
				const descendants = await manager.find(Tag, {
					where: {
						path: Like(`${oldTagPath}::%`),
						deletedAt: IsNull(),
					},
				});

				for (const descendant of descendants) {
					// Extract the part of the descendant's path AFTER the old prefix
					// path: 'old::part1::part2', oldTagPath: 'old' -> suffix = '::part1::part2'
					// path: 'old::part1::part2', oldTagPath: 'old::part1' -> suffix = '::part2'
					const suffix = descendant.path.substring(oldTagPath.length);

					descendant.path = newTagPath + suffix;

					await manager.save(descendant);
				}

				const updatedTag = await manager.findOne(Tag, {
					where: { id: tagId, deletedAt: IsNull() },
					relations: ["parent", "children"],
				});

				if (!updatedTag) {
					throw new NotFoundException(
						`Failed to load updated tag with ID "${tagId}" after the transaction.`,
					);
				}

				return updatedTag;
			},
		);

		return movedTagEntity;
	}
}
