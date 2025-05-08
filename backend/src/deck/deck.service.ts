import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { CreateDeckDto } from "./dto/create.dto";
import { UsersService } from "src/users/users.service";

import { Repository } from "typeorm";
import { DeckDto } from "./dto/deck.dto";
import { DeckStatus } from "./common/enums/deckStatus.enum";

import { GroupDecksDto } from "src/group-decks/dto/group-decks.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { errorMessages } from "src/common/errors/errors-message";
import { ChangeDeckStatusDto } from "./dto/changeStatus.dto";
import { UpdateDeckDto } from "./dto/update.dto";
import { DeckWithCardsDto } from "./dto/deckWithCards.dto";
import { UpdateDeckReferenceGroupDecksDto } from "./dto/updateDeckReferenceGroupDecks.dto";
import { GroupDecks } from "src/entities/group_decks.entity";
import { DeckWithGroupDecksDto } from "./dto/deckWithGroupDecks.dto";
import { Deck } from "src/entities/decks.entity";
import { GroupDecksService } from "src/group-decks/group-decks.service";

@Injectable()
export class DeckService {
	constructor(
		@InjectRepository(Deck)
		private deckRepository: Repository<Deck>,
		private readonly usersService: UsersService,
		private readonly groupDecksService: GroupDecksService,
	) {}

	async create(userId: string, deckData: CreateDeckDto): Promise<DeckDto> {
		const owner = await this.usersService.findById(userId);

		let groupDecksEntity: GroupDecksDto | null = null;
		if (deckData.group_decks) {
			groupDecksEntity = await this.groupDecksService.findById(
				userId,
				deckData.group_decks,
			);
		}

		const deckEntity = this.deckRepository.create({
			title: deckData.title,
			description: deckData.description || "",
			group_decks: groupDecksEntity,
			owner,
			status: DeckStatus.Active,
			createdAt: new Date(),
		}) as Deck;

		return await this.deckRepository.save(deckEntity);
	}
	async findAll(userId: string): Promise<DeckDto[]> {
		const user = await this.usersService.findById(userId);

		const deck = await this.deckRepository.find({
			where: { owner: { id: user.id } },
		});

		if (!deck) {
			throw new NotFoundException(errorMessages.DECK_NOT_FOUND["pt-BR"]);
		}

		return deck;
	}

	async findById(userId: string, deckId: string): Promise<Deck> {
		const user = await this.usersService.findById(userId);

		const deck = await this.deckRepository.findOne({
			where: { id: deckId, owner: { id: userId } },
			// relations: ["cards", "owner"],
		});

		if (!deck) {
			throw new NotFoundException(errorMessages.DECK_NOT_FOUND["pt-BR"]);
		}

		return deck;
	}

	async findByIdWithCards(
		userId: string,
		deckId: string,
	): Promise<DeckWithCardsDto> {
		const user = await this.usersService.findById(userId);

		const deck = await this.deckRepository.findOne({
			where: { id: deckId, owner: { id: userId } },
			relations: ["cards"],
		});

		if (!deck) {
			throw new NotFoundException(errorMessages.DECK_NOT_FOUND["pt-BR"]);
		}

		return {
			...deck,
			cards: deck.cards || [],
		} as unknown as DeckWithCardsDto; // testar se esta funcionando
	}

	async changeStatus(
		userId: string,
		deckData: ChangeDeckStatusDto,
	): Promise<DeckDto> {
		const user = await this.usersService.findById(userId);

		const deck = await this.findById(user.id, deckData.id);

		if (!deck) {
			throw new NotFoundException(errorMessages.DECK_NOT_FOUND["pt-BR"]);
		}

		const currentStatus = deck.status;
		const targetStatus = deckData.status;

		if (currentStatus === targetStatus) {
			throw new BadRequestException("Cannot change status for egual status");
		}

		deck.status = targetStatus as DeckStatus;

		return await this.deckRepository.save(deck);
	}

	async update(userId: string, deckData: UpdateDeckDto): Promise<DeckDto> {
		const user = await this.usersService.findById(userId);

		const deckEntity = await this.findById(userId, deckData.id);

		deckEntity.title = deckData.title || deckEntity.title;
		deckEntity.description = deckData.description || deckEntity.description;
		deckEntity.updatedAt = new Date();

		return await this.deckRepository.save(deckEntity);
	}

	async updateReferenceGroupDecks(
		userId: string,
		updateReferenceData: UpdateDeckReferenceGroupDecksDto,
	): Promise<DeckWithGroupDecksDto> {
		const deck = await this.findById(userId, updateReferenceData.deckId);

		if (!updateReferenceData.groupDecksId) {
			deck.group_decks = null;
			return await this.deckRepository.save(deck);
		}

		const groupDecksEntity = (await this.groupDecksService.findById(
			userId,
			updateReferenceData.groupDecksId,
		)) as GroupDecks;
		if (groupDecksEntity.id === deck.group_decks?.id) {
			throw new BadRequestException(
				"this groupDecks is egual the old groupDecks",
			);
		}
		deck.group_decks = groupDecksEntity;
		return await this.deckRepository.save(deck);
	}

	async delete(userId: string, id: string): Promise<DeckDto> {
		const user = await this.usersService.findById(userId);

		const deckEntity = await this.findById(userId, id);

		await this.deckRepository.delete(id);

		return deckEntity;
	}
}
