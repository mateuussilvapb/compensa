import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ProdutoComparado } from '../../components/produto-comparado/produto-comparado';
import { ProdutosComparados } from '../../components/produtos-comparados/produtos-comparados';
import { ProdutoInfoDTO } from '../../interfaces/produto-info.dto';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-home-page-comparador',
  imports: [
    CardModule,
    ButtonModule,
    ProdutoComparado,
    ProdutosComparados,
  ],
  templateUrl: './home-page-comparador.html',
})
export class HomePageComparador implements OnInit {
  public formProduto1!: FormGroup;
  public formProduto2!: FormGroup;
  public dataProduto1!: ProdutoInfoDTO;
  public dataProduto2!: ProdutoInfoDTO;
  public produto1MaisVantajoso: boolean = false;
  public produto2MaisVantajoso: boolean = false;
  public showCardProdutosComparados: boolean = false;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.createFormsProdutos();
  }

  createFormsProdutos() {
    this.formProduto1 = this.createFormProduto();
    this.formProduto2 = this.createFormProduto();
  }

  createFormProduto() {
    return this.fb.group({
      nomeProduto: [null],
      precoProduto: [null, [Validators.required, Validators.min(0.01)]],
      pesoProduto: [null, [Validators.required, Validators.min(0.01)]],
    });
  }

  onCompararProdutos() {
    if (this.formProduto1.valid && this.formProduto2.valid) {
      this.dataProduto1 = {
        nomeProduto: this.formProduto1.get('nomeProduto')?.value,
        precoProduto: this.formProduto1.get('precoProduto')?.value,
        pesoProduto: this.formProduto1.get('pesoProduto')?.value,
        isMaisVantajoso: false
      }
      this.dataProduto2 = {
        nomeProduto: this.formProduto2.get('nomeProduto')?.value,
        precoProduto: this.formProduto2.get('precoProduto')?.value,
        pesoProduto: this.formProduto2.get('pesoProduto')?.value,
        isMaisVantajoso: false
      }
      this.showCardProdutosComparados = true;
    }
  }
}
