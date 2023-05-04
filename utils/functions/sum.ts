/**
 * Get the sum of an array of numbers.
 */
export const sum = (numbers: number[]): number => {
  return numbers.reduce((sum, n) => sum + n, 0);
};
