import { Routes } from '@angular/router';
import { CORE_ROUTES } from './core/core.routes';
import { AuthGuard } from './core/guards/auth.guard';
import { GuestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [GuestGuard],
    loadComponent: () => import('./modules/login/pages/home-login-component/home-login-component').then((c) => c.HomeLoginComponent),
    pathMatch: 'full',
  },
  {
    path: 'comparador',
    canActivate: [AuthGuard],
    loadComponent: () => import('./core/layout/layout').then((c) => c.Layout),
    children: CORE_ROUTES,
  },
  {
    path: 'lista-compras',
    canActivate: [AuthGuard],
    loadComponent: () => import('./core/layout/layout').then((c) => c.Layout),
    children: CORE_ROUTES,
  },
  {
    path: '**',
    redirectTo: '', // manda para o login (raiz)
  },
];
