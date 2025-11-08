import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from '../../../config/auth/auth.config';

import { Auth, signInWithCredential, GoogleAuthProvider } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly oAuthService = inject(OAuthService);
  private readonly router = inject(Router);
  private readonly firebaseAuth = inject(Auth);

  profile = signal<any>(null);

  constructor() {
    this.initConfiguration();
  }

  initConfiguration() {
    this.oAuthService.configure(authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();
    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(async () => {
      if (this.oAuthService.hasValidIdToken()) {
        this.profile.set(this.oAuthService.getIdentityClaims());

        // Integrando token do Google (OIDC) no Firebase Auth
        const idToken = this.oAuthService.getIdToken();
        if (idToken) {
          const credential = GoogleAuthProvider.credential(idToken);
          await signInWithCredential(this.firebaseAuth, credential);
        }
      }
    });
  }

  login() {
    this.oAuthService.initImplicitFlow();
  }

  async logout() {
    await this.firebaseAuth.signOut();
    this.oAuthService.revokeTokenAndLogout();
    this.oAuthService.logOut();
    this.profile.set(null);
    localStorage.clear();
    this.router.navigate(['/']);
  }

  getLoggedInProfile() {
    return this.profile();
  }

  isLoggendIn() {
    return this.oAuthService.hasValidIdToken();
  }
}
