import { ApplicationConfig, APP_INITIALIZER, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { routes } from './app.routes';
import { PRIMENG_PROVIDER } from './config/providers/primeng.provider';
import { initializeAppConfig } from './config/app-init.factory';

registerLocaleData(localePt, 'pt-BR');

export const appConfig: ApplicationConfig = {
  providers: [
    // Garante que o config.json seja carregado antes de tudo
    { provide: APP_INITIALIZER, useFactory: initializeAppConfig, multi: true },

    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    PRIMENG_PROVIDER,
    provideOAuthClient(),
    provideFirebaseApp(() =>
      initializeApp((globalThis as any).runtimeConfig?.firebaseConfig)
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};
