import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth-service/auth.service";
import { LoadingService } from "../services/loading/loading.service";

@Injectable({
	providedIn: "root",
})
export class AuthGuard implements CanActivate {
	constructor(
		private authService: AuthService,
		private router: Router,
		private loadingService: LoadingService,
	) {}

	canActivate():
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree>
		| boolean
		| UrlTree {
		this.loadingService.setLoading(true);
		if (this.authService.isAuthenticated()) {
			this.loadingService.setLoading(false);
			return true;
		}
		return this.router.parseUrl("/login");
	}
}
