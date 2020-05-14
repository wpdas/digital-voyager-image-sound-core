/**
 * Project bits depth.
 */
export const DEFAULT_BITS_DEPTH = 8;

/**
 * WAV Header bytes size
 */
export const WAV_HEADER_BYTES_SIZE = 44;

/**
 * Typeid uses 8 bits of information
 */
export const TYPE_ID_BITS_SIZE = 8;

/**
 * Typeid uses 1 byte of information
 */
export const TYPE_ID_BYTE_SIZE = 1;

/**
 * Unitary value for one SampleByte (Algorithm)
 */
export const SAMPLE_BYTE = 0.0078431373;

/**
 * Audio sample rate
 */
export const SAMPLE_RATE = 44100; // 384000 Voyager Disc

const DECIMAL_NUMBER = 0;
const ASCII_TEXT = 1;
const BITMAP = 2;
const BITMAP_1BIT_PP = 3;
const BITMAP_2BITS_PP = 4;
const BITMAP_4BITS_PP = 5;
const BITMAP_8BITS_PP = 6;
const VIDEO_4BITS_PP = 7;

/**
 * Loaders types
 */
export const loadersTypeId = {
  DECIMAL_NUMBER,
  ASCII_TEXT,
  BITMAP,
  BITMAP_1BIT_PP,
  BITMAP_2BITS_PP,
  BITMAP_4BITS_PP,
  BITMAP_8BITS_PP,
  VIDEO_4BITS_PP,
};

/**
 * Array containing Bitmap loaders ids
 */
export const bitmapTypeIds = [
  loadersTypeId.BITMAP,
  loadersTypeId.BITMAP_1BIT_PP,
  loadersTypeId.BITMAP_2BITS_PP,
  loadersTypeId.BITMAP_4BITS_PP,
  loadersTypeId.BITMAP_8BITS_PP,
];

/**
 * Bitmap Loaders
 */
export enum BitmapLoaderTypeIds {
  BITMAP = loadersTypeId.BITMAP,
  BITMAP_1BIT_PP = loadersTypeId.BITMAP_1BIT_PP,
  BITMAP_2BITS_PP = loadersTypeId.BITMAP_2BITS_PP,
  BITMAP_4BITS_PP = loadersTypeId.BITMAP_4BITS_PP,
  BITMAP_8BITS_PP = loadersTypeId.BITMAP_8BITS_PP,
}
