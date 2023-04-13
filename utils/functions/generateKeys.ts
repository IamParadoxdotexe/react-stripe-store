/**
 * Generate array of n items corresponding to their index.
 * @example (3) => [0, 1, 2]
 */
export const generateKeys = (n: number) => {
  return [...new Array(n)].map((_, i) => i);
};
