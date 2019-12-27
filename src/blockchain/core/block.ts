import { hashSha256 } from "@/utils/crypt/index";

// ブロック

export { OrgBlock as Block };

class BlockBase {
  public index!: Buffer;
  public prev_hash!: Buffer;
  public data!: Buffer;
  public timestamp!: Buffer;
  /**
   * Difficulty - Bitcoin Wiki
   * https://en.bitcoin.it/wiki/Difficulty
   */
  public bit!: Buffer;
  public nonce!: Buffer;
  public elapsed_time!: Buffer;
  public block_hash!: Buffer;
}

class OrgBlock extends BlockBase {
  constructor(
    index?: Buffer,
    prev_hash?: Buffer,
    data?: Buffer,
    timestamp?: Buffer,
    bit?: Buffer
  ) {
    super();
    this.index = index ? index : Buffer.alloc(0);
    this.prev_hash = prev_hash ? prev_hash : Buffer.alloc(0);
    this.data = data ? data : Buffer.alloc(0);
    this.timestamp = timestamp ? timestamp : Buffer.alloc(0);
    this.bit = bit ? bit : Buffer.alloc(0);
    this.nonce = Buffer.alloc(0);
    this.elapsed_time = Buffer.alloc(0);
    this.block_hash = Buffer.alloc(0);
  }
  public toJson(space?: string | number | undefined): string {
    return JSON.stringify(
      this,
      (key: string, value: any) => {
        if (typeof value === "bigint") return (value as BigInt).toString(16);
        if (typeof value === "object" && value.type === "Buffer") {
          return Buffer.from(value.data).toString("hex");
        }
        return value;
      },
      space
    );
  }
  public static fromJson(json: string): OrgBlock {
    const obj = JSON.parse(json, (key: string, value: any) => {
      if (typeof value === "string") return Buffer.from(value, "hex");
      return value;
    });
    return Object.assign(new OrgBlock(), obj);
  }

  public calBlockhash(): Buffer {
    const h = Buffer.concat([
      this.index,
      this.prev_hash,
      this.data,
      this.timestamp,
      this.bit,
      this.nonce
    ]);
    this.block_hash = Buffer.from(hashSha256(h.toString("hex")), "hex");
    return this.block_hash;
  }

  public calcTarget(): Buffer {
    // 指数
    const e = this.bit.slice(0, 1)[0];
    // 仮数
    const m = this.bit.slice(1);
    const target = Buffer.concat([
      Buffer.alloc(32 - e.valueOf()),
      m,
      Buffer.alloc(e.valueOf() - m.length)
    ]);
    return target;
  }
}
