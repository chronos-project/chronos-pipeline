class Serializer {
  static stringToBinary(string) {
    let binaryString = '';

    for (let i = 0; i < string.length; i++) {
      binaryString += Serializer.charToBinary(string[i]);
    }

    return binaryString;
  }

  static charToBinary(chr) {
    let output = '00000000';
    output += chr.charCodeAt(0).toString(2);
    return output.slice(-(8), output.length);
  }

  static stringToBuffer(encoded) {
    const BITS_IN_BYTE = 8;

    // Plus 1 for offset marker
    const byteLength = Math.ceil(encoded.length / 8) + 1
    const arr = new Uint8Array(byteLength)
    const offset = 8 - encoded.length % 8
    arr[0] = offset % 8

    while (encoded.length % 8 !== 0) {
      encoded = '0' + encoded
    }

    let index = 1;

    while (index < byteLength) {
      const chunk = parseInt(encoded.substr((index - 1) * BITS_IN_BYTE, BITS_IN_BYTE), 2);
      arr[index] = chunk
      index++
    }

    return new Buffer(arr)
  }

  static bufferToString(buffer) {
    const arr = new Uint8Array(buffer)
    let str = '';
    const offset = arr[0];

    arr.forEach(chunk => {
      let output = ('00000000' + chunk.toString(2))
      str += output.slice(-8, output.length)
    })

    return str.slice(8 + offset)
  }

  static decode(binary) {
    binary = binary.match(/.{1,8}/g).join(" ");

    const newBinary = binary.split(" ");
    const binaryCode = [];

    for (let i = 0; i < newBinary.length; i += 1) {
      binaryCode.push(String.fromCharCode(parseInt(newBinary[i], 2)));
    }

    return binaryCode.join("");
  }
}

module.exports = Serializer;
