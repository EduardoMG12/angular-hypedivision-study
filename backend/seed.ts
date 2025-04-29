import { UsersService } from "./src/users/users.service";
import { BcryptAdapter } from "./src/common/adapter/bcrypt.adapter";
import { ConfigService } from "@nestjs/config";

export async function runSeed(
	usersService: UsersService,
	bcryptAdapter: BcryptAdapter,
	configService: ConfigService,
) {
	const adminEmail = configService.get<string>("INITIAL_ADMIN_EMAIL") as string;
	const adminPassword = configService.get<string>(
		"INITIAL_ADMIN_PASSWORD",
	) as string;

	const returnAdminAccountIfExist = await usersService.findByEmail(
		adminEmail,
		false,
	);
	if (!returnAdminAccountIfExist) {
		const hashedPassword = await bcryptAdapter.hash(adminPassword);
		await usersService.createUser({
			fullName: "Administrador Inicial",
			email: adminEmail,
			password: hashedPassword,
			birthdate: new Date(),
			cpfOrCnpj: "12345678900",
			phone: "123456789",
			accept_terms: true,
		});
		console.log("Sucess create Admin!");
	} else {
		console.log("Admin alredy exist.");
	}
}
