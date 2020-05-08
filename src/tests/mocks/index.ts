import path from 'path';

/**
 * Wav file with the follow uint8 bytes: [65, 110, 121, 32, 255].
 */
export const simpleFile = {
  bytes: [65, 110, 121, 32, 255],
  wavFile: path.join(__dirname, 'simpleFile.wav'),
};

/**
 * A WAV file containing bits generated by DecimalNumber loader.
 */
export const decimalNumber29Wav = {
  bits: '0000000000011101',
  wavFile: path.join(__dirname, 'decimalNumber29.wav'),
};

/**
 * Calibration Circle
 */
export const calibrationCircleBmp = {
  // bmpFile: path.join(__dirname, 'calibration_circle.bmp'),
  bmpFile: path.join(__dirname, 'indigena.bmp'),
};

/**
 * Delete images generated by tests?
 */
export const deleteFilesAfterTest = false;
