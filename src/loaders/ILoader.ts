import Header from './utils/Header';
import EncodedOutput from './utils/EncodedOutput';

/**
 * E = content to be encoded
 */
export default interface ILoader<E> {
  readonly header: Header;
  encode: (input: E, ...rest: any) => EncodedOutput;
  decode: (bytes: Uint8Array, ...rest: any) => E;
}
