const secureRandom = require("secure-random");

export function randomBuffer(length: number): Buffer {
  return secureRandom.randomBuffer(length);
}
