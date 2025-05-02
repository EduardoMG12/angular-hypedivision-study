import { RegisterDto } from "../auth/dto/register.dto";
import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { AccessToken } from "./dto/accessToken.dto";
import { BcryptAdapter } from "../common/adapter/bcrypt.adapter";
import { SanitizerUtils } from "src/common/utils/sanitize";
import { SafeUserWithJwt } from "./dto/safeUserWithJwt";
import { AcceptTermsDto } from "./dto/user-terms-acceptance.dto";
import { UserTermsAcceptance } from "src/entities/userTermsAcceptance.entity";
import { TermsOfUseService } from "src/terms-of-use/terms-of-use.service";
import { errorMessages } from "src/common/errors/errors-message";
import { ErrorCode } from "src/common/errors/error-codes.enum";

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		private readonly bcryptAdapter: BcryptAdapter,
		private readonly termsOfUseService: TermsOfUseService,
	) {}

	async register(registerDto: RegisterDto): Promise<SafeUserWithJwt> {
		const user = await this.usersService.findByEmail(registerDto.email, false);

		const validateData = {
			email: registerDto.email,
			phone: registerDto.phone,
		};

		await this.usersService.validateUserUniqueness(validateData);

		if (registerDto.accept_terms !== true) {
			throw new BadRequestException(
				errorMessages[ErrorCode.MISSING_ACCEPT_TERMS]["pt-BR"],
			);
		}

		const terms = await this.termsOfUseService.findActive();

		const hashedPassword = await this.bcryptAdapter.hash(registerDto.password);

		const newUser: RegisterDto = {
			...registerDto,
		};

		newUser.password = hashedPassword;
		newUser.phone = SanitizerUtils.phoneNumber(registerDto.phone);

		const createUser = await this.usersService.createUser(newUser);

		this.acceptTerms({ termsOfUseId: terms.id }, createUser.id);

		const { password, ...publicUser } = createUser;

		const payload = {
			id: createUser.id,
			email: createUser.email,
		};
		const access_token = this.jwtService.sign(payload);

		return { ...publicUser, access_token };
	}

	async login(loginDto: LoginDto): Promise<AccessToken> {
		try {
			const user = await this.usersService.findByEmail(loginDto.email);

			if (!user) {
				throw new BadRequestException(
					errorMessages[ErrorCode.INVALID_CREDENTIALS]["pt-BR"],
				);
			}

			const isPasswordValid = await this.bcryptAdapter.compare(
				loginDto.password,
				user.password,
			);
			if (!isPasswordValid) {
				throw new BadRequestException(
					errorMessages[ErrorCode.INVALID_CREDENTIALS]["pt-BR"],
				);
			}

			const payload = {
				id: user.id,
				email: user.email,
			};
			const access_token = this.jwtService.sign(payload);

			return { access_token };
		} catch (err) {
			throw new UnauthorizedException(
				errorMessages[ErrorCode.LOGIN_FAILED]["pt-BR"],
			);
		}
	}

	async validateToken(token: string): Promise<boolean> {
		try {
			await this.jwtService.verifyAsync(token);
			return true;
		} catch (error) {
			return false;
		}
	}

	async acceptTerms(
		dto: AcceptTermsDto,
		userId: string,
	): Promise<UserTermsAcceptance> {
		const terms = await this.termsOfUseService.findById(dto.termsOfUseId);

		const acceptanceTerm = await this.termsOfUseService.acceptTerms({
			termsOfUseId: terms.id,
			userId,
		});

		return acceptanceTerm;
	}
}
