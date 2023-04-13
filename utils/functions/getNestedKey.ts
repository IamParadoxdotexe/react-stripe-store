/**
 * Access a dictionary using a nested key with the form `keyA.keyB.keyC`.
 */
export const getNestedKey = (dict: { [key: string]: any }, key: string): any => {
  const keys = key.split('.');
  return keys.reduce((o, k) => (o ? o[k] : undefined), dict);
};
