let hValues = new Array<number>();
let lastHvalue = 0;
let lastSignal = 0;
let size = 0;

// Register frequency to the hValues list
const addFrequency = () => {
  // Gets only the negative signal
  if (lastHvalue * lastSignal <= 0) {
    // Is 0 or 1 frequency
    if (lastHvalue > 0.4 || lastHvalue < 0.3) {
      hValues.push(lastHvalue);
    } else {
      // Is DIVISOR frequency
      hValues.push(0);
    }
  }
};

// Filter itself
const filter = (value: number, position: number) => {
  const signal = value > 0 ? 1 : -1;
  const absValue = Math.abs(value);

  // If signal of frequency change, register the last one
  // and keep processing the rest
  if (lastSignal !== signal) {
    // Add frequency
    if (lastHvalue !== 0) {
      addFrequency();
    }

    // Reset the the last higher pointer
    lastHvalue = 0;

    // keep updating data
    if (absValue > lastHvalue) {
      lastHvalue = absValue;
    }

    // update signal
    lastSignal = signal;
  } else {
    if (absValue > lastHvalue) {
      lastHvalue = absValue;
    }
  }

  // End of process
  if (position === size - 1) {
    addFrequency();
  }
};

let lastDiff: number;

/**
 * Get a list of samples and return it without duplicated values. Example
 * Gived: [0.77, 0.77, 0.77, 0.28, 0.28],
 * Will return: [0.77, 0.28]
 * @param {number} samples
 *
 * (!) May be improved
 */
const getOnePerSampleGroupDiff = (samples: number) => {
  let isDiff;
  if (samples !== lastDiff) {
    isDiff = lastDiff = samples;
  }
  return isDiff;
};

/**
 * Get the higher values of a pith frequency
 *
 * Map of bits:
 * 0.77 = 1
 * 0.00 = 0
 * 0.38 = DIVISOR
 *
 * @param {Float32Array} floatChannelData
 */
const getHigherFrequency = (floatChannelData: Float32Array) => {
  hValues = [];
  lastDiff = NaN;

  size = floatChannelData.length;
  floatChannelData.forEach(filter);

  return hValues.filter(sample => {
    return getOnePerSampleGroupDiff(sample);
  });
};

export default getHigherFrequency;
