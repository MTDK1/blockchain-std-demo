import { hashSha256 } from '@/utils/crypt/index';
import { ITransaction, Transaction } from '.';

const log = require("debug")("Minpaku:Block");

// Block

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
