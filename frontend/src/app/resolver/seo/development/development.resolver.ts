import { Injectable, Inject } from "@angular/core";
import {
	Resolve,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { Title, Meta } from "@angular/platform-browser";
import { PLATFORM_ID } from "@angular/core";
import { isPlatformServer } from "@angular/common";
import {
	createSeoData,
	defineSeo,
	type SeoData,
} from "../../../common/utils/seo.utils";

@Injectable({
	providedIn: "root",
})
export class DevelopmentResolver implements Resolve<SeoData> {
	constructor(
		private titleService: Title,
		private metaService: Meta,
		@Inject(PLATFORM_ID) private platformId: Object,
	) {}

	resolve(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot,
	): Observable<SeoData> | Promise<SeoData> | SeoData {
		const currentUrl = isPlatformServer(this.platformId)
			? `https://seu-dominio.com.br${state.url}` // Reminder Change in production to your domain URL
			: window.location.href;

		const seoData = createSeoData(
			"Desenvolvimento HypeDivision Study | Bastidores da Criação",
			"Explore o processo de desenvolvimento da plataforma de flashcards HypeDivision Study, desde o design inicial até os planos futuros e aprendizados.",
			"desenvolvimento, angular, frontend, backend, flashcards, estudo, projeto, TCC, HypeDivision Study, stack tecnológico",
			"URL_DA_SUA_IMAGEM_DE_COMPARTILHAMENTO_DEVELOPMENT", // Reminder Change in production to your domain URL
			currentUrl,
		);

		seoData["og:type"] = "article";
		seoData["article:published_time"] = "2024-04-30T02:32:00-03:00"; // Reminder Change in production to your domain URL
		seoData["article:author"] =
			"Charles Eduardo Mello Guimaraes / HYPEDIVISION";
		seoData["article:section"] = "Desenvolvimento Web";
		seoData["article:tag"] = ["angular", "frontend", "desenvolvimento web"];

		return of(defineSeo(seoData, this.titleService, this.metaService, state));
	}
}
