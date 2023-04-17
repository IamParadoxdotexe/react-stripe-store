const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

/**
 * Format money amount.
 * @example (2501.1) => "$2,500.10"
 */
export const formatMoney = (amount: number) => {
  return moneyFormatter.format(amount);
};
