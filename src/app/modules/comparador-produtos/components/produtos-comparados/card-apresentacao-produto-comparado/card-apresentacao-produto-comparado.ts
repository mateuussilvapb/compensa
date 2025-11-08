import { Component, Input } from '@angular/core';
import { ProdutoInfoDTO } from '../../../interfaces/produto-info.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-apresentacao-produto-comparado',
  imports: [CommonModule],
  templateUrl: './card-apresentacao-produto-comparado.html',
  styleUrl: './card-apresentacao-produto-comparado.scss',
})
export class CardApresentacaoProdutoComparado {
  @Input({required: true}) indice!: number;
  @Input({required: true}) dadosProduto!: ProdutoInfoDTO;
  @Input({required: true}) produtosComMesmoCustoPorKg!: boolean;

  getPrecoPorKg() {
    if (
      this.dadosProduto.precoProduto &&
      this.dadosProduto.pesoProduto &&
      this.dadosProduto.pesoProduto > 0
    ) {
      return (
        Number(this.dadosProduto.precoProduto) / Number(this.dadosProduto.pesoProduto)
      ).toFixed(2);
    }
    return 0;
  }
}
