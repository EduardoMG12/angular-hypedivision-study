import {
	Injectable,
	NotFoundException,
	BadRequestException,
	Inject,
	forwardRef,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Deck } from "src/entities/decks.entity";
import { UsersService } from "src/users/users.service";
import { GroupDecksService } from "src/group-decks/group-decks.service";
import { DeckCardService } from "src/deck-card/deck-card.service";
import { CreateDeckDto } from "./dto/create.dto";
import { DeckDto } from "./dto/deck.dto";
import { DeckWithCardsDto } from "./dto/deck-with-cards.dto";
import { ChangeDeckStatusDto } from "./dto/change-status.dto";
import { UpdateDeckDto } from "./dto/update.dto";
import { UpdateDeckReferenceGroupDecksDto } from "./dto/update-deckReferenceGroupDecks.dto";
import { DeckStatus } from "src/entities/common/enums/deck-status.enum";
import { toPlainToInstance } from "src/common/utils/to-plain-to-instance";
import { GroupDecks } from "src/entities/group_decks.entity";

@Injectable()
export class DeckService {
	constructor(
		@InjectRepository(Deck)
		private deckRepository: Repository<Deck>,
		private readonly usersService: UsersService,
		private readonly groupDecksService: GroupDecksService,
		@Inject(forwardRef(() => DeckCardService))
		private readonly deckCardService: DeckCardService,
	) {}

	async create(userId: string, deckData: CreateDeckDto): Promise<DeckDto> {
		let groupDeck = null as GroupDecks | null;
		if (deckData.groupDecksId) {
			groupDeck = await this.groupDecksService.findByIdEntity(
				userId,
				deckData.groupDecksId,
			);
		}

		const deck = this.deckRepository.create({
			title: deckData.title,
			description: deckData.description || "",
			owner: { id: userId },
			groupDeck,
			status: DeckStatus.Active,
		});

		const savedDeck = await this.deckRepository.save(deck);
		return savedDeck;
	}

	async findAll(userId: string): Promise<DeckDto[]> {
		const decks = await this.deckRepository.find({
			where: { owner: { id: userId } },
		});

		return toPlainToInstance(DeckDto, decks);
	}

	async findById(userId: string, deckId: string): Promise<DeckDto> {
		const deck = await this.deckRepository.findOne({
			where: { id: deckId, owner: { id: userId } },
		});
		if (!deck) {
			throw new NotFoundException("Deck not found.");
		}
		return deck;
	}

	async findByIdWithCards(
		userId: string,
		deckId: string,
	): Promise<DeckWithCardsDto> {
		const deck = await this.deckRepository.findOne({
			where: { id: deckId, owner: { id: userId } },
		});
		if (!deck) {
			throw new NotFoundException("Deck not found.");
		}

		const deckCards = await this.deckCardService.findCardsInDeck(
			userId,
			deckId,
		);

		return { ...deck, deckCards };
	}

	async changeStatus(
		userId: string,
		deckData: ChangeDeckStatusDto,
	): Promise<DeckDto> {
		const deck = await this.deckRepository.findOne({
			where: { id: deckData.id, owner: { id: userId } },
		});
		if (!deck) {
			throw new NotFoundException("Deck not found.");
		}

		if (deck.status === deckData.status) {
			throw new BadRequestException("Cannot change to the same status.");
		}

		deck.status = deckData.status;
		const updatedDeck = await this.deckRepository.save(deck);
		return updatedDeck;
	}

	async update(userId: string, deckData: UpdateDeckDto): Promise<DeckDto> {
		const deck = await this.deckRepository.findOne({
			where: { id: deckData.id, owner: { id: userId } },
		});
		if (!deck) {
			throw new NotFoundException("Deck not found.");
		}

		deck.title = deckData.title || deck.title;
		deck.description = deckData.description || deck.description;
		deck.updatedAt = new Date();

		const updatedDeck = await this.deckRepository.save(deck);
		return updatedDeck;
	}

	async updateReferenceGroupDecks(
		userId: string,
		updateData: UpdateDeckReferenceGroupDecksDto,
	): Promise<DeckDto> {
		const deck = await this.deckRepository.findOne({
			where: { id: updateData.deckId, owner: { id: userId } },
		});
		if (!deck) {
			throw new NotFoundException("Deck not found.");
		}

		if (updateData.groupDecksId === deck.groupDecksId) {
			throw new BadRequestException("Deck is already assigned to this group.");
		}

		if (!updateData.groupDecksId) {
			deck.groupDeck = null;
			deck.groupDecksId = null;
		} else {
			const groupDeck = await this.groupDecksService.findByIdEntity(
				userId,
				updateData.groupDecksId,
			);
			deck.groupDeck = groupDeck;
			deck.groupDecksId = groupDeck.id;
		}

		const updatedDeck = await this.deckRepository.save(deck);
		return updatedDeck;
	}

	async delete(userId: string, deckId: string): Promise<DeckDto> {
		const deck = await this.deckRepository.findOne({
			where: { id: deckId, owner: { id: userId } },
		});
		if (!deck) {
			throw new NotFoundException("Deck not found.");
		}

		await this.deckRepository.delete(deckId);
		return deck;
	}
}
