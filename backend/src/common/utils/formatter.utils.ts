export namespace FormatterUtils {
	export function cpfECnpj(value: string): string {
		const cleanedValue = value.replace(/\D/g, "");

		if (cleanedValue.length === 11) {
			return `${cleanedValue.substring(0, 3)}.${cleanedValue.substring(3, 6)}.${cleanedValue.substring(6, 9)}-${cleanedValue.substring(9, 11)}`;
		}
		if (cleanedValue.length === 14) {
			return `${cleanedValue.substring(0, 2)}.${cleanedValue.substring(2, 5)}.${cleanedValue.substring(5, 8)}/${cleanedValue.substring(8, 12)}-${cleanedValue.substring(12, 14)}`;
		}

		return "CPF ou CNPJ inválido";
	}

	/**
	 * Formats a given phone number string into a standardized format.
	 *
	 * The function removes all non-digit characters from the input and validates
	 * the length of the cleaned phone number. It supports formatting for both
	 * 8-digit and 9-digit phone numbers, including an area code.
	 *
	 * @param phoneNumber - The phone number string to be formatted.
	 * @returns A formatted phone number string in the format `(XX)XXXX-XXXX` or
	 * `(XX)XXXXX-XXXX`, where `XX` is the area code. If the input is invalid,
	 * returns "Número de telefone inválido".
	 */
	export function phoneNumber(phoneNumber: string): string {
		const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");

		if (cleanedPhoneNumber.length < 10 || cleanedPhoneNumber.length > 11) {
			return "Número de telefone inválido";
		}

		const areaCode = cleanedPhoneNumber.substring(0, 2);
		const numberPart = cleanedPhoneNumber.substring(2);

		if (numberPart.length === 8) {
			return `(${areaCode})${numberPart.substring(0, 4)}-${numberPart.substring(4)}`;
		}

		if (numberPart.length === 9) {
			return `(${areaCode})${numberPart.substring(0, 5)}-${numberPart.substring(5)}`;
		}

		return "Número de telefone inválido";
	}
}
