/**
 * Async await wrapper for easy error handling
 *
 * @param  {Promise} promise - Promise to wrap responses of
 * @returns {Promise} Resolves and rejects with an array
 * @memberof utils
 * @example <caption>Basic</caption>
 * import { to } from 'utils/async'
 *
 * async function asyncFunctionWithThrow() {
 *  const [err, snap] = await to(
 *    admin.database().ref('some').once('value')
 *  );
 *  if (err) {
 *    error('Error getting data:', err.message || err)
 *    throw err
 *  }
 *  if (!snap.val()) throw new Error('Data not found');
 *  info('Data found:', snap.val())
 * }
 */
 export function to<T extends Object>(promise: Promise<any>): Promise<any[]> {
  return promise.then((data) => [null, data]).catch((err) => [err, null]);
}
