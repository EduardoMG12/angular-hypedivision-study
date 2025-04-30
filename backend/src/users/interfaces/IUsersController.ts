import { SafeUser } from "../../auth/dto/safeUser.dto";

export interface IUsersController {
	getProfile(userId: string): Promise<SafeUser>;
}
