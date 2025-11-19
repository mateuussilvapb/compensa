import { Routes } from '@angular/router';
import { COMPARADOR_PRODUTOS_ROUTES } from '../modules/comparador-produtos/comparador-produtos.routes';
import { LISTA_COMPRAS_ROUTES } from '../modules/lista-compras/lista-compras.routes';
import { REGRA_DE_TRES_ROUTES } from '../modules/regra-de-tres/regra-de-tres.routes';

export const CORE_ROUTES: Routes = [
  {
    path: '',
    children: COMPARADOR_PRODUTOS_ROUTES,
  },
  {
    path: 'listas',
    children: LISTA_COMPRAS_ROUTES,
  },
  {
    path: 'calcular',
    children: REGRA_DE_TRES_ROUTES
  }
];
