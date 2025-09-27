//Externos
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';

//Internos
import { Opcoes } from '../primeNG/traducao.config';

export const PRIMENG_PROVIDER = providePrimeNG({
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: '.app_compensa',
      cssLayer: false,
    },
  },
  ripple: false,
  translation: Opcoes.traducaoPtBr,
});
