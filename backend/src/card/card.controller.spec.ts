import { Test, TestingModule } from "@nestjs/testing";
import { CardController } from "./card.controller";
import { CardService } from "./card.service";
import { CardDto } from "./dto/card.dto";
import { CreateCardDto } from "./dto/create.dto";
import { CreateMultipleCardsDto } from "./dto/createMultipleCards.dto";
import { ChangeCardTypeDto } from "./dto/changeType.dto";
import { UpdateCardDto } from "./dto/update.dto";
import { FindCardDto } from "./dto/find.dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { errorMessages } from "../common/errors/errors-message";
import { CardType } from "./common/enum/cardType.enum";

describe("CardController", () => {
	let controller: CardController;
	let cardService: jest.Mocked<CardService>;

	const mockCardService = {
		create: jest.fn(),
		createBulk: jest.fn(),
		findById: jest.fn(),
		changeType: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	};

	const mockUserId = "123e4567-e89b-12d3-a456-426614174000";
	const mockCard: CardDto = {
		id: "e88a3595-4d51-4b86-87ac-09baf69b7654",
		frontend: "English",
		backend: "Learn basic English vocabulary",
		deck: null,
		type: CardType.Flip,
		createdAt: new Date("2025-05-06T17:33:42.306Z"),
		updatedAt: new Date("2025-05-06T20:35:10.907Z"),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CardController],
			providers: [
				{
					provide: CardService,
					useValue: mockCardService,
				},
			],
		}).compile();

		controller = module.get<CardController>(CardController);
		cardService = module.get(CardService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("create", () => {
		it("should create a card and return CardDto", async () => {
			const createCardDto: CreateCardDto = {
				frontend: "English",
				backend: "Learn basic English vocabulary",
				deckId: "e88a3595-4d51-4b86-87ac-09baf69b7654",
			};

			cardService.create.mockResolvedValue(mockCard);

			const result = await controller.create(mockUserId, createCardDto);

			expect(cardService.create).toHaveBeenCalledWith(
				mockUserId,
				createCardDto,
			);
			expect(result).toEqual(mockCard);
			expect(result).toBeInstanceOf(CardDto);
		});

		it("should throw BadRequestException if create fails", async () => {
			const createCardDto: CreateCardDto = {
				frontend: "",
				backend: "Invalid card",
				deckId: "e88a3595-4d51-4b86-87ac-09baf69b7654",
			};

			cardService.create.mockRejectedValue(
				new BadRequestException(errorMessages.INVALID_INPUT["pt-BR"]),
			);

			await expect(
				controller.create(mockUserId, createCardDto),
			).rejects.toThrow(BadRequestException);
			expect(cardService.create).toHaveBeenCalledWith(
				mockUserId,
				createCardDto,
			);
		});
	});

	describe("createBulk", () => {
		it("should create multiple cards and return CardDto array", async () => {
			const createMultipleCardsDto: CreateMultipleCardsDto = {
				deckId: "e88a3595-4d51-4b86-87ac-09baf69b7654",
				cards: [
					{
						frontend: "English",
						backend: "Learn vocabulary",
						type: CardType.Flip,
					},
					{ frontend: "Math", backend: "Algebra basics", type: CardType.Flip },
				],
			};

			const mockCards = [
				mockCard,
				{
					...mockCard,
					id: "different-id",
					frontend: "Math",
					backend: "Algebra basics",
				},
			];
			cardService.createBulk.mockResolvedValue(mockCards);

			const result = await controller.createBulk(
				mockUserId,
				createMultipleCardsDto,
			);

			expect(cardService.createBulk).toHaveBeenCalledWith(
				mockUserId,
				createMultipleCardsDto,
			);
			expect(result).toEqual(mockCards);
			expect(result).toBeInstanceOf(Array);
			expect(result[0]).toMatchObject(mockCard);
		});

		it("should throw BadRequestException if createBulk fails", async () => {
			const createMultipleCardsDto: CreateMultipleCardsDto = {
				deckId: "e88a3595-4d51-4b86-87ac-09baf69b7654",
				cards: [{ frontend: "", backend: "Invalid", type: CardType.Flip }],
			};

			cardService.createBulk.mockRejectedValue(
				new BadRequestException(errorMessages.INVALID_INPUT["pt-BR"]),
			);

			await expect(
				controller.createBulk(mockUserId, createMultipleCardsDto),
			).rejects.toThrow(BadRequestException);
			expect(cardService.createBulk).toHaveBeenCalledWith(
				mockUserId,
				createMultipleCardsDto,
			);
		});
	});

	describe("findById", () => {
		it("should find a card by ID and return CardDto", async () => {
			const findDto: FindCardDto = { id: mockCard.id };

			cardService.findById.mockResolvedValue(mockCard);

			const result = await controller.findById(mockUserId, findDto);

			expect(cardService.findById).toHaveBeenCalledWith(mockUserId, findDto);
			expect(result).toEqual(mockCard);
			expect(result).toBeInstanceOf(CardDto);
		});

		it("should throw NotFoundException if card is not found", async () => {
			const findDto: FindCardDto = { id: "non-existent-id" };

			cardService.findById.mockRejectedValue(
				new NotFoundException(errorMessages.DECK_NOT_FOUND["pt-BR"]),
			);

			await expect(controller.findById(mockUserId, findDto)).rejects.toThrow(
				NotFoundException,
			);
			expect(cardService.findById).toHaveBeenCalledWith(mockUserId, findDto);
		});
	});

	describe("changeType", () => {
		it("should change card type and return CardDto", async () => {
			const changeTypeDto: ChangeCardTypeDto = {
				cardId: mockCard.id,
				newType: CardType.MultipleChoice,
			};

			cardService.changeType.mockResolvedValue(mockCard);

			const result = await controller.changeType(mockUserId, changeTypeDto);

			expect(cardService.changeType).toHaveBeenCalledWith(
				mockUserId,
				changeTypeDto,
			);
			expect(result).toEqual(mockCard);
			expect(result).toBeInstanceOf(CardDto);
		});

		it("should throw NotFoundException if card is not found", async () => {
			const changeTypeDto: ChangeCardTypeDto = {
				cardId: "non-existent-id",
				newType: CardType.MultipleChoice,
			};

			cardService.changeType.mockRejectedValue(
				new NotFoundException(errorMessages.DECK_NOT_FOUND["pt-BR"]),
			);

			await expect(
				controller.changeType(mockUserId, changeTypeDto),
			).rejects.toThrow(NotFoundException);
			expect(cardService.changeType).toHaveBeenCalledWith(
				mockUserId,
				changeTypeDto,
			);
		});
	});

	describe("update", () => {
		it("should update a card and return CardDto", async () => {
			const updateCardDto: UpdateCardDto = {
				cardId: mockCard.id,
				frontend: "Updated frontend",
				backend: "Updated backend",
			};

			cardService.update.mockResolvedValue(mockCard);

			const result = await controller.update(mockUserId, updateCardDto);

			expect(cardService.update).toHaveBeenCalledWith(
				mockUserId,
				updateCardDto,
			);
			expect(result).toEqual(mockCard);
			expect(result).toBeInstanceOf(CardDto);
		});

		it("should throw NotFoundException if card is not found", async () => {
			const updateCardDto: UpdateCardDto = {
				cardId: "non-existent-id",
				frontend: "Invalid",
			};

			cardService.update.mockRejectedValue(
				new NotFoundException(errorMessages.DECK_NOT_FOUND["pt-BR"]),
			);

			await expect(
				controller.update(mockUserId, updateCardDto),
			).rejects.toThrow(NotFoundException);
			expect(cardService.update).toHaveBeenCalledWith(
				mockUserId,
				updateCardDto,
			);
		});
	});

	describe("delete", () => {
		it("should delete a card and return CardDto", async () => {
			const deleteDto = { id: mockCard.id };

			cardService.delete.mockResolvedValue(mockCard);

			const result = await controller.delete(mockUserId, deleteDto);

			expect(cardService.delete).toHaveBeenCalledWith(mockUserId, deleteDto.id);
			expect(result).toEqual(mockCard);
			expect(result).toBeInstanceOf(CardDto);
		});

		it("should throw NotFoundException if card is not found", async () => {
			const deleteDto = { id: "non-existent-id" };

			cardService.delete.mockRejectedValue(
				new NotFoundException(errorMessages.DECK_NOT_FOUND["pt-BR"]),
			);

			await expect(controller.delete(mockUserId, deleteDto)).rejects.toThrow(
				NotFoundException,
			);
			expect(cardService.delete).toHaveBeenCalledWith(mockUserId, deleteDto.id);
		});
	});
});
