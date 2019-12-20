const cry = require("crypto");

export function digest(message: string): Buffer {
  return cry.createHash("sha256").update(message).digest();
}