import { Validate, ValidationOptions } from "class-validator";
import { IsCpfOrCnpjConstraint } from "../validator/is-cpf-cnpj.validator";

export const IsCpfOrCnpj = (validationOptions?: ValidationOptions) => {
	return <T extends object>(object: T, propertyName: string) => {
		Validate(IsCpfOrCnpjConstraint, validationOptions)(object, propertyName);
	};
};
