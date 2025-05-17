import { Expose } from "class-transformer";
import { SafeUser } from "./safe-user.dto";
import { ApiProperty } from "@nestjs/swagger";

export class SafeUserWithPrivilege extends SafeUser {
	@ApiProperty({
		description:
			"User privilege level (e.g., USER, ADMIN, SUPERUSER) / Nível de privilégio do usuário (ex.: USER, ADMIN, SUPERUSER)",
		type: String,
		example: "USER",
		enum: ["USER", "ADMIN", "SUPERUSER"],
	})
	@Expose()
	privilege: string;
}
