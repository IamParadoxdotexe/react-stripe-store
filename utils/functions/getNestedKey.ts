/**
 * Access a dictionary using a nested key with the form `keyA.keyB.keyC`.
 */
export const getNestedKey = (dict: { [key: string]: any } | undefined, key: string): any => {
  if (!dict) {
    return undefined;
  }
  const keys = key.split('.');
  return keys.reduce((o, k) => (o ? o[k] : undefined), dict);
};
