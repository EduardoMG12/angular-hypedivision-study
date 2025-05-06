import { Test, TestingModule } from "@nestjs/testing";
import { CardService } from "./card.service";
import { Repository } from "typeorm";
import { Cards } from "src/entities/cards.entity";
import { UsersService } from "src/users/users.service";
import { FlashcardService } from "../flashcard/flashcard.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import {
	BadRequestException,
	ForbiddenException,
	NotFoundException,
} from "@nestjs/common";
import { CardType } from "./common/enum/cardType.enum";
import { Flashcard } from "src/entities/flashcards.entity";
import { CreateCardDto } from "./dto/create.dto";
import { CreateMultipleCardsDto } from "./dto/createMultipleCards.dto";
import { UpdateCardDto } from "./dto/update.dto";
import { ChangeCardTypeDto } from "./dto/changeType.dto";
import { FindCardDto } from "./dto/find.dto";

type MockCardRepository = Partial<Record<keyof Repository<Cards>, jest.Mock>>;
type MockUsersService = Partial<Record<keyof UsersService, jest.Mock>>;
type MockFlashcardService = Partial<Record<keyof FlashcardService, jest.Mock>>;

const mockCardRepository: () => MockCardRepository = () => ({
	create: jest.fn(),
	save: jest.fn(),
	findOne: jest.fn(),
	delete: jest.fn(),
	merge: jest.fn(),
});

const mockUsersService: () => MockUsersService = () => ({
	findById: jest.fn(),
});

const mockFlashcardService: () => MockFlashcardService = () => ({
	findById: jest.fn(),
});

describe("CardService", () => {
	let service: CardService;
	let cardRepository: MockCardRepository & {
		create: jest.Mock;
		save: jest.Mock;
		findOne: jest.Mock;
		delete: jest.Mock;
		merge: jest.Mock;
	};
	let usersService: MockUsersService & { findById: jest.Mock };
	let flashcardService: MockFlashcardService & { findById: jest.Mock };

	const userId = "user-id";
	const flashcardId = "flashcard-id";
	const cardId = "card-id";
	const mockUser = { id: userId };
	const mockFlashcard = { id: flashcardId, owner: mockUser } as Flashcard;
	const mockCard = {
		id: cardId,
		frontend: "Front",
		backend: "Back",
		type: CardType.Flip,
		flashcard: mockFlashcard,
	} as Cards;
	const createCardDto: CreateCardDto = {
		frontend: "Front",
		backend: "Back",
		flashcardId: flashcardId,
	};
	const createBulkCardsDto: CreateMultipleCardsDto = {
		flashcardId: flashcardId,
		cards: [
			{ frontend: "Front 1", backend: "Back 1" },
			{ frontend: "Front 2", backend: "Back 2" },
		],
	};
	const updateCardDto: UpdateCardDto = {
		cardId: cardId,
		frontend: "New Front",
	};
	const changeCardTypeDto: ChangeCardTypeDto = {
		cardId: cardId,
		newType: CardType.MultipleChoice,
	};
	const findCardDto: FindCardDto = { id: cardId };

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CardService,
				{ provide: getRepositoryToken(Cards), useFactory: mockCardRepository },
				{ provide: UsersService, useFactory: mockUsersService },
				{ provide: FlashcardService, useFactory: mockFlashcardService },
			],
		}).compile();

		service = module.get<CardService>(CardService);
		cardRepository = module.get(getRepositoryToken(Cards));
		usersService = module.get(UsersService);
		flashcardService = module.get(FlashcardService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("create", () => {});

	describe("createBulk", () => {});

	describe("findById", () => {
		it("should find a card by ID if ownership is verified", async () => {
			cardRepository.findOne.mockResolvedValue(mockCard);
			const result = await service.findById(userId, findCardDto);
			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(cardRepository.findOne).toHaveBeenCalledWith({
				where: { id: cardId },
				relations: ["flashcard", "flashcard.owner"],
			});
			expect(result).toEqual(mockCard);
		});

		it("should throw NotFoundException if ownership verification fails (card not found)", async () => {
			cardRepository.findOne.mockResolvedValue(undefined);
			await expect(service.findById(userId, findCardDto)).rejects.toThrow(
				NotFoundException,
			);
			expect(usersService.findById).toHaveBeenCalledWith(userId);
		});

		it("should throw ForbiddenException if ownership verification fails (user does not own card)", async () => {
			cardRepository.findOne.mockResolvedValue({
				...mockCard,
				flashcard: { ...mockFlashcard, owner: { id: "other-user" } },
			});
			await expect(service.findById(userId, findCardDto)).rejects.toThrow(
				ForbiddenException,
			);
			expect(usersService.findById).toHaveBeenCalledWith(userId);
		});
	});

	describe("changeType", () => {
		it("should change the type of a card if ownership is verified", async () => {
			cardRepository.findOne.mockResolvedValue(mockCard);
			cardRepository.save.mockResolvedValue({
				...mockCard,
				type: CardType.MultipleChoice,
			});

			const result = await service.changeType(userId, changeCardTypeDto);
			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(cardRepository.findOne).toHaveBeenCalledWith(
				expect.objectContaining({ where: { id: cardId } }),
			);
			expect(cardRepository.save).toHaveBeenCalledWith({
				...mockCard,
				type: CardType.MultipleChoice,
			});
			expect(result.type).toEqual(CardType.MultipleChoice);
		});

		it("should throw NotFoundException if ownership verification fails during changeType", async () => {
			cardRepository.findOne.mockResolvedValue(undefined);
			await expect(
				service.changeType(userId, changeCardTypeDto),
			).rejects.toThrow(NotFoundException);
			expect(usersService.findById).toHaveBeenCalledWith(userId);
		});

		it("should throw ForbiddenException if ownership verification fails during changeType", async () => {
			cardRepository.findOne.mockResolvedValue({
				...mockCard,
				flashcard: { ...mockFlashcard, owner: { id: "other-user" } },
			});
			await expect(
				service.changeType(userId, changeCardTypeDto),
			).rejects.toThrow(ForbiddenException);
			expect(usersService.findById).toHaveBeenCalledWith(userId);
		});

		// it("should throw BadRequestException if the new type is the same as the current type", async () => {
		// 	cardRepository.findOne.mockResolvedValue(mockCard);
		// 	const sameTypeDto: ChangeCardTypeDto = { cardId, newType: CardType.Flip };
		// 	await expect(service.changeType(userId, sameTypeDto)).rejects.toThrow(
		// 		BadRequestException,
		// 	);
		// 	expect(usersService.findById).toHaveBeenCalledWith(userId);
		// });
	});

	describe("update", () => {
		// it("should update a card if ownership is verified", async () => {
		// 	cardRepository.findOne.mockResolvedValue(mockCard);
		// 	cardRepository.merge.mockReturnValue({
		// 		...mockCard,
		// 		frontend: "New Front",
		// 	});
		// 	cardRepository.save.mockResolvedValue({
		// 		...mockCard,
		// 		frontend: "New Front",
		// 	});

		// 	const result = await service.update(userId, updateCardDto);
		// 	expect(usersService.findById).toHaveBeenCalledWith(userId);
		// 	expect(cardRepository.findOne).toHaveBeenCalledWith(
		// 		expect.objectContaining({ where: { id: cardId } }),
		// 	);
		// 	expect(cardRepository.merge).toHaveBeenCalledWith(
		// 		mockCard,
		// 		updateCardDto,
		// 	);
		// 	expect(cardRepository.save).toHaveBeenCalledWith({
		// 		...mockCard,
		// 		frontend: "New Front",
		// 	});
		// 	expect(result.frontend).toEqual("New Front");
		// });

		it("should throw NotFoundException if ownership verification fails during update", async () => {
			cardRepository.findOne.mockResolvedValue(undefined);
			await expect(service.update(userId, updateCardDto)).rejects.toThrow(
				NotFoundException,
			);
			expect(usersService.findById).toHaveBeenCalledWith(userId);
		});

		it("should throw ForbiddenException if ownership verification fails during update", async () => {
			cardRepository.findOne.mockResolvedValue({
				...mockCard,
				flashcard: { ...mockFlashcard, owner: { id: "other-user" } },
			});
			await expect(service.update(userId, updateCardDto)).rejects.toThrow(
				ForbiddenException,
			);
			expect(usersService.findById).toHaveBeenCalledWith(userId);
		});
	});

	describe("delete", () => {
		it("should delete a card if ownership is verified", async () => {
			usersService.findById.mockResolvedValue(mockUser);
			cardRepository.findOne.mockResolvedValue(mockCard);
			cardRepository.delete.mockResolvedValue({ affected: 1 });

			const result = await service.delete(userId, cardId);
			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(cardRepository.findOne).toHaveBeenCalledWith(
				expect.objectContaining({ where: { id: cardId } }),
			);
			expect(cardRepository.delete).toHaveBeenCalledWith(cardId);
			expect(result).toEqual(mockCard);
		});

		it("should throw NotFoundException if user is not found during delete", async () => {
			usersService.findById.mockRejectedValue(new NotFoundException());
			await expect(service.delete(userId, cardId)).rejects.toThrow(
				NotFoundException,
			);
		});

		it("should throw NotFoundException if ownership verification fails during delete (card not found)", async () => {
			usersService.findById.mockResolvedValue(mockUser);
			cardRepository.findOne.mockResolvedValue(undefined);
			await expect(service.delete(userId, cardId)).rejects.toThrow(
				NotFoundException,
			);
		});

		it("should throw ForbiddenException if ownership verification fails during delete (user does not own card)", async () => {
			usersService.findById.mockResolvedValue(mockUser);
			cardRepository.findOne.mockResolvedValue({
				...mockCard,
				flashcard: { ...mockFlashcard, owner: { id: "other-user" } },
			});
			await expect(service.delete(userId, cardId)).rejects.toThrow(
				ForbiddenException,
			);
		});
	});
});
