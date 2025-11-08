import { Component, Input } from '@angular/core';
import { ProdutoInfoDTO } from '../../../interfaces/produto-info.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-resultado-produto-mais-vantajoso',
  imports: [
    CommonModule
  ],
  templateUrl: './card-resultado-produto-mais-vantajoso.html',
  styleUrl: './card-resultado-produto-mais-vantajoso.scss'
})
export class CardResultadoProdutoMaisVantajoso {
  @Input({required: true}) indice!: number;
  @Input({required: true}) valorGanho: number | null = null;
  @Input({required: true}) percentualGanho: number | null = null;
  @Input({required: true}) produtosComMesmoCustoPorKg: boolean = false;
  @Input({required: true}) produtoMaisVantajoso: ProdutoInfoDTO | null = null;
}
