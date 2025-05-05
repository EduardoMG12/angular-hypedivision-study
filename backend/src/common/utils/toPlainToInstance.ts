import { plainToInstance } from "class-transformer";

type Cls<T> = {
	new (...args: any[]): T;
};

/**
 * Converts a plain object or an array of plain objects into an instance or an array of instances
 * of the specified class, while excluding extraneous values not defined in the class.
 *
 * @template T - The type of the class to convert the plain object(s) into.
 * @template K - The type of the input data, which can be a single object or an array of objects.
 * @param cls - The class constructor to instantiate the object(s) from.
 * @param service - The plain object or array of plain objects to be converted.
 * @returns An instance of the specified class if `service` is a single object, or an array of instances
 *          of the specified class if `service` is an array.
 */
export function toPlainToInstance<T, K extends any | any[]>(
	cls: Cls<T>,
	service: K,
): K extends any[] ? T[] : T {
	return plainToInstance(cls, service, {
		excludeExtraneousValues: true,
	}) as any;
}
