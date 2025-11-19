export const OPTIONS_CURRENCY_MASK = { prefix: 'R$ ', thousands: '.', decimal: ',', align: 'left', allowNegative: false };
export const OPTIONS_CURRENCY_MASK_TO_WEIGHT = { prefix: '', suffix: ' kg', thousands: '', decimal: ',', align: 'left', allowNegative: false, precision: 3 };
export const OPTIONS_TYPE_PRODUCTS = ['kg', 'L', 'ml', 'g', 'Nenhuma das Opções'] as Array<string>;
// Tipo derivado da constante acima (string literal union: 'kg' | 'L' | ...)
export type ProductOption = typeof OPTIONS_TYPE_PRODUCTS[number];
