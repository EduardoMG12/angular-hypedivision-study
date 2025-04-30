import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { RegisterDto } from "src/auth/dto/register.dto";
import { SafeUser } from "src/auth/dto/safeUser.dto";
import { ValidateUniquenessDto } from "./dto/validateUniqueness.dto";
import { SanitizerUtils } from "../common/utils/sanitize";
import { errorMessages } from "src/common/errors/errors-message";
import { IUserService } from "./interfaces/IUsersService";

@Injectable()
export class UsersService implements IUserService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	async createUser(registerDto: RegisterDto): Promise<User> {
		const user = this.usersRepository.create(registerDto);

		return this.usersRepository.save(user);
	}

	async findByEmail(email: string, throwNotFound: true): Promise<User>;
	async findByEmail(email: string, throwNotFound: false): Promise<User | null>;
	async findByEmail(email: string): Promise<User>;
	async findByEmail(email: string, throwNotFound = true): Promise<User | null> {
		const user = await this.usersRepository.findOne({ where: { email } });
		if (!user && throwNotFound) {
			throw new NotFoundException(errorMessages.USER_NOT_FOUND["pt-BR"]);
		}
		return user;
	}

	async findById(id: string): Promise<SafeUser> {
		const user = await this.usersRepository.findOne({ where: { id } });
		if (!user) {
			throw new NotFoundException(errorMessages.USER_NOT_FOUND["pt-BR"]);
		}
		return user;
	}

	async findByCpfOrCnpj(cpfOrCnpj: string, throwNotFound: true): Promise<User>;
	async findByCpfOrCnpj(
		cpfOrCnpj: string,
		throwNotFound: false,
	): Promise<User | null>;
	async findByCpfOrCnpj(cpfOrCnpj: string): Promise<User | null>;
	async findByCpfOrCnpj(
		cpfOrCnpj: string,
		throwNotFound = true,
	): Promise<User | null> {
		const sanittizerCpfOrCnpj = SanitizerUtils.phoneNumber(cpfOrCnpj);
		const user = await this.usersRepository.findOne({
			where: { cpfOrCnpj: sanittizerCpfOrCnpj },
		});

		if (!user && throwNotFound) {
			throw new NotFoundException(errorMessages.USER_NOT_FOUND["pt-BR"]);
		}

		return user;
	}

	async findByPhone(phone: string, throwNotFound: true): Promise<User>;
	async findByPhone(phone: string, throwNotFound: false): Promise<User | null>;
	async findByPhone(phone: string): Promise<User | null>;
	async findByPhone(phone: string, throwNotFound = true): Promise<User | null> {
		const sanittizerPhone = SanitizerUtils.phoneNumber(phone);
		const user = await this.usersRepository.findOne({
			where: { phone: sanittizerPhone },
		});

		if (!user && throwNotFound) {
			throw new NotFoundException(errorMessages.USER_NOT_FOUND["pt-BR"]);
		}

		return user;
	}

	async validateUserUniqueness(
		validateData: ValidateUniquenessDto,
	): Promise<void> {
		const [userByEmail, userByCpf, userByPhone] = await Promise.all([
			this.findByEmail(validateData.email, false),
			this.findByCpfOrCnpj(validateData.cpfOrCnpj, false),
			this.findByPhone(validateData.phone, false),
		]);

		if (userByEmail) {
			throw new BadRequestException(
				errorMessages.EMAIL_ALREADY_EXISTS["pt-BR"],
			);
		}
		if (userByCpf) {
			throw new BadRequestException(
				errorMessages.CPF_OR_CNPJ_ALREADY_EXISTS["pt-BR"],
			);
		}
		if (userByPhone) {
			throw new BadRequestException(
				errorMessages.PHONE_NUMBER_ALREADY_EXISTS["pt-BR"],
			);
		}
	}
}
