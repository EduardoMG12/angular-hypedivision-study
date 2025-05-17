import { UsersService } from "src/users/users.service";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BcryptAdapter } from "src/common/adapter/bcrypt.adapter";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { CreateTermsOfUseDto } from "src/terms-of-use/dto/create-terms-of-use.dto";
import { TermsOfUse } from "src/entities/terms-of-use.entity";
import { TermsOfUseService } from "src/terms-of-use/terms-of-use.service";

@Injectable()
export class AdminService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		private readonly bcryptAdapter: BcryptAdapter,
		private readonly termsOfUseService: TermsOfUseService,
	) {}

	async createTermsOfUse(dto: CreateTermsOfUseDto): Promise<TermsOfUse> {
		return this.termsOfUseService.create(dto);
	}

	async test() {}
}
