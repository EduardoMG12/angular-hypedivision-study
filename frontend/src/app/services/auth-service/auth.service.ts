import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import axios from "axios";
import { Router } from "@angular/router";

interface AuthResponse {
	access_token: string;
}

@Injectable({
	providedIn: "root",
})
export class AuthService {
	private apiUrl = "http://localhost:3000"; // Reminder Change in production to your domain URL
	private tokenKey = "authToken";
	private isAuthenticatedSubject = new BehaviorSubject<boolean>(
		this.hasToken(),
	);
	isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

	constructor(
		private http: HttpClient,
		private router: Router,
	) {
		this.loadToken();
		this.updateAxiosAuthorizationHeader();
	}

	private loadToken(): void {
		if (typeof window !== "undefined") {
			const token = localStorage.getItem(this.tokenKey);
			if (token) {
				this.setTokenInternal(token);
			}
		}
	}

	private hasToken(): boolean {
		return (
			typeof window !== "undefined" && !!localStorage.getItem(this.tokenKey)
		);
	}

	private setTokenInternal(token: string): void {
		if (typeof window !== "undefined" && token) {
			localStorage.setItem(this.tokenKey, token);
		}
		axios.defaults.headers.common.Authorization = `Bearer ${token}`;
		this.isAuthenticatedSubject.next(true);
		console.log("Token setado no localStorage:", token);
	}

	getToken(): string | null {
		return typeof window !== "undefined"
			? localStorage.getItem(this.tokenKey)
			: null;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	login(credentials: any): Observable<AuthResponse> {
		return this.http
			.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
			.pipe(
				tap((response) => {
					if (response?.access_token) {
						this.setTokenInternal(response.access_token); // Chamar método interno com o token recebido
					} else {
						console.error(
							"Token não encontrado na resposta do login:",
							response,
						);
						this.isAuthenticatedSubject.next(false);
					}
				}),
			);
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	register(userData: any): Observable<AuthResponse> {
		return this.http
			.post<AuthResponse>(`${this.apiUrl}/auth/register`, userData)
			.pipe(
				tap((response) => {
					if (response?.access_token) {
						this.setTokenInternal(response.access_token);
					} else {
						console.error(
							"Token não encontrado na resposta do registro:",
							response,
						);
						this.isAuthenticatedSubject.next(false);
					}
				}),
			);
	}

	logout(): void {
		if (typeof window !== "undefined") {
			localStorage.removeItem(this.tokenKey);
		}
		axios.defaults.headers.common.Authorization = undefined;
		this.isAuthenticatedSubject.next(false);
		this.router.navigate(["/welcome"]);
	}

	isAuthenticated(): boolean {
		return this.isAuthenticatedSubject.value;
	}

	private updateAxiosAuthorizationHeader(): void {
		const token = this.getToken();
		if (token) {
			axios.defaults.headers.common.Authorization = `Bearer ${token}`;
		} else {
			axios.defaults.headers.common.Authorization = undefined;
		}
	}
}
