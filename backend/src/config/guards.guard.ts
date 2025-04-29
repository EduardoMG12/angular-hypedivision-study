import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "src/common/decorators/public.decorator";

interface JwtPayload {
	id: string;
	email: string;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") implements CanActivate {
	constructor(private reflector: Reflector) {
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.get<boolean>(
			IS_PUBLIC_KEY,
			context.getHandler(),
		);
		if (isPublic) {
			return true;
		}

		const canActivate = await super.canActivate(context);
		if (!canActivate) {
			throw new UnauthorizedException("Invalid or missing token");
		}

		const request = context.switchToHttp().getRequest();
		const user = request.user as JwtPayload;

		if (!user) {
			throw new UnauthorizedException("User not found in request");
		}

		return true;
	}
}
