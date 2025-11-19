import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-adicionar-categoria',
  imports: [CardModule, FormsModule, ButtonModule, InputTextModule],
  templateUrl: './adicionar-categoria.html',
})
export class AdicionarCategoria {
  @Output() adicionarCategoria: EventEmitter<string> = new EventEmitter();

  categoria: string = '';

  onAdicionarCategoria() {
    if (this.categoria.trim() === '') return;
    this.adicionarCategoria.emit(this.categoria.trim());
    this.categoria = '';
  }

  onKeyPressEnterInput(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onAdicionarCategoria();
    }
  }
}
