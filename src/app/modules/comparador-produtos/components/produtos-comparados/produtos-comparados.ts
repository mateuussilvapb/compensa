import { Component, Input, OnChanges } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ProdutoInfoDTO } from '../../interfaces/produto-info.dto';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CardApresentacaoProdutoComparado } from './card-apresentacao-produto-comparado/card-apresentacao-produto-comparado';
import { CardResultadoProdutoMaisVantajoso } from './card-resultado-produto-mais-vantajoso/card-resultado-produto-mais-vantajoso';

@Component({
  selector: 'app-produtos-comparados',
  imports: [
    CardModule,
    CardApresentacaoProdutoComparado,
    CurrencyMaskModule,
    CardResultadoProdutoMaisVantajoso,
  ],
  templateUrl: './produtos-comparados.html',
})
export class ProdutosComparados implements OnChanges {
  @Input({ required: true }) infoProduto1!: ProdutoInfoDTO;
  @Input({ required: true }) infoProduto2!: ProdutoInfoDTO;

  public valorGanho: number | null = null;
  public percentualGanho: number | null = null;
  public produtosComMesmoCustoPorKg: boolean = false;
  public produtoMaisVantajoso: ProdutoInfoDTO | null = null;
  public produtoMenosVantajoso: ProdutoInfoDTO | null = null;

  ngOnChanges(): void {
    this.compararProdutos();
  }

  private compararProdutos() {
    const precoPorKgProduto1: number = this.calcularPrecoPorKg(this.infoProduto1);
    const precoPorKgProduto2: number = this.calcularPrecoPorKg(this.infoProduto2);

    this.compararPrecoMaisVantajoso(precoPorKgProduto1, precoPorKgProduto2);
  }

  private calcularPrecoPorKg(produto: ProdutoInfoDTO): number {
    return this.produtoInvalido(produto) ? 0 : produto.precoProduto / produto.pesoProduto;
  }

  private produtoInvalido(produto: ProdutoInfoDTO | null | undefined): boolean {
    return !produto?.precoProduto || !produto?.pesoProduto;
  }

  private compararPrecoMaisVantajoso(preco1: number, preco2: number) {
    if (preco1 === preco2) {
      this.produtosIguaisEmTermosDePreco();
      return;
    }

    const maisVantajoso = preco1 < preco2 ? this.infoProduto1 : this.infoProduto2;
    const menosVantajoso = preco1 < preco2 ? this.infoProduto2 : this.infoProduto1;

    this.definirProdutoMaisVantajoso(maisVantajoso, menosVantajoso);
  }

  private definirProdutoMaisVantajoso(
    maisVantajoso: ProdutoInfoDTO,
    menosVantajoso: ProdutoInfoDTO,
  ) {
    maisVantajoso.isMaisVantajoso = true;
    menosVantajoso.isMaisVantajoso = false;

    this.produtoMaisVantajoso = maisVantajoso;
    this.produtoMenosVantajoso = menosVantajoso;
    this.produtosComMesmoCustoPorKg = false;

    this.definirEconomia();
  }

  private produtosIguaisEmTermosDePreco() {
    this.infoProduto1.isMaisVantajoso = false;
    this.infoProduto2.isMaisVantajoso = false;
    this.produtosComMesmoCustoPorKg = true;

    this.produtoMaisVantajoso = null;
    this.produtoMenosVantajoso = null;

    this.valorGanho = null;
    this.percentualGanho = null;
  }

  private definirEconomia() {
    if (this.produtoMaisVantajoso && this.produtoMenosVantajoso) {
      const precoMaisVantajoso = this.calcularPrecoPorKg(this.produtoMaisVantajoso);
      const precoMenosVantajoso = this.calcularPrecoPorKg(this.produtoMenosVantajoso);

      this.valorGanho = +(precoMenosVantajoso - precoMaisVantajoso).toFixed(2);

      this.percentualGanho = ((precoMenosVantajoso - precoMaisVantajoso) / precoMenosVantajoso) * 100;
    }
  }
}
