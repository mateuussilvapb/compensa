import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from '../../../config/auth/auth.config';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly oAuthService: OAuthService = inject(OAuthService);
  private readonly router: Router = inject(Router);

  profile = signal<any>(null);

  constructor() {
    this.initConfiguration();
  }

  initConfiguration() {
    this.oAuthService.configure(authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();
    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oAuthService.hasValidIdToken()) {
        this.profile.set(this.oAuthService.getIdentityClaims());
      }
    });
  }

  login() {
    //Fluxo de autenticação do google
    this.oAuthService.initImplicitFlow();
  }

  logout() {
    this.oAuthService.revokeTokenAndLogout();
    this.oAuthService.logOut();
    this.profile.set(null);
    this.router.navigate(['/']);
  }

  getLoggedInProfile() {
    return this.profile();
  }

  isLoggendIn() {
    return this.oAuthService.hasValidIdToken();
  }
}
