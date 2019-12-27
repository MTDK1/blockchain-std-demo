import { Block } from "@/blockchain/core";
describe("blockchain/block.ts", () => {
  it("calcTarget", () => {
    const b = Block.fromJson(`{"index": "01",
      "prev_hash": "0000000000000000000000000000000000000000000000000000000000000000",
      "data": "7b2264756d6d79223a2244554d4d59227d",
      "timestamp": "16f44f5d67",
      "bit": "1effffff",
      "nonce": "",
      "elapsed_time": "",
      "block_hash": ""
    }`);
    // b.block_hash = Buffer.alloc(0); //00006d0a1ab24e0e2b4e31829b045285163b7366274e53517018617d4d8e9173
    // b.nonce = Buffer.alloc(0); //c229

    const start = new Date().getTime();
    const target = b.calcTarget();
    for (let i = 0; i < Number.MAX_SAFE_INTEGER + 1; i++) {
      b.nonce = Buffer.from(i.toString(16), "hex");
      const blockHash = b.calBlockhash();
      if (Buffer.compare(blockHash, target) <= 0) {
        break;
      }
    }

    b.elapsed_time = Buffer.from([new Date().getTime() - start]);
    expect(
      Buffer.compare(b.nonce, Buffer.from("c229", "hex")) === 0
    ).toBeTruthy();
    expect(
      Buffer.compare(
        b.block_hash,
        Buffer.from(
          "00006d0a1ab24e0e2b4e31829b045285163b7366274e53517018617d4d8e9173",
          "hex"
        )
      ) === 0
    ).toBeTruthy();

    // console.log({
    //   nonce: b.nonce.toString("hex"),
    //   time: new Date().getTime() - start
    // });
    console.log(b.toJson(2));
    // const json = b.toJson(2);
    // const pJson = Block.fromJson(json);
    // pJson.calcTarget();
    // console.log(pJson);
  });
});
