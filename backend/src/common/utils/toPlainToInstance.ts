import { plainToInstance } from "class-transformer";

type Cls<T> = {
	new (...args: any[]): T;
};

export function toPlainToInstance<T, K extends any | any[]>(
	cls: Cls<T>,
	service: K,
): K extends any[] ? T[] : T {
	return plainToInstance(cls, service, {
		excludeExtraneousValues: true,
	}) as any;
}
