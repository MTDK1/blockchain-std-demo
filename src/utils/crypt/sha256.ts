// GitHub - emn178/js-sha256: A simple SHA-256 / SHA-224 hash function for JavaScript supports UTF-8 encoding.
// https://github.com/emn178/js-sha256
// const sha256 = require("js-sha256");
import { sha256, Message } from 'js-sha256';

export function hashSha256(message: Message): string {
  return sha256(message);
}

export function hashShar256d(message: Message): string {
  return hashSha256(hashSha256(message));
}
