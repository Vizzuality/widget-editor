/**
 * @typedef {object} Scheme
 * @prop {string} name
 * @prop {string[]} category
 */

/**
 * Return whether a scheme is custom i.e. not officially provided by the host app
 * @param {Scheme} scheme Scheme to evaluate
 * @param {Scheme[]} schemeList List of schemes available to the editor
 */
export const isSchemeCustom = (scheme, schemeList) => scheme.name === 'user-custom'
  || !schemeList.find(s => s.name === scheme.name);

/**
 * Return whether the list of schemes contains a custom scheme
 * @param {Scheme[]} schemeList List of schemes available to the editor
 */
export const containsCustomScheme = schemeList => schemeList.some(s => s.name === 'user-custom');

