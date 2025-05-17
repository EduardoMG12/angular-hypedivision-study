import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TermsOfUse } from "src/entities/terms-of-use.entity";
import { CreateTermsOfUseDto } from "./dto/create-terms-of-use.dto";
import { errorMessages } from "src/common/errors/errors-message";
import { AcceptTermsDto } from "./dto/accept-terms.dto";
import { UserTermsAcceptance } from "src/entities/user-terms-acceptance.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class TermsOfUseService {
	constructor(
		@InjectRepository(TermsOfUse)
		private readonly termsRepository: Repository<TermsOfUse>,
		@InjectRepository(UserTermsAcceptance)
		private readonly acceptanceRepository: Repository<UserTermsAcceptance>,
		private readonly usersService: UsersService,
	) {}

	async create(dto: CreateTermsOfUseDto): Promise<TermsOfUse> {
		const existingVersion = await this.termsRepository.findOne({
			where: {
				version: dto.version,
			},
		});
		if (existingVersion) {
			throw new BadRequestException(
				errorMessages.VERSION_ALREDY_EXIST["pt-BR"],
			);
		}

		const terms = this.termsRepository.create({
			version: dto.version,
			content: dto.content,
			isActive: dto.isActive ?? false,
		});

		return this.termsRepository.save(terms);
	}

	async findActive(): Promise<TermsOfUse> {
		const terms = await this.termsRepository.findOne({
			where: { isActive: true },
		});
		if (!terms) {
			throw new NotFoundException(errorMessages.NO_ACTIVE_TERMS_FOUND["pt-BR"]);
		}
		return terms;
	}

	async findById(id: string): Promise<TermsOfUse> {
		const terms = await this.termsRepository.findOne({ where: { id } });
		if (!terms) {
			throw new NotFoundException(errorMessages.NO_ACTIVE_TERMS_FOUND["pt-BR"]);
		}
		return terms;
	}

	async acceptTerms(dto: AcceptTermsDto): Promise<UserTermsAcceptance> {
		const user = await this.usersService.findById(dto.userId);

		const terms = await this.termsRepository.findOne({
			where: { id: dto.termsOfUseId },
		});
		if (!terms) {
			throw new NotFoundException(errorMessages.TERMS_NOT_FOUND);
		}

		const acceptance = this.acceptanceRepository.create({
			user,
			termsOfUse: terms,
			termsVersion: terms.version,
		});

		return this.acceptanceRepository.save(acceptance);
	}

	async acceptLastTerms(userId: string): Promise<UserTermsAcceptance> {
		const user = await this.usersService.findById(userId);

		const terms = await this.termsRepository.findOne({
			where: { isActive: true },
		});
		if (!terms) {
			throw new NotFoundException(errorMessages.NO_ACTIVE_TERMS_FOUND["pt-BR"]);
		}

		const acceptance = this.acceptanceRepository.create({
			user,
			termsOfUse: terms,
			termsVersion: terms.version,
		});

		return this.acceptanceRepository.save(acceptance);
	}
}
