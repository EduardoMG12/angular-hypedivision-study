// biome-ignore lint/style/useImportType: <explanation>
import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideAnimations } from "@angular/platform-browser/animations";

import { routes } from "./app.routes";
import {
	provideClientHydration,
	withEventReplay,
} from "@angular/platform-browser";
import { provideCharts, withDefaultRegisterables } from "ng2-charts";
import { AuthService } from "./services/auth-service/auth.service";
import { AuthGuard } from "./guards/auth.guard";
import {
	HTTP_INTERCEPTORS,
	provideHttpClient,
	withFetch,
	withInterceptors,
} from "@angular/common/http";
import { AuthInterceptor } from "./interceptors/add-authorization-header/add-authorization-header.interceptor";
import { provideDnd } from "@ng-dnd/core";
import { HTML5Backend } from "react-dnd-html5-backend";

export const appConfig: ApplicationConfig = {
	providers: [
		provideCharts(withDefaultRegisterables()),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideClientHydration(withEventReplay()),
		provideAnimations(),
		provideRouter(routes),
		AuthService,
		AuthGuard,
		provideHttpClient(withFetch(), withInterceptors([AuthInterceptor])),
		provideDnd({backend:HTML5Backend}),
	],
};
