import { crypt } from "@/utils/crypt";
import { hashShar256d } from "@/utils/crypt/index";
import { hashSha256 } from "@/utils/crypt/index";

const log = require("debug")("Minpaku:Transaction");

// Transaction

export type IData = Data;

export class Data implements IData {
  itemHash: string = "";
  paymentHash: string = "";
  user: string = "";
}

export interface Tx {
  txHash: string;
  sign: string;
  pubKey: string;
  data: IData;
}

export interface ITransaction {
  calcHash(): void;
  toBuffer(all?: boolean): Buffer;
  setSign(priKey: Buffer): void;
  verify(): boolean;
  setData(data: IData): void;
  getData(): IData;
}
/** トランザクジョン */
export class Transaction implements ITransaction, Tx {
  // data: string = "";
  data: IData = new Data();
  /** トランザクションハッシュ */
  txHash: string = "";
  /** 署名 */
  sign: string = "";
  /** 公開鍵 */
  pubKey: string = "";

  setSign(priKey: Buffer): void {
    // const buf = Buffer.concat([
    //   Buffer.from(this.pubKey, "hex"),
    //   Buffer.from(this.data, "hex")
    // ]);
    const buf = this.toBuffer(false);
    const dHash = hashShar256d(buf.toString("hex"));
    const key = crypt.keyFromPrivate(priKey);
    this.sign = key.sign(Buffer.from(dHash, "hex")).toDER("hex");
  }
  setData(data: IData): void {
    // this.data = data.toBuffer().toString("hex");
    this.data = data;
  }
  getData(): IData {
    return this.data;
  }

  public calcHash(): void {
    this.txHash = "";
    if (!this.sign || this.sign.length <= 0) {
      throw new Error("sign can not undefined");
    }
    this.txHash = hashSha256(this.toBuffer());
  }
  public toBuffer(all = true): Buffer {
    if (all) {
      const json = JSON.stringify(this);
      return Buffer.from(json);
    } else {
      const { pubKey, data } = this;
      const json = JSON.stringify({ pubKey, data });
      return Buffer.from(json);
    }
  }
  static fromBuffer(buf: Buffer): Transaction {
    const json = buf.toString();
    // log("json", json)
    const jObj = Object.assign(new Transaction(), JSON.parse(json));
    // log("obj", jObj)
    return jObj;
  }

  verify(): boolean {
    const key = crypt.keyFromPublic(Buffer.from(this.pubKey, "hex"));
    const buf = this.toBuffer(false);
    const dHash = hashShar256d(buf.toString("hex"));
    const result = key.verify(dHash, Buffer.from(this.sign, "hex"));
    return result;
  }
}
