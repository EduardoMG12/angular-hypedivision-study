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
import { toPlainToInstance } from "src/common/utils/toPlainToInstance";
import { CardDto } from "src/card/dto/card.dto";
import { CardTag } from "src/entities/cardTags.entity";
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

		// Start a transaction
		const movedTagEntity = await this.tagRepository.manager.transaction(
			async (manager: EntityManager) => {
				// Verify the tag to move exists and is not deleted
				const tagToMove = await manager.findOne(Tag, {
					where: { id: tagId, deletedAt: IsNull() },
				});
				if (!tagToMove) {
					throw new NotFoundException(
						`Tag with ID "${tagId}" not found or deleted.`,
					);
				}
				// Opcional: Verify ownership/permission here using verifyTagOwnership or logic customizada

				// Get the target parent tag if targetParentId is provided and not null
				let targetParentTag: Tag | null = null;
				let newParentPath = "";
				let newParentId: string | null = null;

				if (targetParentId !== undefined && targetParentId !== null) {
					// Use manager to find within the transaction
					targetParentTag = await manager.findOne(Tag, {
						where: { id: targetParentId, deletedAt: IsNull() },
					});

					if (!targetParentTag) {
						throw new NotFoundException(
							`Target parent tag with ID "${targetParentId}" not found or deleted.`,
						);
					}
					// Opcional: Verify ownership/permission of target parent

					// Prevent moving into a descendant
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
				// If targetParentId is null/undefined, it moves to the root.

				// Calculate the new path for the tag to move
				const newTagPath = newParentPath
					? `${newParentPath}::${tagToMove.name}`
					: tagToMove.name;

				// Check if the new path already exists for another tag (active ones)
				const existingTagWithNewPath = await manager.findOne(Tag, {
					where: {
						path: newTagPath,
						id: Not(tagToMove.id), // Ensure it's not the tag itself
						deletedAt: IsNull(), // Only check against active tags
					},
				});
				if (existingTagWithNewPath) {
					throw new BadRequestException(
						`A tag with the path "${newTagPath}" already exists.`,
					);
				}

				// Store the old path for descendants
				const oldTagPath = tagToMove.path;

				// 1. Update the moved tag's parentId and path
				tagToMove.parentId = newParentId; // Correct type assignment now
				tagToMove.path = newTagPath;
				await manager.save(tagToMove);
				console.log(
					`Tag "${tagToMove.name}" (ID: ${tagToMove.id}) moved. New Parent: ${newParentId || "Root"}, New Path: ${newTagPath}`,
				);

				// 2. Update the paths of all descendants
				// Find all active descendants whose path starts with the old path prefix
				const descendants = await manager.find(Tag, {
					where: {
						path: Like(`${oldTagPath}::%`), // Finds paths like "old::%"
						deletedAt: IsNull(), // Only update active descendants
						// If tags have owner, add owner filter here
					},
				});

				for (const descendant of descendants) {
					// Extract the part of the descendant's path AFTER the old prefix
					// path: 'old::part1::part2', oldTagPath: 'old' -> suffix = '::part1::part2'
					// path: 'old::part1::part2', oldTagPath: 'old::part1' -> suffix = '::part2'
					const suffix = descendant.path.substring(oldTagPath.length);

					// Construct the new path: new prefix + suffix
					descendant.path = newTagPath + suffix;

					await manager.save(descendant); // Save the descendant with the new path
					console.log(
						`Descendant "${descendant.name}" (ID: ${descendant.id}) path updated to: ${descendant.path}`,
					);
				}

				// Return the updated tag entity (potentially with relations loaded)
				const updatedTag = await manager.findOne(Tag, {
					where: { id: tagId, deletedAt: IsNull() }, // Find the active, moved tag
					relations: ["parent", "children"], // Load relations if needed
				});

				if (!updatedTag) {
					// This should not happen if the save was successful and the tag is active
					// But adding a check provides robustness.
					throw new NotFoundException(
						`Failed to load updated tag with ID "${tagId}" after the transaction.`,
					);
				}

				return updatedTag; // Return the updated entity
			},
		);

		// Return the DTO representation of the updated tag
		return movedTagEntity; // Convert the entity to the new TagDto
	}
}
