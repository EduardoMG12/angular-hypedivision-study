import * as bcrypt from "bcryptjs";
export class BcryptAdapter {
	bcryptSalt = 10;

	async hash(password: string): Promise<string> {
		return await bcrypt.hash(password, this.bcryptSalt);
	}

	async compare(password: string, hashedPassword: string): Promise<boolean> {
		return await bcrypt.compare(password, hashedPassword);
	}
}
