import { Expose } from "class-transformer";
import { SafeUser } from "./safe-user.dto";
import { ApiProperty } from "@nestjs/swagger";

export class SafeUserWithJwt extends SafeUser {
	@ApiProperty({
		description:
			"JWT access token for authentication / Token de acesso JWT para autenticação",
		type: String,
		example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	})
	@Expose()
	access_token: string;
}
