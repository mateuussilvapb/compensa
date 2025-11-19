import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { Item, Section } from '../../services/lista-compra.service';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-buscar-produtos',
  imports: [
    FormsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
  ],
  templateUrl: './buscar-produtos.html',
})
export class BuscarProdutos implements OnChanges {
  @Input({required: true}) itemsList: Array<Section & { items: Item[] }> = [];
  @Output() filteredItemsList: EventEmitter<Array<Section & { items: Item[] }>> = new EventEmitter();

  public filtro: string = '';

  ngOnChanges(): void {
    this.filtro = '';
    this.buscarProdutos();
  }

  public buscarProdutos() {
    if (this.filtro === '') return this.filteredItemsList.emit(this.itemsList);
    const filtroLower = this.filtro.toLowerCase();
    const filteredList = this.itemsList
      .map(section => {
        const filteredItems = section.items.filter(item =>
          item.name.toLowerCase().includes(filtroLower)
        );
        return { ...section, items: filteredItems };
      })
      .filter(section => section.items.length > 0);
    this.filteredItemsList.emit(filteredList);
  }
}
