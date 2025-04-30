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
export class HomeResolver implements Resolve<SeoData> {
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
			"Potencialize Seu Aprendizado com HypeDivision Study",
			"Descubra uma nova maneira de aprender com flashcards interativos, acompanhe seu progresso e crie seus próprios decks de estudo.",
			"flashcards, aprendizado, estudo, memorização, plataforma de estudo, HypeDivision Study, decks, quizzes",
			"URL_DA_SUA_IMAGEM_DE_COMPARTILHAMENTO_HOME", // Reminder Change in production to your domain URL
			currentUrl,
		);

		return of(defineSeo(seoData, this.titleService, this.metaService, state));
	}
}
