import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  OPTIONS_CURRENCY_MASK,
  OPTIONS_CURRENCY_MASK_TO_WEIGHT,
} from '../../../../shared/utils/constants';
import { CurrencyMaskModule } from 'ng2-currency-mask';

@Component({
  selector: 'app-produto-comparado',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    CurrencyMaskModule,
  ],
  templateUrl: './produto-comparado.html',
  styleUrls: ['./produto-comparado.scss'],
})
export class ProdutoComparado implements OnInit {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) indiceProduto: number = 0;

  public iconClass: string = 'icon-green';
  public optionsCurrencyMask = OPTIONS_CURRENCY_MASK;
  public optionsCurrencyMaskToWight = OPTIONS_CURRENCY_MASK_TO_WEIGHT;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.definirClasseIcone();
  }

  definirClasseIcone() {
    if (this.indiceProduto == 2) {
      this.iconClass = 'icon-blue';
    }
  }
}
