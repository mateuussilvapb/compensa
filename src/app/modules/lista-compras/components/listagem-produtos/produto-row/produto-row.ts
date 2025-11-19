import { MessageService, ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { Item, ListaCompraService, Section } from '../../../services/lista-compra.service';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { OPTIONS_TYPE_PRODUCTS } from '../../../../../shared/utils/constants';

@Component({
  selector: 'app-produto-row',
  imports: [FormsModule, CommonModule, CheckboxModule, SelectModule, ReactiveFormsModule, InputTextModule, InputNumberModule, ButtonModule, InputMaskModule],
  templateUrl: './produto-row.html',
})
export class ProdutoRow {
  @Input({ required: true }) produto!: Item;
  @Input({ required: true }) sectionId!: string | undefined;
  @Input({ required: true }) itemsList: Array<Section & { items: Item[] }> = [];

  @Output() produtoEditado = new EventEmitter<Item>();

  private readonly messageService = inject(MessageService);
  private readonly listaCompraService = inject(ListaCompraService);
  private readonly confirmationService = inject(ConfirmationService);

  produtoBackup!: Item;

  public produtoEmEdicao: boolean = false;
  public typeOptions = OPTIONS_TYPE_PRODUCTS;

  public setProdutoEmEdicao(): void {
    this.produtoEmEdicao = true;
    this.produtoBackup = { ...this.produto };
  }

  onCancelarEdicao(): void {
    this.produto = { ...this.produtoBackup };
    this.produtoEmEdicao = false;
  }

  onSalvarEdicao(): void {
    if (!this.validarProduto()) {
      // restaura e sai sem persistir
      this.produto = { ...this.produtoBackup };
      this.produtoEmEdicao = false;
      this.produtoBackup = null!;
      return;
    }

    if (this.produto.type === 'Nenhuma das Opções') {
      this.produto.type = '';
    }

    this.listaCompraService.updateItem(this.sectionId!, this.produto.id!, this.produto).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Produto alterado com sucesso.',
          life: 3000,
        });
        this.produtoEmEdicao = false;
        this.produtoBackup = null!;
        this.produtoEditado.emit(this.produto);
      },
      error: (err) => {
        console.error('[ProdutoRow] erro ao salvar produto', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao salvar o produto. Tente novamente.',
          life: 5000,
        });
        // restaura estado de edição
        this.produto = { ...this.produtoBackup };
        this.produtoEmEdicao = false;
        this.produtoBackup = null!;
      },
    });
  }

  get categoriaOptions(): Array<Section> {
    return this.itemsList.map(({ id, name }) => ({ id, name }));
  }

  private validarProduto(validateName: boolean = false): boolean {
    if (!this.sectionId || this.sectionId === '') {
      this.handleMessageInvalidProduto('A categoria do produto é obrigatória.');
      return this.isProdutoValido();
    }
    if (this.produto.id === '' || !this.produto.id) {
      this.handleMessageInvalidProduto('O ID do produto é obrigatório.');
      return this.isProdutoValido();
    }
    if (validateName && (this.produto.name === '' || !this.produto.name)) {
      this.handleMessageInvalidProduto('O nome do produto é obrigatório.');
      return this.isProdutoValido();
    }
    return true;
  }

  private isProdutoValido(): boolean {
    return !!(this.sectionId && this.produto.id && this.produto.name && this.produto.name !== '');
  }

  private handleMessageInvalidProduto(mensagem: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Atenção!',
      detail: mensagem,
      life: 5000,
    });
  }

  onDeleteProduto(): void {
    if (this.produto.id && this.produto.id !== '') {
      this.confirmationService.confirm({
        message:
          'Tem certeza que deseja excluir este produto?<br>A ação não poderá ser desfeita.',
        header: 'Confirma?',
        icon: 'pi pi-exclamation-triangle',
        rejectButtonStyleClass: 'p-button-secondary',
        acceptButtonStyleClass: 'p-button-danger',
        accept: () => this.deleteProduto(),
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção!',
        detail: 'O ID do produto é inválido!',
        life: 5000,
      });
    }
  }
  deleteProduto(): void {
    if (this.validarProduto(false)) {
      this.listaCompraService.deleteItem(this.sectionId!, this.produto.id!).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: 'Produto removido com sucesso!',
            life: 5000,
          });
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            detail: 'Erro ao remover produto. Tente novamente...',
            life: 5000,
          });
        },
      });
    }
  }

  updateProdutoChecked() {
    if (this.validarProduto(false)) {
      this.listaCompraService.updateItemChecked(this.sectionId!, this.produto.id!, this.produto.checked!)
        .subscribe({
            next: (res) => {},
            error: (err) => {
              console.error(err);
              this.messageService.add({
                severity: 'error',
                summary: 'Erro!',
                detail: 'Erro ao marcar produto. Tente novamente...',
                life: 5000,
              });
            }
          }
        )
    }
  }
}
