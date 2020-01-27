import { ITransaction, Data, Transaction, Block, IBlock } from '.';
import { crypt } from '@/utils/crypt';

const log = require("debug")("Minpaku:functions");

// util

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

  createBlock(prevHash: string, transaction: ITransaction): IBlock {
    const block = new Block(prevHash);
    block.setTransaction(transaction);
    block.calcHash();
    return block;
  }
};
