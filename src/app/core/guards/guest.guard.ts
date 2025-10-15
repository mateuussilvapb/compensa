import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../../modules/login/services/login.service';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  constructor(private readonly loginService: LoginService, private readonly router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    // Se já está logado, retorna um UrlTree para redirecionar
    if (this.loginService.isLoggendIn()) {
      return this.router.createUrlTree(['/comparador']);
    }
    // Caso contrário permite o acesso à rota de login
    return true;
  }
}
