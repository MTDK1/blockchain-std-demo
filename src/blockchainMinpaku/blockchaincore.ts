// BlockChainCore

import { crypt } from "@/utils/crypt";
import { hashSha256, hashShar256d } from "@/utils/crypt/index";
import { IKey } from "@/utils/crypt/ecdsa";

// logger
const log = require("debug")("Minpaku");

export interface EventAddBlock {
  (error: Error | null, result: string | null, hash: string | null): void;
}

export class BlockChainCore {
  private blockchain: BlockChain = new BlockChain();
  private minnerKey: IKey;
  private eventAddBlockListeners?: EventAddBlock;
  /**
   * コンストラクタ
   * @param minner ブロック生成者初期値
   */
  constructor(params: { minnerPriKey: string }) {
    this.blockchain.setEventAddBlockListener(
      (error: Error | null, result: string | null, hash: string | null) => {
        if (this.eventAddBlockListeners) {
          this.eventAddBlockListeners(error, result, hash);
        } else {
          log("[EVENT] ADD BLOCK, ", { error, result, hash });
        }
      }
    );
    this.minnerKey = crypt.keyFromPrivate(
      Buffer.from(params.minnerPriKey, "hex")
    );
    log("======================");
    log("start blockchain");
    log(
      "minner: ",
      crypt.generateAddress("00", crypt.pubKeyHash(this.minnerKey))
    );
    const height = this.blockchain.getHeight();
    log("block height:", height);
    log("======================");

    if (height <= 0) {
      // 起源ブロックが存在しない
      this.blockchain.addBlock(this.generateGenesisBlock());
      log("current hash = ", this.getCurrentHash());
    }
  }

  setEventAddBlockListener(l: EventAddBlock | null): void {
    this.eventAddBlockListeners = l ? l : undefined;
  }

  generateGenesisBlock(): IBlock {
    log("generate genesis block");
    const tx = functions.createTransaction(
      {
        itemHash: "watasinnti",
        paymentHash: "gokinjjosan",
        user: crypt.generateAddress("00", crypt.pubKeyHash(this.minnerKey))
      },
      this.minnerKey.getPrivate("hex")
    );
    const block = functions.createBlock(hashSha256("genesis"), tx);
    log("genesis block hash = ", block.hash);
    return block;
  }
  getBlock(param: { height?: number; hash?: string }): IBlock | null {
    return this.blockchain.getBlock(param);
  }
  getCurrentHash(): string {
    return this.blockchain.getCurrentHash();
  }
  getHeight(): number {
    return this.blockchain.getHeight();
  }

  _minpakuPurchased(
    item: string,
    pay: string,
    userPubKey: string
  ): { err: Error | null; result: any } {
    const userKey = crypt.keyFromPublic(Buffer.from(userPubKey, "hex"));
    const user = crypt.generateAddress("00", crypt.pubKeyHash(userKey));
    const tx = functions.createTransaction(
      { itemHash: item, paymentHash: pay, user },
      this.minnerKey.getPrivate("hex")
    );

    if (!tx.verify())
      return { err: new Error("transaction error"), result: tx.verify() };

    const block = functions.createBlock(this.getCurrentHash(), tx);
    this.blockchain.addBlock(block);

    return { err: null, result: this.getCurrentHash() };
  }

  minpakuPurchased(tx: Tx): { err: Error | null; result: string | boolean } {
    try {
      const transaction: ITransaction = Object.assign(new Transaction(), tx);
      if (!transaction.verify())
        return { err: new Error("transaction error"), result: false };

      const block = functions.createBlock(this.getCurrentHash(), transaction);
      this.blockchain.addBlock(block);

      return { err: null, result: this.getCurrentHash() };
    } catch (e) {
      return { err: e, result: false };
    }
  }
}

export interface IBlockChain {
  setEventAddBlockListener(l: EventAddBlock): void;
  getBlock(param: { height?: number; hash?: string }): IBlock | null;
  addBlock(newBlock: IBlock): void;
  getCurrentHash(): string;
  getHeight(): number;
}

export class BlockChain implements IBlockChain {
  private eventAddBlock?: EventAddBlock;
  private blocks = new Array<IBlock>();
  setEventAddBlockListener(l: EventAddBlock | null): void {
    this.eventAddBlock = l ? l : undefined;
  }

  public getBlock(param: { height?: number; hash?: string }): IBlock | null {
    if (
      param.height !== undefined &&
      !isNaN(param.height) &&
      0 < param.height
    ) {
      if (param.height <= this.blocks.length)
        return this.blocks[param.height - 1];
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

  public addBlock(newBlock: IBlock) {
    const event = this.eventAddBlock
      ? this.eventAddBlock
      : (error: Error | null, result: string | null, hash: string | null) => {
          log("[[EVENT]] ADD BLOCK, ", {
            error: error ? error.message : "",
            result,
            hash
          });
        };
    if (this.blocks.length === 0) {
      this.blocks.push(newBlock);
      log("blockchain addBlock() genesis = ", newBlock.hash);
      event(null, "added block [genesis]", newBlock.hash);
      return;
    }
    if (this.getCurrentHash() === newBlock.prevHash) {
      this.blocks.push(newBlock);
      log("blockchain addBlock()", newBlock.hash);
      event(null, "added block", newBlock.hash);
    } else {
      log(
        "blockchain addBlock() SKIP SKIP SKIP SKIP SKIP SKIP SKIP SKIP SKIP "
      );
      log("blockchain addBlock() SKIP current hash = ", this.getCurrentHash());
      log("blockchain addBlock() SKIP new block hash = ", newBlock.hash);
      log(
        "blockchain addBlock() SKIP SKIP SKIP SKIP SKIP SKIP SKIP SKIP SKIP "
      );
      event(
        new Error(
          "Attempting to add a block with the same hash value as the previous block."
        ),
        "skip",
        null
      );
    }
  }
  public getCurrentHash(): string {
    if (0 < this.getHeight()) return this.blocks[this.blocks.length - 1].hash;
    return "83cdb38af455beca677634565ad2bcf6b597c55478023eafa4b3e987daa87c5e";
  }
  public getHeight(): number {
    return this.blocks.length;
  }
}

export interface IBlock {
  hash: string;
  prevHash: string;
  // transaction: string;
  transaction: ITransaction;

  setTransaction(transaction: ITransaction): void;

  calcHash(): IBlock;

  toBuffer(): Buffer;
}
/** ブロック */
export class Block implements IBlock {
  hash: string = "";
  prevHash: string = "";
  // transaction: string = "";
  transaction: ITransaction = new Transaction();

  setTransaction(transaction: ITransaction): void {
    // this.transaction = transaction.toBuffer().toString("hex");
    this.transaction = transaction;
  }
  constructor(prevHash?: string) {
    this.prevHash = prevHash ? prevHash : "";
  }

  public calcHash(): IBlock {
    this.hash = hashSha256(this.toBuffer());
    return this;
  }

  public toBuffer(): Buffer {
    const json = JSON.stringify(this);
    return Buffer.from(json);
  }
  static fromBuffer(buf: Buffer): Block {
    const block = new Block();
    const json = JSON.parse(buf.toString());
    return Object.assign(block, json);
  }
}

export interface IData {
  itemHash: string;
  paymentHash: string;
  user: string;
  // toBuffer(): Buffer;
}

export class Data implements IData {
  itemHash: string = "";
  paymentHash: string = "";
  user: string = "";
  // toBuffer(): Buffer {
  //   const json = JSON.stringify(this);
  //   return Buffer.from(json);
  // }
  // static fromBuffer(buf: Buffer): IData {
  //   const json = buf.toString();
  //   // log("json", json)
  //   const jObj = Object.assign(new Data(), JSON.parse(json));
  //   // log("obj", jObj)
  //   return jObj;
  // }
}

export interface Tx {
  txHash: string;
  sign: string;
  pubKey: string;
  // data: string;
  data: IData;
}

export interface ITransaction extends Tx {
  calcHash(): void;
  toBuffer(all?: boolean): Buffer;
  setSign(priKey: Buffer): void;
  verify(): boolean;
  setData(data: IData): void;
}
/** トランザクジョン */
export class Transaction implements ITransaction {
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

export const functions = {
  createTransaction(
    data: { itemHash: string; paymentHash: string; user: string },
    priKey: string
  ): ITransaction {
    const dt = new Data();
    dt.itemHash = data.itemHash;
    dt.paymentHash = data.paymentHash;
    dt.user = data.user;

    const key = crypt.keyFromPrivate(Buffer.from(priKey, "hex"));
    const pubKey = key.getPublic("hex");

    const tx = new Transaction();
    tx.setData(dt);
    tx.pubKey = pubKey;
    tx.setSign(Buffer.from(priKey, "hex"));
    tx.calcHash();

    return tx;
  },

  createBlock(prevHash: string, transaction: Transaction): IBlock {
    const block = new Block(prevHash);
    block.setTransaction(transaction);
    block.calcHash();
    return block;
  }
};
