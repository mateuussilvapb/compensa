import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  redirectUri: globalThis.location.origin,
  clientId: '667273061879-qlu6o9e4orrq7g213l289vcnrltu6iid.apps.googleusercontent.com',
  scope: 'openid profile email',
  strictDiscoveryDocumentValidation: false,
}
