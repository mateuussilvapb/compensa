import { Component, effect, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SpeedDialModule } from 'primeng/speeddial';
import { ToastModule } from 'primeng/toast';
import { ProfileDTO } from '../../../modules/login/interfaces/profile.dto';
import { LoginService } from './../../../modules/login/services/login.service';

@Component({
  selector: 'app-top',
  imports: [
    ToastModule,
    ButtonModule,
    SpeedDialModule,
  ],
  templateUrl: './top.html',
  styleUrls: ['./top.scss']
})
export class Top implements OnInit {
  @Input() showSubtitle: boolean = false;

  items!: MenuItem[] | null;
  profile: ProfileDTO | undefined;

  constructor(private readonly loginService: LoginService) {}

  private readonly setProfile = effect(() => {
    const profile = this.loginService.profile();
    this.profile = profile ? (profile as ProfileDTO) : undefined;
  });

  ngOnInit() {
    this.configItemsOptions();
  }

  configItemsOptions() {
    this.items = [
      {
        label: 'Sair',
        icon: 'pi pi-sign-out text-sm',
        command: () => {
          this.loginService.logout();
        },
      }
    ]
  }

  get isLoggedIn() {
    return this.loginService.isLoggendIn();
  }

  logout() {
    this.loginService.logout();
  }
}
