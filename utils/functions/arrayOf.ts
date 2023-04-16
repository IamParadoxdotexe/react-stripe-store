/**
 * Get an array from a dictionary.
 */
export const arrayOf = <T>(dict?: { [key: string]: T }): T[] => {
  return dict ? Object.values(dict) : [];
};
