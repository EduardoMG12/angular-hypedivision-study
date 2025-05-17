import {
	Injectable,
	NotFoundException,
	BadRequestException,
	Inject,
	forwardRef,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DeckCard } from "src/entities/deck-cards.entity";
import { DeckService } from "src/deck/deck.service";
import { CardService } from "src/card/card.service";
import { AddCardToDeckDto } from "./dto/add-card-to-deck.dto";
import { RemoveCardFromDeckDto } from "./dto/remove-card-from-deck.dto";
import { UpdateCardOrderDto } from "./dto/update-card-order.dto";
import { DeckCardDto } from "./dto/deck-card-dto.dto";

@Injectable()
export class DeckCardService {
	constructor(
		@InjectRepository(DeckCard)
		private deckCardRepository: Repository<DeckCard>,
		@Inject(forwardRef(() => DeckService))
		private deckService: DeckService,
		private cardService: CardService,
	) {}

	async addCardToDeck(
		userId: string,
		dto: AddCardToDeckDto,
	): Promise<DeckCardDto> {
		await this.deckService.findById(userId, dto.deckId);
		await this.cardService.findById(userId, { id: dto.cardId });

		const existing = await this.deckCardRepository.findOne({
			where: { deckId: dto.deckId, cardId: dto.cardId },
		});
		if (existing) {
			throw new BadRequestException("Card is already in this deck.");
		}

		const orderExists = await this.deckCardRepository.findOne({
			where: { deckId: dto.deckId, order: dto.order },
		});
		if (orderExists) {
			throw new BadRequestException(
				`Order ${dto.order} is already taken in this deck.`,
			);
		}

		const deckCard = this.deckCardRepository.create({
			deckId: dto.deckId,
			cardId: dto.cardId,
			order: dto.order,
		});

		const savedDeckCard = await this.deckCardRepository.save(deckCard);

		const card = await this.cardService.findById(userId, { id: dto.cardId });

		return {
			...savedDeckCard,
			card,
		};
	}

	async removeCardFromDeck(
		userId: string,
		dto: RemoveCardFromDeckDto,
	): Promise<void> {
		await this.deckService.findById(userId, dto.deckId);
		await this.cardService.findById(userId, { id: dto.cardId });

		const deckCard = await this.deckCardRepository.findOne({
			where: { deckId: dto.deckId, cardId: dto.cardId },
		});
		if (!deckCard) {
			throw new NotFoundException("Card is not in this deck.");
		}

		await this.deckCardRepository.delete(deckCard.id);
	}

	async updateCardOrder(
		userId: string,
		dto: UpdateCardOrderDto,
	): Promise<DeckCardDto> {
		await this.deckService.findById(userId, dto.deckId);
		await this.cardService.findById(userId, { id: dto.cardId });

		const deckCard = await this.deckCardRepository.findOne({
			where: { deckId: dto.deckId, cardId: dto.cardId },
		});
		if (!deckCard) {
			throw new NotFoundException("Card is not in this deck.");
		}

		const orderExists = await this.deckCardRepository.findOne({
			where: { deckId: dto.deckId, order: dto.newOrder },
		});
		if (orderExists && orderExists.cardId !== dto.cardId) {
			throw new BadRequestException(
				`Order ${dto.newOrder} is already taken in this deck.`,
			);
		}

		deckCard.order = dto.newOrder;
		const updatedDeckCard = await this.deckCardRepository.save(deckCard);

		const card = await this.cardService.findById(userId, { id: dto.cardId });

		return {
			...updatedDeckCard,
			card,
		};
	}

	async findCardsInDeck(
		userId: string,
		deckId: string,
	): Promise<DeckCardDto[]> {
		await this.deckService.findById(userId, deckId);

		const deckCards = await this.deckCardRepository.find({
			where: { deckId },
			relations: ["card", "card.contentFlip"],
			order: { order: "ASC" },
		});

		return deckCards.map((dc) => ({
			...dc,
			card: dc.card,
		}));
	}
}
