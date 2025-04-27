import type { Routes } from "@angular/router";
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { RegisterComponent } from "./pages/register/register.component";
import { LoginComponent } from "./pages/login/login.component";
import { DevelopmentComponent } from "./pages/development/development.component";
import { WelcomeComponent } from "./pages/welcome/welcome.component";
import { HomeComponent } from "./pages/home/home.component";
import { DecksComponent } from "./pages/decks/decks.component";
import { CreateFlashcardComponent } from "./pages/create-flashcard/create-flashcard.component";
import { CreateFlashcardsWithJsonComponent } from "./components/create-flashcards-with-json/create-flashcards-with-json.component";

export const routes: Routes = [
	// In future i want implement lazyLoading
	// { path: '', loadChildren: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
	// { path: 'register', loadChildren: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
	{ path: '', redirectTo: '/welcome', pathMatch: 'full' },
  {path:"welcome", component: WelcomeComponent},
	{ path: "home", component: HomeComponent },
	{ path: "login", component: LoginComponent },
	{ path: "register", component: RegisterComponent },
	{ path: "development", component: DevelopmentComponent },
  { path: 'decks', component: DecksComponent },
  { path: 'create-flashcard', component: CreateFlashcardComponent },
  { path: 'create-flashcard-with-json', component: CreateFlashcardsWithJsonComponent },
  // { path: 'statistics', component: StatisticsComponent },
  // { path: 'settings', component: SettingsComponent },
	{ path: "**", component: NotFoundComponent },
];
