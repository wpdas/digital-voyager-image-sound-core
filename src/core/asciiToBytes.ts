/**
 * Converts ASCII-UTF8 text to bytes
 * @param text ASCII text format (UTF8)
 */
const asciiToBytes = (text: string) => {
  const bytes: Array<number> = [];

  for (let i = 0; i < text.length; i++) {
    bytes.push(text[i].charCodeAt(0));
  }

  return bytes;
};

export default asciiToBytes;
