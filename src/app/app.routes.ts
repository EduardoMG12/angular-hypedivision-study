import type { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { DevelopmentComponent } from './pages/development/development.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
     // In future i want implement lazyLoading
    // { path: '', loadChildren: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
    // { path: 'register', loadChildren: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
    { path: '', component: WelcomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'development', component: DevelopmentComponent },
    { path: '**', component: NotFoundComponent }
];
