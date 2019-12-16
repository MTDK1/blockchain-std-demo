var eccrypto = require("eccrypto");

export class ECCrypto {
  public static encrypt(publicKey: Buffer, msg: Buffer): Promise<Encrypt> {
    return eccrypto.encrypt(publicKey, msg);
  }
  public static decrypt(privateKey: Buffer, encrypted: Encrypt): Promise<Uint8Array> {
    return eccrypto.decrypt(privateKey, encrypted);
  }
}

export interface Encrypt {
  ciphertext: Uint8Array;
  ephemPublicKey: Uint8Array;
  iv: Uint8Array;
  mac: Uint8Array;
}
