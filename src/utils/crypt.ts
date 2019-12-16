// 暗号化に関するユーティリティ

import { ecdsa, IKey } from "./crypt/ecdsa";
import { logFactory } from "./debug";
import { hashSha256 } from "./crypt/sha256";
import { hashRipemd160 } from "./crypt/ripemd160";
import { randomBuffer } from "./crypt/secureRandom";
import { encode as b58encode, decode as b58decode } from "./crypt/bs58";
const log = logFactory("crypt");

const HEX = "hex";
export const maxPrivateKey = Buffer.from(
  "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364140",
  HEX
);
const CHECKSUM_LENGTH = 8;

export const crypt = {
  randomPrivateKey,
  keyFromPrivate,
  keyFromPublic,
  pubKeyHash,
  generateCheckSum,
  generateAddress,
  decodeAddress,
  getChecksum,
  validateAddress,
  sign,
  verifySignature,
  string2hex,
  hex2string
};

// 外部ライブラリをラップしたものを作成する

/** 秘密鍵を乱数で生成する */
function randomPrivateKey(): Buffer {
  let privateKey;
  do {
    privateKey = randomBuffer(32);
  } while (Buffer.compare(maxPrivateKey, privateKey) !== 1);
  return privateKey;
}

function keyFromPrivate(fromPrivateKey: Buffer): IKey {
  return ecdsa.keyFromPrivate(fromPrivateKey);
}
function keyFromPublic(publicKey: Buffer): IKey {
  return ecdsa.keyFromPublic(publicKey);
}

function pubKeyHash(key: IKey): string {
  const sha256 = hashSha256(Buffer.from(key.getPublic(HEX), "hex"));
  return hashRipemd160(sha256).toString(HEX);
}

/**
 * チェックサム生成
 * @param value ネットワークID＋公開鍵ハッシュ
 *
 * ハッシュ化2回、先頭8バイトを返却
 * ビットコインの仕様
 */
function generateCheckSum(value: string): string {
  const hash1 = hashSha256(Buffer.from(value, HEX));
  const hash2 = hashSha256(Buffer.from(hash1, HEX));
  return hash2.substring(0, CHECKSUM_LENGTH);
}

/**
 * アドレス生成
 */
function generateAddress(networkId: string, pubHash: string): string {
  const idpub = networkId + pubHash;
  const checksum = generateCheckSum(idpub);
  const idpubhashchecksum = idpub + checksum;
  const address = b58encode(Buffer.from(idpubhashchecksum, HEX));
  return address;
}

/**
 * アドレスを Base58 デコード
 * @param address アドレス
 */
function decodeAddress(address: string): string {
  const bytes = b58decode(address);
  return bytes.toString(HEX);
}

/**
 * デコードされたアドレスからチェックサム部分を取得
 * @param decodedAddress デコードされたアドレス
 */
function getChecksum(decodedAddress: string): string {
  return decodedAddress.substring(
    decodedAddress.length - CHECKSUM_LENGTH,
    decodedAddress.length
  );
}

function validateAddress(address: string): boolean {
  const dAddress = decodeAddress(address);
  const checksum = getChecksum(dAddress);
  const length = dAddress.length - CHECKSUM_LENGTH;
  const idpubhash = dAddress.substr(0, length);
  const cChecksum = generateCheckSum(idpubhash);
  return checksum === cChecksum;
}

function sign(msg: string, privateKeyPair: IKey): string {
  const sha: string = hashSha256(Buffer.from(msg, HEX));
  const messageHash = hashRipemd160(sha);
  const signature = ecdsa.sign(messageHash.toString(HEX), privateKeyPair);

  return signature.toDER("hex");
}

function verifySignature(msg: string, signature: string, publicKeyPair: IKey) {
  const sha: string = hashSha256(Buffer.from(msg, HEX));
  const messageHash = hashRipemd160(sha).toString(HEX);
  const isVerified = publicKeyPair.verify(messageHash, signature);
  log("verifySignature", { isVerified });
  return isVerified;
}
function string2hex(msg: string): string {
  const a = encodeURIComponent(msg);
  const b = [];
  for (let i = 0; i < a.length; i++) {
    b.push(a.charCodeAt(i));
  }
  return Buffer.from(b).toString("hex");
}
function hex2string(hex: string): string {
  const d = Buffer.from(hex, "hex");
  let e = "";
  for (let i = 0; i < d.length; i++) {
    e += String.fromCharCode(d[i]);
  }
  return decodeURIComponent(e);
}
