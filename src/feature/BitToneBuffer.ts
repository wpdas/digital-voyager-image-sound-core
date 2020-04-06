/*!
 * BitToneBuffer
 * Copyright(c) 2020 wenderson <wendersonpdas@gmail.com>
 * MIT Licensed
 *
 * Copied from: https://github.com/node-modules/buffer-concat/blob/master/lib/buffer.js
 * and adapted to this project
 */

class BitToneBuffer {
  static concat = (list: Array<Buffer>, length?: number) => {
    if (!Array.isArray(list)) {
      throw new Error('list should be an Array type');
    }

    if (list.length === 0) {
      return new Buffer(0);
    } else if (list.length === 1) {
      return list[0];
    }

    if (typeof length !== 'number') {
      length = 0;
      for (let i = 0; i < list.length; i++) {
        const buf = list[i];
        length += buf.length;
      }
    }

    let buffer = new Buffer(length);
    let position = 0;
    for (let i = 0; i < list.length; i++) {
      let buf = list[i];
      buf.copy(buffer, position);
      position += buf.length;
    }
    return buffer;
  };
}

export default BitToneBuffer;
