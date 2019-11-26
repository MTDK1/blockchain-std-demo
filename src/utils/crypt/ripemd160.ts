const ripemd160 = require("ripemd160");

export function hashRipemd160(msg: string): Buffer {
  return new ripemd160().update(msg).digest();
}
