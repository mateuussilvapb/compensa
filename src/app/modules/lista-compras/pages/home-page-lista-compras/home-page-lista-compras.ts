import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  of,
  Subscription,
  switchMap
} from 'rxjs';
import { AdicionarCategoria } from '../../components/adicionar-categoria/adicionar-categoria';
import { AdicionarProduto } from '../../components/adicionar-produto/adicionar-produto';
import { BuscarProdutos } from '../../components/buscar-produtos/buscar-produtos';
import { ListagemProdutos } from '../../components/listagem-produtos/listagem-produtos';
import { Item, ListaCompraService, Section } from '../../services/lista-compra.service';

@Component({
  selector: 'app-home-page-lista-compras',
  imports: [
    CardModule,
    CommonModule,
    BuscarProdutos,
    AdicionarProduto,
    ListagemProdutos,
    AdicionarCategoria,
    ReactiveFormsModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './home-page-lista-compras.html',
})
export class HomePageListaCompras implements OnInit, OnDestroy {
  private sectionsWithItemsSub: Subscription | undefined;
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  sectionsWithItemsArray: Array<Section & { items: Item[] }> = [];
  sectionsWithItems$!: Observable<Array<Section & { items: Item[] }>>;
  sectionsWithItemsArrayFiltered: Array<Section & { items: Item[] }> = [];

  private readonly listaCompraService = inject(ListaCompraService);
  private readonly fb = inject(FormBuilder);

  sectionForm!: FormGroup;
  itemForm!: FormGroup;

  constructor() {}

  private buildForms(): void {
    this.sectionForm = this.fb.group({
      name: ['', Validators.required],
    });

    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      weight: [null],
      price: [null],
      quantity: [1],
      type: ['unidade'],
    });
  }

  ngOnInit(): void {
    this.buildForms();
    this.setObservable();
    this.getLista();
  }

  getLista(): void {
    this.loading$.next(true);
    this.sectionsWithItemsSub = this.sectionsWithItems$.subscribe({
      next: (list) => {
        this.sectionsWithItemsArray = list;
        this.updateFilteredItemsList(list);
        this.loading$.next(false);
      },
      error: (err) => {
        this.loading$.next(false);
      },
    });
  }

  private setObservable(): void {
    this.sectionsWithItems$ = this.listaCompraService.getSections().pipe(
      switchMap((sections) => {
        if (!sections || sections.length === 0) return of([]);
        const obs = sections.map((s) =>
          this.listaCompraService.getItems(s.id!).pipe(
            map((itens) => ({
              ...s,
              items: itens,
            }))
          )
        );
        return combineLatest(obs);
      })
    );
  }

  updateFilteredItemsList(filteredList: Array<Section & { items: Item[] }>): void {
    this.sectionsWithItemsArrayFiltered = filteredList;
  }

  filterList(filteredList: Array<Section & { items: Item[] }>): void {
    this.sectionsWithItemsArrayFiltered = filteredList;
  }

  onAdicionarCategoria(categoria: string) {
    if (categoria.trim() === '') return;
    const newSection: Section = { name: categoria.trim() };
    this.listaCompraService.addSection(newSection).subscribe({
      next: (docRef) => {
        const created: Section & { items: Item[] } = {
          id: docRef.id,
          ...newSection,
          items: [],
        } as any;
        this.sectionsWithItemsArray = [...this.sectionsWithItemsArray, created];
      },
      error: (err) => console.error('Erro ao adicionar seção:', err),
    });
  }

  onAdicionarProduto(produto: { sectionId: string; item: Item }) {
    const { sectionId, item } = produto;
    this.listaCompraService.addItem(sectionId, item).subscribe({
      next: (docRef) => {
        this.atualizarListaComNovoItem(sectionId, item, docRef.id);
      },
    });
  }

  atualizarListaComNovoItem(sectionId: string, newItem: Item, idNovoItem: string): void {
    const idx = this.sectionsWithItemsArray.findIndex((s) => s.id === sectionId);
    if (idx !== -1) {
      const sec = this.sectionsWithItemsArray[idx];
      sec.items = [...sec.items, { ...newItem, id: idNovoItem }];
    }
  }

  ngOnDestroy(): void {
    // Garante que todas as subscrições são canceladas ao destruir o componente
    this.sectionsWithItemsSub?.unsubscribe();
  }

  // Conta todos os itens marcados como checked em todas as sections
  get getItemsChecked(): number {
    return this.sectionsWithItemsArray.reduce((total, section) => {
      return total + section.items.filter((item) => item.checked).length;
    }, 0);
  }

  // Conta todos os itens de todas as sections
  get totalItems(): number {
    return this.sectionsWithItemsArray.reduce((total, section) => {
      return total + section.items.length;
    }, 0);
  }
}
