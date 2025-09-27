import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Top } from '../components/top/top';
import { Footer } from '../components/footer/footer';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, Top, Footer],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss']
})
export class Layout {}
