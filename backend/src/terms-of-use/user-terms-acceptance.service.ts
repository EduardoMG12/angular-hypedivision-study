import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserTermsAcceptance } from "src/entities/userTermsAcceptance.entity";
import { TermsOfUse } from "src/entities/termsOfUse.entity";
import { AcceptTermsDto } from "./dto/accept-terms.dto";
import { UsersService } from "src/users/users.service";
import { errorMessages } from "src/common/errors/errors-message";

@Injectable()
export class UserTermsAcceptanceService {
	constructor(
		@InjectRepository(UserTermsAcceptance)
		private readonly acceptanceRepository: Repository<UserTermsAcceptance>,
		@InjectRepository(TermsOfUse)
		private readonly termsRepository: Repository<TermsOfUse>,
		private readonly usersService: UsersService,
	) {}

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
