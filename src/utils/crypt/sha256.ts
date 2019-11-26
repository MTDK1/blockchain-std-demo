const sha256 = require("js-sha256");

export function hashSha256(pub: Buffer): string {
  return sha256(pub);
}
