// BlockChainCore

import { crypt } from "@/utils/crypt";
import { hashSha256, hashShar256d } from "@/utils/crypt/index";

// logger
const log = require("debug")("Minpaku");

export class BlockChainCore {
  private blockchain = new BlockChain();
  private priKey: string;
  public fn: Functions = new ImpFunctions();
  /**
   * コンストラクタ
   * @param minner ブロック生成者初期値
   */
  constructor(params?: { minnerPriKey?: string }) {
    if (!params) params = {};
    if (!params.minnerPriKey) {
      params.minnerPriKey = crypt.randomPrivateKey().toString("hex");
    }
    this.priKey = params.minnerPriKey;

    const height = this.blockchain.getHeight();
    if (height <= 0) {
      // 初期化されていない
      const key = crypt.keyFromPrivate(Buffer.from(this.priKey, "hex"));
      const newAddress = crypt.generateAddress("00", crypt.pubKeyHash(key));
      const tx = this.fn.txMinner(key.getPrivate("hex"), newAddress);
      log("transaction", tx, tx.verify());

      const block = new Block("00", tx, key.getPublic("hex"));
      block.calcSign(key.getPrivate("hex"));
      log("block", block);

      this.blockchain.addBlock(block);

      const tb = this.blockchain.getBlock({
        height: this.blockchain.getHeight()
      });
      log("tb", tb, tb ? tb.verify() : "null?");
      log("transaction", tb ? tb.transaction.verify() : "null?");
    }
  }
}

export interface Functions {
  txMinner(pri: string, newAddress: string): Transaction;
}

class ImpFunctions implements Functions {
  txMinner(pri: string, newAddress: string): Transaction {
    const data = new TxMinner(newAddress);
    const pubKey = crypt
      .keyFromPrivate(Buffer.from(pri, "hex"))
      .getPublic("hex");
    const tx = new Transaction(data, pubKey);
    tx.calcSign(pri);
    return tx;
  }
}

export interface ToBuffer {
  toBuffer(): Buffer;
}
export interface Sign {
  calcSign(priKey: string): void;
  verify(): boolean;
}

export class BlockChain {
  private blocks = new Array<Block>();
  private minner: string = "";

  public getBlock(param: { height?: number; hash?: string }): Block | null {
    if (
      param.height !== undefined &&
      !isNaN(param.height) &&
      0 <= param.height
    ) {
      if (param.height < this.blocks.length) return this.blocks[param.height];
      return null;
    } else if (param.hash !== undefined) {
      for (let idx in this.blocks) {
        const block = this.blocks[idx];
        if (block.hash === param.hash) return block;
      }
      return null;
    }
    return null;
  }
  public addBlock(newBlock: Block) {
    if (this.blocks.length === 0) {
      this.blocks.push(newBlock);
      return;
    }
    if (this.getCurrentHash() === newBlock.prevHash) {
      const minner = newBlock.getMinnerAddress();
      if (this.minner === minner) this.blocks.push(newBlock);
    }
  }
  public getCurrentHash(): string {
    return this.blocks[this.blocks.length - 1].hash;
  }
  public getHeight(): number {
    return this.blocks.length - 1;
  }
}
/** ブロック */
export class Block implements ToBuffer, Sign {
  verify(): boolean {
    if (!this.transaction.verify()) return false;

    const sign = this.sign;
    this.sign = "block";
    const buf = this.toBuffer();
    const key = crypt.keyFromPublic(Buffer.from(this.pubKey, "hex"));
    const dHash = hashShar256d(buf.toString("hex"));
    const result = key.verify(dHash, Buffer.from(sign, "hex"));
    this.sign = sign;
    return result;
  }
  calcSign(priKey: string): void {
    const buf = this.toBuffer();
    const dHash = Buffer.from(hashShar256d(buf.toString("hex")), "hex");
    const key = crypt.keyFromPrivate(Buffer.from(priKey, "hex"));
    this.sign = key.sign(dHash).toDER("hex");
  }
  public hash: string = "";
  public prevHash: string = "";
  public version: number = 1;
  public transaction: Transaction;
  public sign: string = "block";
  public pubKey: string;

  constructor(prevHash: string, transaction: Transaction, pubKey: string) {
    this.prevHash = prevHash;
    this.transaction = transaction;
    this.pubKey = pubKey;
    this.calcHash();
  }
  public calcHash(): void {
    this.hash = hashSha256(this.toBuffer());
  }
  public toBuffer(): Buffer {
    const msg = Buffer.concat([
      Buffer.from(this.version.toString()),
      Buffer.from(this.sign),
      Buffer.from(this.pubKey),
      this.transaction.toBuffer()
    ]);
    return msg;
  }
  public getMinnerAddress() {
    const key = crypt.keyFromPublic(Buffer.from(this.pubKey, "hex"));
    const pubKeyHash = crypt.pubKeyHash(key);
    return crypt.generateAddress("00", pubKeyHash);
  }
}

export class InitData implements ToBuffer {
  toBuffer(): Buffer {
    return Buffer.from("");
  }
}

/** トランザクジョン */
export class Transaction implements ToBuffer, Sign {
  /** トランザクションハッシュ */
  public txHash: string = "";
  /** バージョン */
  public version: number = 1;
  /** 署名 */
  public sign: string = "transaction";
  /** 公開鍵 */
  public pubKey: string;
  public data: ToBuffer;
  constructor(data: ToBuffer, pubKey: string) {
    this.pubKey = pubKey;
    this.data = data;
    this.calcHash();
  }

  public calcHash(): void {
    this.txHash = hashSha256(this.toBuffer());
  }
  public toBuffer(): Buffer {
    const msg = Buffer.concat([
      Buffer.from(this.version.toString()),
      Buffer.from(this.sign),
      Buffer.from(this.pubKey),
      this.data.toBuffer()
    ]);
    return msg;
  }
  calcSign(priKey: string) {
    const buf = this.toBuffer();
    const dHash = Buffer.from(hashShar256d(buf.toString("hex")), "hex");
    const key = crypt.keyFromPrivate(Buffer.from(priKey, "hex"));
    this.sign = key.sign(dHash).toDER("hex");
  }
  verify(): boolean {
    const sign = this.sign;
    this.sign = "transaction";
    const buf = this.toBuffer();
    const key = crypt.keyFromPublic(Buffer.from(this.pubKey, "hex"));
    const dHash = hashShar256d(buf.toString("hex"));
    const result = key.verify(dHash, Buffer.from(sign, "hex"));
    this.sign = sign;
    return result;
  }
}

/** 家登録トランザクション */
export class TxDoor implements ToBuffer {
  /** 家主 */
  public ownner!: string;
  /** 家 */
  public door!: string;
  toBuffer(): Buffer {
    return Buffer.concat([Buffer.from(this.ownner), Buffer.from(this.door)]);
  }
}
/** 民泊チケット登録トランザクション */
export class TxTicket implements ToBuffer {
  toBuffer(): Buffer {
    throw new Error("Method not implemented.");
  }
  /** 家 */
  public door!: string;
  /** 宿泊日 */
  public date!: Date;
}
/** 購入トランザクション */
export class TxPurchased implements ToBuffer {
  toBuffer(): Buffer {
    throw new Error("Method not implemented.");
  }
  /** 民泊チケットトランザクションハッシュ */
  public ticketHash!: string;
  /** 購入者 */
  public purchased!: string;
  /** 販売代理店 */
  public agent!: string;
}
/** 民泊チケットキャンセルトランザクション */
export class TxCancel implements ToBuffer {
  toBuffer(): Buffer {
    throw new Error("Method not implemented.");
  }
  /** 民泊チケットトランザクションハッシュ */
  public ticketHash!: string;
}
/** ブロック生成者変更トランザクション */
export class TxMinner implements ToBuffer {
  /** 新ブロック生成者 */
  public minner: string;
  constructor(minner: string) {
    this.minner = minner;
  }
  toBuffer(): Buffer {
    return Buffer.from(this.minner, "hex");
  }
}
