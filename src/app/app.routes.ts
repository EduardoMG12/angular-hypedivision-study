import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
     // In future i want implement lazyLoading
    // { path: '', loadChildren: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
    // { path: 'register', loadChildren: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
    { path: '', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '**', component: NotFoundComponent }
];
