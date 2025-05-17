import { SafeUser } from "../../auth/dto/safe-user.dto";

export interface IUsersController {
	getProfile(userId: string): Promise<SafeUser>;
}
