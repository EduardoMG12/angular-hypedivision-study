import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
	ValidationArguments,
} from "class-validator";
import { UsersService } from "../../users/users.service";
import { Injectable } from "@nestjs/common";
import { SanitizerUtils } from "../utils/sanitize";

@ValidatorConstraint({ name: "isCpfOrCnpj", async: true })
@Injectable()
export class IsCpfOrCnpjConstraint implements ValidatorConstraintInterface {
	constructor(private readonly usersService: UsersService) {}

	async validate(value: string, args: ValidationArguments): Promise<boolean> {
		if (!value) return false;

		const sanitizedValue = SanitizerUtils.cpfOrCnpj(value);

		if (sanitizedValue.length === 11) {
			if (/^(\d)\1+$/.test(sanitizedValue)) return false;

			let sum = 0;
			for (let i = 0; i < 9; i++) {
				sum += Number.parseInt(sanitizedValue.charAt(i)) * (10 - i);
			}
			let remainder = 11 - (sum % 11);
			const firstDigit = remainder >= 10 ? 0 : remainder;
			if (firstDigit !== Number.parseInt(sanitizedValue.charAt(9)))
				return false;

			sum = 0;
			for (let i = 0; i < 10; i++) {
				sum += Number.parseInt(sanitizedValue.charAt(i)) * (11 - i);
			}
			remainder = 11 - (sum % 11);
			const secondDigit = remainder >= 10 ? 0 : remainder;
			if (secondDigit !== Number.parseInt(sanitizedValue.charAt(10)))
				return false;

			return true;
		}

		if (sanitizedValue.length === 14) {
			if (/^(\d)\1+$/.test(sanitizedValue)) return false;

			const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
			let sum = 0;
			for (let i = 0; i < 12; i++) {
				sum += Number.parseInt(sanitizedValue.charAt(i)) * weights1[i];
			}
			let remainder = sum % 11;
			const firstDigit = remainder < 2 ? 0 : 11 - remainder;
			if (firstDigit !== Number.parseInt(sanitizedValue.charAt(12)))
				return false;

			const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
			sum = 0;
			for (let i = 0; i < 13; i++) {
				sum += Number.parseInt(sanitizedValue.charAt(i)) * weights2[i];
			}
			remainder = sum % 11;
			const secondDigit = remainder < 2 ? 0 : 11 - remainder;
			if (secondDigit !== Number.parseInt(sanitizedValue.charAt(13)))
				return false;

			return true;
		}

		return false;
	}

	defaultMessage(args: ValidationArguments) {
		const value = args.value;
		if (!value) {
			return "CPF or CNPJ is required";
		}
		const sanitizedValue = SanitizerUtils.cpfOrCnpj(value);
		if (sanitizedValue.length !== 11 && sanitizedValue.length !== 14) {
			return "CPF or CNPJ is invalid (has 11 or 14 digits)";
		}
		if (/^(\d)\1+$/.test(sanitizedValue)) {
			return "CPF or CNPJ invalid (number repeats)";
		}
		return "CPF or CNPJ invalid";
	}
}
