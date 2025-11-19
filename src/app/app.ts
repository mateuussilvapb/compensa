import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ToastComponent,
    ConfirmDialogModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
