import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { CreateFlashcardDto } from "./dto/create.dto";
import { UsersService } from "src/users/users.service";
import { Flashcard } from "src/entities/flashcards.entity";
import { Repository } from "typeorm";
import { FlashcardDto } from "./dto/flashcard.dto";
import { FlashcardStatus } from "./common/enums/flashcardStatus.enum";
import { PackageService } from "src/package/package.service";
import { PackageDto } from "src/package/dto/package.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { errorMessages } from "src/common/errors/errors-message";
import { ChangeFlashcardStatusDto } from "./dto/changeStatus.dto";
import { UpdateFlashcardDto } from "./dto/update.dto";
import { FlashcardWithCardsDto } from "./dto/flashcardWithCards.dto";
import { UpdateFlashcardReferencePackageDto } from "./dto/updateFlashcardReferencePackage.dto";
import { Package } from "src/entities/package.entity";
import { FlashcardWithPackageDto } from "./dto/flashcardWithPackage.dto";

@Injectable()
export class FlashcardService {
	constructor(
		@InjectRepository(Flashcard)
		private flashcardRepository: Repository<Flashcard>,
		private readonly usersService: UsersService,
		private readonly packageService: PackageService,
	) {}

	async create(
		userId: string,
		flashcardData: CreateFlashcardDto,
	): Promise<FlashcardDto> {
		const owner = await this.usersService.findById(userId);

		let packageEntity: PackageDto | null = null;
		if (flashcardData.package) {
			packageEntity = await this.packageService.findById(
				userId,
				flashcardData.package,
			);
		}

		const flashcardEntity = this.flashcardRepository.create({
			title: flashcardData.title,
			description: flashcardData.description || "",
			package: packageEntity,
			owner,
			status: FlashcardStatus.Active,
			createdAt: new Date(),
		}) as Flashcard;

		return await this.flashcardRepository.save(flashcardEntity);
	}
	async findAll(userId: string): Promise<FlashcardDto[]> {
		const user = await this.usersService.findById(userId);

		const flashcard = await this.flashcardRepository.find({
			where: { owner: { id: user.id } },
		});

		if (!flashcard) {
			throw new NotFoundException(errorMessages.FLASHCARD_NOT_FOUND["pt-BR"]);
		}

		return flashcard;
	}

	async findById(userId: string, flashcardId: string): Promise<Flashcard> {
		const user = await this.usersService.findById(userId);

		const flashcard = await this.flashcardRepository.findOne({
			where: { id: flashcardId, owner: { id: userId } },
			// relations: ["cards", "owner"],
		});

		if (!flashcard) {
			throw new NotFoundException(errorMessages.FLASHCARD_NOT_FOUND["pt-BR"]);
		}

		return flashcard;
	}

	async findByIdWithCards(
		userId: string,
		flashcardId: string,
	): Promise<FlashcardWithCardsDto> {
		const user = await this.usersService.findById(userId);

		const flashcard = await this.flashcardRepository.findOne({
			where: { id: flashcardId, owner: { id: userId } },
			relations: ["cards"],
		});

		if (!flashcard) {
			throw new NotFoundException(errorMessages.FLASHCARD_NOT_FOUND["pt-BR"]);
		}

		return {
			...flashcard,
			flashcards: flashcard.cards || [],
		} as FlashcardWithCardsDto;
	}

	async changeStatus(
		userId: string,
		flashcardData: ChangeFlashcardStatusDto,
	): Promise<FlashcardDto> {
		const user = await this.usersService.findById(userId);

		const flashcard = await this.findById(user.id, flashcardData.id);

		if (!flashcard) {
			throw new NotFoundException(errorMessages.FLASHCARD_NOT_FOUND["pt-BR"]);
		}

		const currentStatus = flashcard.status;
		const targetStatus = flashcardData.status;

		if (currentStatus === targetStatus) {
			throw new BadRequestException("Cannot change status for egual status");
		}

		flashcard.status = targetStatus as FlashcardStatus;

		return await this.flashcardRepository.save(flashcard);
	}

	async update(
		userId: string,
		flashcardData: UpdateFlashcardDto,
	): Promise<FlashcardDto> {
		const user = await this.usersService.findById(userId);

		const flashcardEntity = await this.findById(userId, flashcardData.id);

		flashcardEntity.title = flashcardData.title || flashcardEntity.title;
		flashcardEntity.description =
			flashcardData.description || flashcardEntity.description;
		flashcardEntity.updatedAt = new Date();

		return await this.flashcardRepository.save(flashcardEntity);
	}

	async updateReferencePackage(
		userId: string,
		updateReferenceData: UpdateFlashcardReferencePackageDto,
	): Promise<FlashcardWithPackageDto> {
		const flashcard = await this.findById(
			userId,
			updateReferenceData.flashcardId,
		);

		if (!updateReferenceData.packageId) {
			flashcard.package = null;
			return await this.flashcardRepository.save(flashcard);
		}

		const packageEntity = (await this.packageService.findById(
			userId,
			updateReferenceData.packageId,
		)) as Package;
		if (packageEntity.id === flashcard.package?.id) {
			throw new BadRequestException("this package is egual the old package");
		}
		flashcard.package = packageEntity;
		return await this.flashcardRepository.save(flashcard);
	}

	async delete(userId: string, id: string): Promise<FlashcardDto> {
		const user = await this.usersService.findById(userId);

		const flashcardEntity = await this.findById(userId, id);

		await this.flashcardRepository.delete(id);

		return flashcardEntity;
	}
}
