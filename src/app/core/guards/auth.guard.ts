import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../../modules/login/services/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private readonly loginService: LoginService,
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    try {
      if (this.loginService.isLoggendIn()) {
        return true;
      }

      // guarda a rota original
      localStorage.setItem('returnUrl', state.url);

      // dispara login com Google
      this.loginService.login();

      // retorna false porque a navegação só será concluída após o login
      return false;
    } catch (error: any) {
      throw new Error(
        'Ocorreu um erro na validação de acesso. Detalhes: ' +
          (error?.message ?? error)
      );
    }
  }
}
