import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  get isDesktop() {
    return window.innerWidth > 991;
  }

  get isMobile() {
    return !this.isDesktop;
  }
}
