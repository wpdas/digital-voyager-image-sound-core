/**
 * Uniq samples extracted from
 * @param {Array<number>} uniqSamples
 */
const getBinaryFromFilteredSamples = (uniqSamples: Array<number>) => {
  return uniqSamples.map(sample => {
    return sample > 0.1 ? 1 : 0;
  });
};

export default getBinaryFromFilteredSamples;
