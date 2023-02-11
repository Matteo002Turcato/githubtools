export const numberToCurrency = (n: number): string => {
  const parts = n.toFixed(2).split('.');

  const numberPart = parts[0];
  const decimalPart = parts[1];
  const thousands = /\B(?=(\d{3})+(?!\d))/g;

  return (
    numberPart.replace(thousands, ',') + (decimalPart ? '.' + decimalPart : '')
  );
};
