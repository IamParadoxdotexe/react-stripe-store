/**
 * Get an array of values from a dictionary with null handling.
 */
export const arrayOf = <T>(dict?: { [key: string]: T }): T[] => {
  return dict ? Object.values(dict) : [];
};
