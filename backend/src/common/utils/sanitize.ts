export namespace SanitizerUtils {
	export function cpfOrCnpj(cpf: string): string {
		return cpf.replace(/\D/g, "");
	}
	export function phoneNumber(phoneNumber: string): string {
		return phoneNumber.replace(/\D/g, "");
	}
}
