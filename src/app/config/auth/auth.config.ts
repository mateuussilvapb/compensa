import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  redirectUri: globalThis.location.origin,
  clientId: '',
  scope: 'openid profile email',
  strictDiscoveryDocumentValidation: false,
}
