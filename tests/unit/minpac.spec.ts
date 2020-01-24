import {
  BlockChainCore,
  Data,
  Transaction,
  Block,
  BlockChain,
  functions
} from "@/blockchainMinpaku/blockchaincore";
import { hashSha256 } from "@/utils/crypt/index";
import { crypt } from "@/utils/crypt";
const log = require("debug")("Minpaku");

const PRIVATEKEY = Buffer.from(
  "2fe048c06a5f8bf9b0d97f939aab60faf77835a98ef68710dabca6b36e112ef8",
  "hex"
);

const MINNER =
  "5db3bd90f9a06a9b82c951ef6787d71f00556da29f8ac78276211fa39f75d7f6";

describe("minpaku", () => {
  it("functions.createTransaction()", () => {
    const itemHash = "";
    const paymentHash = "";
    const user = "";
    const data = { itemHash, paymentHash, user };
    const tx = functions.createTransaction(data, PRIVATEKEY.toString("hex"));
    expect(tx.txHash).toBe(
      "8128a0f3454bc6ddbfdf5af82b2be0071d4488b5e9cab61ff59e47576062cbf3"
    );
    expect(tx.verify()).toBeTruthy();

    const dt2 = tx.data;
    // const dt2 = Data.fromBuffer(Buffer.from(dt, "hex"));
    expect(dt2.itemHash).toBe(itemHash);
    expect(dt2.paymentHash).toBe(paymentHash);
    expect(dt2.user).toBe(user);
  });
  it("functions.createBlock()", () => {
    const itemHash = "";
    const paymentHash = "";
    const user = "";
    const data = { itemHash, paymentHash, user };
    const tx = functions.createTransaction(data, PRIVATEKEY.toString("hex"));

    const prevHash = "";
    const block = functions.createBlock(prevHash, tx);
    expect(block.hash).toBe(
      "ee4620e52077d5dc5b4e319c3dbc5d9b4bedf471f8639e1ead6d04081969911d"
    );
    expect(block.prevHash).toBe(prevHash);

    // const btransaction = block.transaction;
    const btx = block.transaction;
    // const btx = Transaction.fromBuffer(Buffer.from(btransaction, "hex"));
    expect(btx.verify()).toBeTruthy();
    expect(btx.txHash).toBe(tx.txHash);

    const dt2 = btx.data;
    // const dt2 = Data.fromBuffer(Buffer.from(dt, "hex"));
    expect(dt2.itemHash).toBe(itemHash);
    expect(dt2.paymentHash).toBe(paymentHash);
    expect(dt2.user).toBe(user);
  });
  it("core", () => {
    const b = new BlockChainCore({ minnerPriKey: MINNER });
    let prevHash: string =
      "0510cc9ec77a249b3011038ff23c3067b5683fa316d6c3683e0d695bb7ead683";
    b.setEventAddBlockListener(
      (error: Error | null, result: string | null, hash: string | null) => {
        log("[CORE]", error, result, hash);
        const block = b.getBlock({ hash: hash ? hash : undefined });
        // log("[CORE] block=", block);
        if (block)
          log(
            "[CORE] prevHash === block.prevHash",
            prevHash === block.prevHash
          );
        else log("[CORE] prevHash === block.hash", false);
        block && expect(block.prevHash).toBe(prevHash);
        prevHash = block ? block.hash : "";
      }
    );
    const key = crypt.keyFromPrivate(PRIVATEKEY);
    const user = crypt.generateAddress("00", crypt.pubKeyHash(key));
    const priKey = PRIVATEKEY.toString("hex");
    for (let i = 0; i < 10; i++) {
      const tx = functions.createTransaction(
        { itemHash: "myitem", paymentHash: "mypay", user: user },
        priKey
      );
      const r = b.minpakuPurchased(tx);
      log("minpakuPurchased, result=", r);
      expect(r.err).toBeNull();
      expect(r.result).toBeTruthy();
    }
  });
  it("data", () => {
    const data1 = new Data();
    data1.itemHash = hashSha256("test item test");
    data1.paymentHash = hashSha256("test payment test");
    data1.user = "162n9piV8NmFqNz31snjze3w5uw9YqMKNw";

    // const buf1 = data1.toBuffer();
    const buf1 = Buffer.from(JSON.stringify(data1));
    const hash1 = hashSha256(buf1);

    // const data2 = Data.fromBuffer(buf1);
    log("buf1.toString", buf1.toString());
    log("buf1.toString", JSON.parse(buf1.toString()));
    const data2 = Object.assign(new Data(), JSON.parse(buf1.toString()));
    // const buf2 = data2.toBuffer();
    const buf2 = Buffer.from(JSON.stringify(data2));
    const hash2 = hashSha256(buf2);

    expect(hash1).toBe(hash2);
  });
  it("transaction", () => {
    const priKey = Buffer.from(
      "2fe048c06a5f8bf9b0d97f939aab60faf77835a98ef68710dabca6b36e112ef8",
      "hex"
    );
    const key = crypt.keyFromPrivate(priKey);

    const data1 = new Data();
    data1.itemHash = hashSha256("test item test");
    data1.paymentHash = hashSha256("test payment test");
    data1.user = "162n9piV8NmFqNz31snjze3w5uw9YqMKNw";

    const transaction = new Transaction();
    transaction.setData(data1);

    const pubKey = key.getPublic("hex");
    transaction.pubKey = pubKey;

    transaction.setSign(Buffer.from(priKey));
    transaction.calcHash();

    expect(transaction.verify()).toBeTruthy();
  });
  it("transaction fromBuffer()", () => {
    const priKey = Buffer.from(
      "2fe048c06a5f8bf9b0d97f939aab60faf77835a98ef68710dabca6b36e112ef8",
      "hex"
    );
    const key = crypt.keyFromPrivate(priKey);

    const data1 = new Data();
    data1.itemHash = hashSha256("test item test");
    data1.paymentHash = hashSha256("test payment test");
    data1.user = "162n9piV8NmFqNz31snjze3w5uw9YqMKNw";

    const transaction = new Transaction();
    transaction.setData(data1);

    const pubKey = key.getPublic("hex");
    transaction.pubKey = pubKey;

    transaction.setSign(Buffer.from(priKey));
    transaction.calcHash();

    const buf = transaction.toBuffer();

    const t2 = Transaction.fromBuffer(buf);

    expect(t2.txHash).toBe(transaction.txHash);
    t2.calcHash();
    expect(t2.txHash).toBe(transaction.txHash);
  });
  it("transaction fromBuffer()", () => {
    const priKey = Buffer.from(
      "2fe048c06a5f8bf9b0d97f939aab60faf77835a98ef68710dabca6b36e112ef8",
      "hex"
    );
    const key = crypt.keyFromPrivate(priKey);

    const data1 = new Data();
    data1.itemHash = hashSha256("test item test");
    data1.paymentHash = hashSha256("test payment test");
    data1.user = "162n9piV8NmFqNz31snjze3w5uw9YqMKNw";

    const transaction = new Transaction();
    transaction.setData(data1);

    const pubKey = key.getPublic("hex");
    transaction.pubKey = pubKey;

    expect(() => transaction.calcHash()).toThrowError("sign can not undefined");
    transaction.setSign(Buffer.from(priKey));

    transaction.calcHash();
    expect(transaction.txHash).toBe(
      "87d536d01e198b20f5c1c2ddea67c81993e1bab893c283d59fbcff850a4fa39e"
    );
  });
  it("block", () => {
    const priKey = Buffer.from(
      "2fe048c06a5f8bf9b0d97f939aab60faf77835a98ef68710dabca6b36e112ef8",
      "hex"
    );
    const key = crypt.keyFromPrivate(priKey);

    const data1 = new Data();
    data1.itemHash = hashSha256("test item test");
    data1.paymentHash = hashSha256("test payment test");
    data1.user = "162n9piV8NmFqNz31snjze3w5uw9YqMKNw";

    const transaction = new Transaction();
    transaction.setData(data1);

    const pubKey = key.getPublic("hex");
    transaction.pubKey = pubKey;
    transaction.setSign(Buffer.from(priKey));
    transaction.calcHash();

    const block = new Block("prevhash");
    block.setTransaction(transaction);

    expect(block.hash).toBe("");
    expect(block.transaction).toBe(transaction);
    expect(block.prevHash).toBe("prevhash");

    block.calcHash();
    expect(block.hash).toBe(
      "e6ef63f6d3162e2e829350cb392aabaf0f8236333a7246043152db03602a81b4"
    );
  });
  it("BlockChain", () => {
    const chain = new BlockChain();

    expect(chain.getHeight()).toBe(0);
    expect(chain.getBlock({ height: 0 })).toBeNull();
    expect(chain.getCurrentHash()).toBe(hashSha256("koichi.matsuda"));
    expect(
      chain.getBlock({
        hash: "83cdb38af455beca677634565ad2bcf6b597c55478023eafa4b3e987daa87c5e"
      })
    ).toBeNull();

    // -----

    const prevHash = chain.getCurrentHash();
    const stx =
      "7b2264617461223a2237623232363937343635366434383631373336383232336132323" +
      "631363433333339333936343330333033343334363533333333363636333632333236333" +
      "338363533333334363636323635333133373633333433363633333333313338333433363" +
      "331333733373331363636343337363133333333333736333632333036313336333633373" +
      "635363233353335363333383330333333393335323232633232373036313739366436353" +
      "665373434383631373336383232336132323634363333343333363533353336333033313" +
      "634333236343333333136343334363436353633333033383332333233323333333833323" +
      "634363533383632333436353631333636363634333836353332333933363334333933333" +
      "333333533363330333133353335333033323334363536363636333233353333363633353" +
      "334323232633232373537333635373232323361323233353634363233333632363433393" +
      "330363633393631333033363631333936323338333236333339333533313635363633363" +
      "337333833373634333733313636333033303335333533363634363133323339363633383" +
      "631363333373338333233373336333233313331363636313333333936363337333536343" +
      "3373636333632323764222c22747848617368223a2266306539646338663833656237653" +
      "437633634313838653364626230333864663632666231303431373335373562376638306" +
      "562663534613130343361366265222c227369676e223a223330343530323231303066366" +
      "635383634396365633964303630623364396231303035336239623633353637343631366" +
      "235316235623239353764343238633431383436343532316465303232303531646535643" +
      "436613737303663316630633364326439356464396332613866656365393436303637303" +
      "2626432356330636333313431303535306332386331222c227075624b6579223a2230343" +
      "865353063343035376563376161316334373637366164666539663635613238656132626" +
      "532373465653236656565393062316539656134656662616661633665373434666161333" +
      "161313432626434396337363337333063333532616565636234616162366339663566313" +
      "561333230633864646262623163653638383630227d";
    const tx = Transaction.fromBuffer(Buffer.from(stx, "hex"));
    const block = functions.createBlock(prevHash, tx);
    expect(block.hash).toBe(
      "f9f68d1bbf1517fa0d6618ebe389514c2cda6dd2ac2f0870b40515cf5807da8c"
    );

    // add block
    chain.addBlock(block);

    // get height
    expect(chain.getHeight()).toBe(1);

    // get block
    const block1 = chain.getBlock({ height: 1 });
    expect(block1 && block1.hash).toBe(
      "f9f68d1bbf1517fa0d6618ebe389514c2cda6dd2ac2f0870b40515cf5807da8c"
    );
    const block2 = chain.getBlock({ height: 2 });
    expect(block2).toBeNull();

    const hash = chain.getCurrentHash();
    expect(hash).toBe(
      "f9f68d1bbf1517fa0d6618ebe389514c2cda6dd2ac2f0870b40515cf5807da8c"
    );

    const tx2 = Object.assign(new Transaction(), tx);
    const block3 = functions.createBlock(hash, tx2);
    chain.addBlock(block3);

    // get height
    expect(chain.getHeight()).toBe(2);

    // get block
    const block4 = chain.getBlock({ height: 2 });
    expect(block4 && block4.hash).toBe(
      "f2bc52bb528607413396dfd70f8e02b4445d17289fa68ac26090a444e7e3e720"
    );

    expect(chain.getCurrentHash()).toBe(
      "f2bc52bb528607413396dfd70f8e02b4445d17289fa68ac26090a444e7e3e720"
    );

    // prevHash が間違えている
    const block5 = functions.createBlock(hash, tx2);
    chain.addBlock(block5);

    // ブロックが追加されていない
    expect(chain.getHeight()).toBe(2);
    expect(chain.getCurrentHash()).toBe(
      "f2bc52bb528607413396dfd70f8e02b4445d17289fa68ac26090a444e7e3e720"
    );
  });
});
