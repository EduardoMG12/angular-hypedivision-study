import { User } from "src/entities/user.entity";

import { SafeUser } from "src/auth/dto/safeUser.dto";
import { ValidateUniquenessDto } from "../dto/validateUniqueness.dto";
import { RegisterDto } from "src/auth/dto/register.dto";

export interface IUserService {
	createUser(registerDto: RegisterDto): Promise<User>;

	findByEmail(email: string, throwNotFound: true): Promise<User>;
	findByEmail(email: string, throwNotFound: false): Promise<User | null>;
	findByEmail(email: string, throwNotFound?: boolean): Promise<User | null>;

	findById(id: string): Promise<SafeUser>;

	findByPhone(phone: string, throwNotFound: true): Promise<User>;
	findByPhone(phone: string, throwNotFound: false): Promise<User | null>;
	findByPhone(phone: string, throwNotFound?: boolean): Promise<User | null>;

	validateUserUniqueness(validateData: ValidateUniquenessDto): Promise<void>;
}
