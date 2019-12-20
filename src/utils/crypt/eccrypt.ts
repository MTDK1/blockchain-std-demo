import { logFactory } from "../debug";

var eccrypto = require("eccrypto");
const log = logFactory("ECCrypto");

export class ECCrypto {
  public static encrypt(publicKey: Buffer, msg: Buffer): Promise<Encrypt> {
    return eccrypto.encrypt(publicKey, msg);
  }
  public static decrypt(
    privateKey: Buffer,
    encrypted: Encrypt
  ): Promise<Uint8Array> {
    return eccrypto.decrypt(privateKey, encrypted);
  }
  public static sign(privateKey: Buffer, message: Buffer): Promise<any> {
    return eccrypto.sign(privateKey, message);
  }
  public static verify(publicKey: Buffer, message: Buffer, sig: Buffer) {
    log({ publicKey, message, sig });
    return eccrypto.verify(publicKey, message, sig);
  }
}

export interface Encrypt {
  ciphertext: Uint8Array;
  ephemPublicKey: Uint8Array;
  iv: Uint8Array;
  mac: Uint8Array;
}
