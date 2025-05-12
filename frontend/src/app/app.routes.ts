import type { Routes } from "@angular/router";
import { WelcomeResolver } from "./resolver/seo/welcome/welcome.resolver";
import { DeckResolver } from "./resolver/seo/deck/deck.resolver";
import { HomeResolver } from "./resolver/seo/home/home.resolver";
import { LoginResolver } from "./resolver/seo/login/login.resolver";
import { RegisterResolver } from "./resolver/seo/register/register.resolver";
import { DevelopmentResolver } from "./resolver/seo/development/development.resolver";
import { CreateFlashcardResolver } from "./resolver/seo/create-flashcard/create-flashcard.resolver";
import { StatisticsResolver } from "./resolver/seo/statistics/statistics.resolver";
import { NotFoundResolver } from "./resolver/seo/not-found/not-found.resolver";
import { AuthGuard } from "./guards/auth.guard";
import { MyCardsDataResolver } from "./resolver/requests/my-cards-data/my-card-data.service";
import { MyCardsSeoResolver } from "./resolver/seo/my-cards/my-cards.resolver";

export const routes: Routes = [
	{ path: "", redirectTo: "/welcome", pathMatch: "full" },
	{
		path: "welcome",
		loadComponent: () =>
			import("./pages/welcome/welcome.component").then(
				(m) => m.WelcomeComponent,
			),
		resolve: {
			seo: WelcomeResolver,
		},
	},
	{
		path: "login",
		loadComponent: () =>
			import("./pages/login/login.component").then((m) => m.LoginComponent),
		resolve: {
			seo: LoginResolver,
		},
	},
	{
		path: "register",
		loadComponent: () =>
			import("./pages/register/register.component").then(
				(m) => m.RegisterComponent,
			),
		resolve: {
			seo: RegisterResolver,
		},
	},
	{
		path: "development",
		loadComponent: () =>
			import("./pages/development/development.component").then(
				(m) => m.DevelopmentComponent,
			),
		resolve: {
			seo: DevelopmentResolver,
		},
	},
	{
		path: "home",
		loadComponent: () =>
			import("./pages/home/home.component").then((m) => m.HomeComponent),
		resolve: {
			seo: HomeResolver,
		},
		canActivate: [AuthGuard],
	},
	{
		path: "my-cards",
		loadComponent: () =>
			import("./pages/my-cards/my-cards.component").then(
				(m) => m.MyCardsComponent,
			),
		resolve: {
			seo: MyCardsSeoResolver,
			topics: MyCardsDataResolver, // don't forget add SEO, after finally page
		},
		canActivate: [AuthGuard],
	},
	{
		path: "decks",
		loadComponent: () =>
			import("./pages/decks/decks.component").then((m) => m.DecksComponent),
		// data: { ssr: false },
		resolve: {
			seo: DeckResolver,
		},
		canActivate: [AuthGuard],
	},
	{
		path: "create-flashcard",
		loadComponent: () =>
			import("./pages/create-flashcard/create-flashcard.component").then(
				(m) => m.CreateFlashcardComponent,
			),
		resolve: {
			seo: CreateFlashcardResolver,
		},
		canActivate: [AuthGuard],
	},
	{
		path: "statistics",
		loadComponent: () =>
			import("./pages/statistics/statistics.component").then(
				(m) => m.StatisticsComponent,
			),
		data: { ssr: false },
		resolve: {
			seo: StatisticsResolver,
		},
		canActivate: [AuthGuard],
	},
	// { path: 'settings', component: SettingsComponent },
	{
		path: "**",
		loadComponent: () =>
			import("./pages/not-found/not-found.component").then(
				(m) => m.NotFoundComponent,
			),
		resolve: {
			seo: NotFoundResolver,
		},
	},
];
