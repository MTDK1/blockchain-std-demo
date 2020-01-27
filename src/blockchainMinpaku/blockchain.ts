import { IBlock } from '.';

const log = require("debug")("Minpaku:Blockchain");

export interface EventAddBlock {
  (error: Error | null, result: string | null, hash: string | null): void;
}

// Blockchain
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