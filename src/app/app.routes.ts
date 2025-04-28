import type { Routes } from "@angular/router";

export const routes: Routes = [
	{ path: "", redirectTo: "/welcome", pathMatch: "full" },
  { path: "welcome", loadComponent: () => import("./pages/welcome/welcome.component").then(m => m.WelcomeComponent) },
	{ path: "home", loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
	{ path: "login", loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
	{ path: "register", loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
	{ path: "development", loadComponent: () => import('./pages/development/development.component').then(m => m.DevelopmentComponent) },
	{ path: "decks", loadComponent: () => import('./pages/decks/decks.component').then(m => m.DecksComponent) },
	{ path: "create-flashcard", loadComponent: () => import('./pages/create-flashcard/create-flashcard.component').then(m => m.CreateFlashcardComponent) },
	{ path: "statistics", loadComponent: () => import('./pages/statistics/statistics.component').then(m => m.StatisticsComponent), data: { ssr: false } },
	// { path: 'settings', component: SettingsComponent },
	{ path: "**", loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) },
];
