const ec = require("elliptic").ec;
const secp256k1 = new ec("secp256k1");

export interface IKey {
  getPublic: (enc: "hex") => string;
  getPrivate: (enc: "hex") => string;
  validate: () => { result: boolean; reason: string };
  derive: (pub: Buffer) => any;
  sign: (msg: string, enc: string, option: any) => any;
  verify: (msg: string, signature: any) => any;
  inspect: () => string;
}
export const ecdsa = {
  keyFromPrivate(privateKey: Buffer): IKey {
    return secp256k1.keyFromPrivate(privateKey);
  },
  keyFromPublic(publicKey: Buffer): IKey {
    return secp256k1.keyFromPublic(publicKey);
  },
  sign(msg: string, privateKeyPair: IKey): any {
    return secp256k1.sign(msg, privateKeyPair);
  }
};
