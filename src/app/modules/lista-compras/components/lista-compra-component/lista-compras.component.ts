import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common'; // Para usar async pipe e ngIf/ngFor
import { Observable, Subscription } from 'rxjs';
import { ListaCompraService, Section, Item } from '../../services/lista-compra.service'; // Ajuste o caminho conforme sua estrutura

@Component({
  selector: 'app-lista-compras',
  standalone: true, // Ou importe no módulo, se não for standalone
  imports: [CommonModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './lista-compras.component.html',
})
export class ListaComprasComponent implements OnInit, OnDestroy {
  // Injeção do serviço
  private readonly listaCompraService = inject(ListaCompraService);
  private readonly fb = inject(FormBuilder);

  // Formulários para adicionar seções e itens
  sectionForm: FormGroup;
  itemForm: FormGroup;

  // Observables para exibir as seções e itens
  sections$!: Observable<Section[]>;
  items$!: Observable<Item[]>;

  // Variável para controlar a seção selecionada
  selectedSectionId: string | null = null;
  selectedSectionName: string | null = null;

  // Subscrições para gerenciar o lifecycle (opcional com async pipe, mas bom para updates imperativos)
  private itemSubscription: Subscription | undefined;

  constructor() {
    // Inicializa o formulário de seção
    this.sectionForm = this.fb.group({
      name: ['', Validators.required]
    });

    // Inicializa o formulário de item
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      weight: [null],
      price: [null],
      type: ['unidade'] // Valor padrão
    });
  }

  ngOnInit(): void {
    // 4. Tudo criado e recuperado deve ser específico do usuário logado.
    // Carrega as seções do usuário assim que o componente é inicializado.
    // O service já garante que é o usuário logado.
    this.sections$ = this.listaCompraService.getSections();
  }

  // --- Métodos de Criação ---

  // 1. Conseguir criar seções
  addSection(): void {
    if (this.sectionForm.valid) {
      const newSection: Section = this.sectionForm.value;
      this.listaCompraService.addSection(newSection).subscribe({
        next: (docRef) => {
          console.log('Seção adicionada com sucesso! ID:', docRef.id);
          this.sectionForm.reset(); // Limpa o formulário
        },
        error: (err) => console.error('Erro ao adicionar seção:', err)
      });
    }
  }

  // 2. Conseguir adicionar itens em seções específicas
  // 3. Conseguir criar itens
  addItemToSelectedSection(): void {
    if (this.itemForm.valid && this.selectedSectionId) {
      const newItem: Item = this.itemForm.value;
      this.listaCompraService.addItem(this.selectedSectionId, newItem).subscribe({
        next: (docRef) => {
          console.log('Item adicionado com sucesso! ID:', docRef.id);
          this.itemForm.reset(); // Limpa o formulário
          this.itemForm.get('type')?.setValue('unidade'); // Reseta o tipo para o padrão
        },
        error: (err) => console.error('Erro ao adicionar item:', err)
      });
    } else if (!this.selectedSectionId) {
      console.warn('Selecione uma seção para adicionar itens.');
    }
  }

  // --- Métodos de Leitura/Seleção ---

  // Seleciona uma seção para exibir e gerenciar seus itens
  selectSection(section: Section): void {
    if (section.id) {
      this.selectedSectionId = section.id;
      this.selectedSectionName = section.name;
      // Carrega os itens da seção selecionada
      this.items$ = this.listaCompraService.getItems(section.id);

      // (Opcional) Gerenciamento de subscrição se precisar de mais controle
      this.itemSubscription?.unsubscribe(); // Cancela subscrições anteriores
      this.itemSubscription = this.items$.subscribe(items => {
        console.log(`Itens na seção "${section.name}":`, items);
      });

    } else {
      console.error('Seção sem ID. Não é possível selecionar.');
    }
  }

  // --- Métodos de Atualização (Exemplo básico) ---
  updateSectionName(section: Section, newName: string): void {
    if (section.id && newName) {
      this.listaCompraService.updateSection(section.id, { name: newName }).subscribe({
        next: () => console.log(`Seção "${section.name}" atualizada para "${newName}"`),
        error: (err) => console.error('Erro ao atualizar seção:', err)
      });
    }
  }

  // --- Métodos de Exclusão (Exemplo básico) ---
  deleteSection(sectionId: string): void {
    if (confirm('Tem certeza que deseja excluir esta seção? Isso NÃO excluirá os itens dela automaticamente!')) {
      this.listaCompraService.deleteSection(sectionId).subscribe({
        next: () => {
          console.log('Seção excluída com sucesso!');
          if (this.selectedSectionId === sectionId) {
            this.selectedSectionId = null; // Desseleciona a seção
            this.selectedSectionName = null;
            this.items$ = new Observable<Item[]>(); // Limpa os itens exibidos
          }
        },
        error: (err) => console.error('Erro ao excluir seção:', err)
      });
    }
  }

  deleteItem(sectionId: string, itemId: string): void {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      this.listaCompraService.deleteItem(sectionId, itemId).subscribe({
        next: () => console.log('Item excluído com sucesso!'),
        error: (err) => console.error('Erro ao excluir item:', err)
      });
    }
  }

  ngOnDestroy(): void {
    // Garante que todas as subscrições são canceladas ao destruir o componente
    this.itemSubscription?.unsubscribe();
  }
}
