const base58 = require("bs58");

export function encode(value: Buffer): string {
  return base58.encode(value);
}

export function decode(value: string): Buffer {
  return base58.decode(value);
}
