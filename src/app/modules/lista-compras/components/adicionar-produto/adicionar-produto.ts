import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { Item, Section } from '../../services/lista-compra.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OPTIONS_TYPE_PRODUCTS } from '../../../../shared/utils/constants';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'app-adicionar-produto',
  imports: [CommonModule, CardModule, SelectModule, FormsModule, ReactiveFormsModule, InputTextModule, InputNumberModule, ButtonModule, InputMaskModule],
  templateUrl: './adicionar-produto.html',
})
export class AdicionarProduto implements OnInit{
  @Input({ required: true }) itemsList: Array<Section & { items: Item[] }> = [];
  @Output() adicionarProduto: EventEmitter<{sectionId: string, item: Item}> = new EventEmitter();

  public form!: FormGroup;

  constructor(private readonly fb: FormBuilder) {}

  public typeOptions = OPTIONS_TYPE_PRODUCTS;

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      category: ['', Validators.required],
      name: ['', Validators.required],
      weight: [null],
      price: [null],
      quantity: [null],
      type: [null],
    });
  }

  get categoriaOptions(): Array<Section> {
    return this.itemsList.map(({ id, name }) => ({ id, name }));
  }

  get hasAnyCategory(): boolean {
    return this.itemsList.length > 0;
  }

  onAdicionarProduto() {
    if (this.form.valid) {
      if (this.form.value.type === 'Nenhuma das Opções') {
        this.form.get('type')?.setValue('');
      }
      const obj = {
        sectionId: this.form.value.category?.id || null,
        item: {
          name: this.form.value.name,
          weight: this.form.value.weight ? Number(this.form.value.weight) : '',
          price: this.form.value.price ? Number(this.form.value.price) : '',
          quantity: this.form.value.quantity ? Number(this.form.value.quantity) : '',
          type: this.form.value.type ? String(this.form.value.type) : '',
        }
      }
      this.adicionarProduto.emit(obj);
      this.resetCamposForm();
    }
  }

  private resetCamposForm(): void {
    this.form.get('name')?.reset();
    this.form.get('weight')?.reset();
    this.form.get('price')?.reset();
    this.form.get('quantity')?.reset();
    this.form.get('type')?.reset();
  }
}
