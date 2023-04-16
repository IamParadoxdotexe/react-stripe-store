/**
 * Get a dictionary from an array.
 */
export const dictOf = <T>(array: T[], key: keyof T): { [key: string]: T } => {
  return Object.fromEntries(array.map(a => [a[key], a]));
};
