import * as _ from 'lodash';

/**
 * Perform a deep comparison of two values.
 */
export const isEqual = (a: any, b: any, options?: { omit?: string[] }): boolean => {
  if (options?.omit) {
    return _.isEqual(_.omit(a, options.omit), _.omit(b, options.omit));
  }
  return _.isEqual(a, b);
};
