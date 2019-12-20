// import { shallowMount } from "@vue/test-utils";
// import HelloWorld from "@/components/HelloWorld.vue";
import { crypt, maxPrivateKey } from "@/utils/crypt";
const log = require("debug")("unit-test");

const MAXPRIVATEKEY = Buffer.from(
  "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364140",
  "hex"
);
const PRIVATEKEY = Buffer.from(
  "2fe048c06a5f8bf9b0d97f939aab60faf77835a98ef68710dabca6b36e112ef8",
  "hex"
);
const PUBLICKEY = Buffer.from(
  "048e50c4057ec7aa1c47676adfe9f65a28ea2be274ee26eee90b1e9ea4efbafa" +
    "c6e744faa31a142bd49c763730c352aeecb4aab6c9f5f15a320c8ddbbb1ce68860",
  "hex"
);
const PUBKEYHASH = "372ebc686a9ae5d9afa25a4418d79d4953f2f3aa";

const CHECKSUM = "04720b00";
const NETWORKID = "00";

const ADDRESS = "162n9piV8NmFqNz31snjze3w5uw9YqMKNw";
const ERR_ADDRESS = "162n9piV8NmFqNz31snjze3w5uw9YqMKNx";
const MESSAGE = JSON.stringify({
  test: "あいうえお",
  data: { to: PUBLICKEY.toString("hex") }
});
const MESSAGE_HEX =
  "2537422532327465737425323225334125323225453325383125383225453325383125383425" +
  "4533253831253836254533253831253838254533253831253841253232253243253232646174" +
  "61253232253341253742253232746f2532322533412532323034386535306334303537656337" +
  "6161316334373637366164666539663635613238656132626532373465653236656565393062" +
  "3165396561346566626166616336653734346661613331613134326264343963373633373330" +
  "6333353261656563623461616236633966356631356133323063386464626262316365363838" +
  "3630253232253744253744";
const SIGNATURE =
  "30460221008d2f1675b2eec05cfc0b235dcc92481cdf5bb2b3246a118d0f479fc68c3fff5d0221" +
  "00efb1859c71c278dd72bc8736cadbb1936957badaca9afdbc5d107a8a983b8b55";

describe("utils/crypt.ts", () => {
  it("maxPrivateKey", () => {
    expect(Buffer.compare(maxPrivateKey, MAXPRIVATEKEY)).toBe(0);
  }),
    it("randomBuffer", () => {
      const prikey = crypt.randomPrivateKey();

      expect(prikey.length).toBe(32);
      expect(Buffer.compare(MAXPRIVATEKEY, prikey)).toBe(1);
    }),
    it("KeyFromPrivate", () => {
      const keyPair = crypt.keyFromPrivate(PRIVATEKEY);
      expect(keyPair.getPrivate("hex")).toBe(PRIVATEKEY.toString("hex"));
      expect(keyPair.getPublic("hex")).toBe(PUBLICKEY.toString("hex"));
    }),
    it("KeyFromPublic", () => {
      const keyPair = crypt.keyFromPublic(PUBLICKEY);
      expect(keyPair.getPublic("hex")).toBe(PUBLICKEY.toString("hex"));
    }),
    it("pubKeyHash", () => {
      const keyPair = crypt.keyFromPrivate(PRIVATEKEY);
      const pubkeyHash = crypt.pubKeyHash(keyPair);
      expect(pubkeyHash).toBe(PUBKEYHASH);
    }),
    it("generateCheckSum", () => {
      const keyPair = crypt.keyFromPrivate(PRIVATEKEY);
      const pubkeyHash = crypt.pubKeyHash(keyPair);

      const checksum = crypt.generateCheckSum(NETWORKID + pubkeyHash);
      expect(checksum).toBe(CHECKSUM);
    }),
    it("generateAddress", () => {
      const keyPair = crypt.keyFromPrivate(PRIVATEKEY);
      const pubkeyHash = crypt.pubKeyHash(keyPair);
      const address = crypt.generateAddress(NETWORKID, pubkeyHash);

      expect(address).toBe(ADDRESS);
    }),
    it("decodeAddress", () => {
      const dAddress = crypt.decodeAddress(ADDRESS);
      expect(dAddress).toBe(NETWORKID + PUBKEYHASH + CHECKSUM);
    }),
    it("getChecksum", () => {
      const dAddress = NETWORKID + PUBKEYHASH + CHECKSUM;
      const checksum = crypt.getChecksum(dAddress);
      expect(checksum).toBe(CHECKSUM);
    }),
    it("validateAddress", () => {
      let valid = crypt.validateAddress(ADDRESS);
      expect(valid).toBe(true);
      valid = crypt.validateAddress(ERR_ADDRESS);
      expect(valid).toBe(false);
    }),
    it("sign", () => {
      const c = crypt.string2hex(MESSAGE);
      const key = crypt.keyFromPrivate(PRIVATEKEY);
      const sig = crypt.sign(c, key);
      expect(sig).toBe(SIGNATURE);
    }),
    it("verifySignature", () => {
      const c = crypt.string2hex(MESSAGE);
      const pubKeyPair = crypt.keyFromPublic(PUBLICKEY);
      const verify = crypt.verifySignature(
        c,
        Buffer.from(SIGNATURE, "hex"),
        pubKeyPair
      );
      expect(verify).toBe(true);
    }),
    it("string2hex", () => {
      const c = crypt.string2hex(MESSAGE);
      expect(c).toBe(MESSAGE_HEX);
    }),
    it("hex2string", () => {
      const c = crypt.hex2string(MESSAGE_HEX);
      expect(c).toBe(MESSAGE);
    });
});
