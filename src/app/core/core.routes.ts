import { Routes } from '@angular/router';
import { COMPARADOR_PRODUTOS_ROUTES } from '../modules/comparador-produtos/comparador-produtos.routes';

export const CORE_ROUTES: Routes = [
  {
    path: '',
    children: COMPARADOR_PRODUTOS_ROUTES,
  },
];
