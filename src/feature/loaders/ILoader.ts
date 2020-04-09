import Header from './utils/Header';
import EncodeOutput from './utils/EncodeOutput';

/**
 * E = content to be encoded
 */
export default interface ILoader<E> {
  readonly header: Header;
  encode: (input: E, ...rest: any) => EncodeOutput;
  decode: (bits: string, ...rest: any) => E;
}
