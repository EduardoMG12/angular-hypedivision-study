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
export class WelcomeResolver implements Resolve<SeoData> {
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
			"Hyper Carregue Seu Aprendizado | HypeDivision Study",
			"Domine qualquer assunto com Hyper, a plataforma de flashcards com design cyberpunk. Aprenda mais rápido e memorize melhor com flashcards interativos e análise de progresso.",
			"flashcards, aprendizado, memorização, estudo, plataforma de estudo, cyberpunk, flashcards interativos, análise de progresso",
			"URL_DA_SUA_IMAGEM_DE_COMPARTILHAMENTO", // Reminder Change in production to your domain URL
			currentUrl,
		);

		return of(defineSeo(seoData, this.titleService, this.metaService, state));
	}
}
