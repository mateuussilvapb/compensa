import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Top } from '../../../../core/components/top/top';
import { LoginService } from './../../services/login.service';

@Component({
  selector: 'app-home-login-component',
  imports: [CardModule, Top, ButtonModule],
  templateUrl: './home-login-component.html',
})
export class HomeLoginComponent {

  constructor(
    private readonly loginService: LoginService
  ) {}

  login() {
    this.loginService.login();
  }
}
