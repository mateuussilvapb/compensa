import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  redirectUri: globalThis.location.origin,
  clientId: '728801105467-5f17oifmn7k1icfsjqqqr6dovdbohmoo.apps.googleusercontent.com',
  scope: 'openid profile email',
  strictDiscoveryDocumentValidation: false,
}
