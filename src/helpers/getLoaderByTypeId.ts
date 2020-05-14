import { loadersTypeId } from '../constants';
import {
  DecimalNumber,
  ASCIIText,
  Bitmap24bitsTrueColor,
  Bitmap1bitpp,
  Bitmap2bitspp,
  Bitmap4bitspp,
  Bitmap8bitspp,
} from '../loaders';

export type Loader =
  | DecimalNumber
  | ASCIIText
  | Bitmap24bitsTrueColor
  | Bitmap1bitpp
  | Bitmap2bitspp
  | Bitmap4bitspp
  | Bitmap8bitspp
  | null;

/**
 * Get Loader by its typeId
 * @param loaderTypeId
 */
export default function getLoaderByTypeId(loaderTypeId: number): Loader {
  switch (loaderTypeId) {
    case loadersTypeId.DECIMAL_NUMBER:
      return new DecimalNumber();
    case loadersTypeId.ASCII_TEXT:
      return new ASCIIText();
    case loadersTypeId.BITMAP:
      return new Bitmap24bitsTrueColor();
    case loadersTypeId.BITMAP_1BIT_PP:
      return new Bitmap1bitpp();
    case loadersTypeId.BITMAP_2BITS_PP:
      return new Bitmap2bitspp();
    case loadersTypeId.BITMAP_4BITS_PP:
      return new Bitmap4bitspp();
    case loadersTypeId.BITMAP_8BITS_PP:
      return new Bitmap8bitspp();
    default:
      return null;
  }
}
