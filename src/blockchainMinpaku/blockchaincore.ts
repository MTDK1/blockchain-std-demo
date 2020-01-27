// BlockChainCore

import { crypt } from "@/utils/crypt";
import { hashSha256 } from "@/utils/crypt/index";
import { IKey } from "@/utils/crypt/ecdsa";
import {
  ITransaction,
  Transaction,
  Data,
  Tx,
  IBlock,
  BlockChain,
  EventAddBlock,
  utils
} from ".";

// logger
const log = require("debug")("Minpaku:BlockchainCore");

export class BlockChainCore {
  // ブロックデータ管理
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
  /**
   * ブロック追加イベントリスナーを登録する
   * @param l イベントリスナー
   */
  setEventAddBlockListener(l: EventAddBlock | null): void {
    this.eventAddBlockListeners = l ? l : undefined;
  }

  /**
   * 起源ブロック作成
   * @returns 起源ブロック
   */
  generateGenesisBlock(): IBlock {
    log("generate genesis block");
    const tx = utils.createTransaction(
      {
        itemHash: "watasinnti",
        paymentHash: "gokinjjosan",
        user: crypt.generateAddress("00", crypt.pubKeyHash(this.minnerKey))
      },
      this.minnerKey.getPrivate("hex")
    );
    const block = utils.createBlock(hashSha256("genesis"), tx);
    // log("genesis block hash = ", block.hash);
    return block;
  }
  /**
   * ブロック取得
   * @param param height もしくは hash
   */
  getBlock(param: { height?: number; hash?: string }): IBlock | null {
    return this.blockchain.getBlock(param);
  }
  /**
   * 最後に追加されたブロックのハッシュ値を取得
   */
  getCurrentHash(): string {
    return this.blockchain.getCurrentHash();
  }
  /**
   * 現在のブロック数
   */
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
    const tx = utils.createTransaction(
      { itemHash: item, paymentHash: pay, user },
      this.minnerKey.getPrivate("hex")
    );

    if (!tx.verify())
      return { err: new Error("transaction error"), result: tx.verify() };

    const block = utils.createBlock(this.getCurrentHash(), tx);
    this.blockchain.addBlock(block);

    return { err: null, result: this.getCurrentHash() };
  }

  /**
   * 民泊トランザクション追加
   * @param tx 民泊トランザクション
   */
  minpakuPurchased(tx: Tx): { err: Error | null; result: string | boolean } {
    try {
      const transaction: ITransaction = Object.assign(new Transaction(), tx);
      if (!transaction.verify())
        return { err: new Error("transaction error"), result: false };

      const block = utils.createBlock(this.getCurrentHash(), transaction);
      this.blockchain.addBlock(block);

      return { err: null, result: this.getCurrentHash() };
    } catch (e) {
      return { err: e, result: false };
    }
  }
}
