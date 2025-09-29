import { LayoutService } from './../../services/layout.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule, CardModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  constructor(private readonly layoutService: LayoutService) {}

  public get isDesktop() {
    return this.layoutService.isDesktop;
  }

  public get isMobile() {
    return this.layoutService.isMobile;
  }
}
