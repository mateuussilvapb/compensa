import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { Item, ListaCompraService, Section } from '../../services/lista-compra.service';
import { ProdutoRow } from './produto-row/produto-row';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-listagem-produtos',
  imports: [
    CardModule,
    FormsModule,
    CommonModule,
    InputTextModule,
    ProdutoRow,
    CheckboxModule
  ],
  templateUrl: './listagem-produtos.html',
})
export class ListagemProdutos implements OnChanges{
  @Input({ required: true }) itemsList: Array<Section & { items: Item[] }> = [];

  categoriaEmEdicao: string | null = null;
  private readonly messageService = inject(MessageService);
  private readonly listaCompraService = inject(ListaCompraService);
  private readonly confirmationService = inject(ConfirmationService);

  ngOnChanges(changes: SimpleChanges): void {
    this.ordenarItens();
  }

  ordenarItens(){
    this.itemsList = this.itemsList
      .map(section => ({
        ...section,
        items: [...section.items].sort((a, b) => {
          // 2. Primeiro ordena por checked: false vem antes de true
          if (!!a.checked !== !!b.checked) {
            return a.checked ? 1 : -1;
          }

          // 3. Depois ordena alfabeticamente pelo nome
          return a.name.localeCompare(b.name);
        })
      }))
      // 1. Ordena as sections por nome
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  getHeaderCategory(section: Section & { items: Item[] }): string {
    if (!section) return '';
    const itemCount = section.items.length;
    return `${section.name} (${itemCount} ${itemCount === 1 ? 'item' : 'itens'})`;
  }

  public setCategoriaEmEdicao(sectionId: string | undefined): void {
    if (!sectionId) {
      this.categoriaEmEdicao = null;
      return;
    }
    if (this.categoriaEmEdicao && this.categoriaEmEdicao === sectionId) {
      this.categoriaEmEdicao = null;
      return;
    }
    this.categoriaEmEdicao = sectionId;
  }

  public updateSectionName(section: Section & { items: Item[] }): void {
    if (!section?.id || !this.categoriaEmEdicao) return;
    // Aqui você pode adicionar a lógica para atualizar o nome da seção no serviço ou banco de dados
    this.listaCompraService.updateSection(section.id, { name: section.name})
      .subscribe({
        next: () => {
          const idx = this.itemsList.findIndex((s) => s.id === section.id);
          if (idx !== -1) {
            this.itemsList[idx].name = section.name;
            this.itemsList = [...this.itemsList];
            this.categoriaEmEdicao = null;
          }

          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: 'Categoria alterada com sucesso!',
            life: 5000,
          });
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            detail: 'Erro ao atualizar categoria. Tente novamente...',
            life: 5000,
          });
        },
      });
  }

  onDeleteSection(sectionId: string | undefined): void {
    if (sectionId && sectionId !== '') {
      this.confirmationService.confirm({
        message:
          'Tem certeza que deseja excluir esta categoria?<br>A ação não poderá ser desfeita.',
        header: 'Confirma?',
        icon: 'pi pi-exclamation-triangle',
        rejectButtonStyleClass: 'p-button-secondary',
        acceptButtonStyleClass: 'p-button-danger',
        accept: () => this.deleteSection(sectionId),
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção!',
        detail: 'O ID da categoria é inválido!',
        life: 5000,
      });
    }
  }


  deleteSection(sectionId: string): void {
    this.listaCompraService.deleteSectionCascade(sectionId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso!',
          detail: 'Categoria removida com sucesso!',
          life: 5000,
        });
        this.itemsList = this.itemsList.filter(
          (s) => s.id !== sectionId
        );
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro!',
          detail: 'Erro ao remover categoria. Tente novamente...',
          life: 5000,
        });
      },
    });
  }

  public tratarTeclaPressionada(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.categoriaEmEdicao) {
      const section = this.itemsList.find(sec => sec.id === this.categoriaEmEdicao);
      if (section) {
        this.updateSectionName(section);
      }
    }
  }
}
