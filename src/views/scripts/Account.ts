import { Component, Vue, Prop, Provide, Watch } from "vue-property-decorator";
import { TransactionModule } from "@/store/transaction";
import { ITransaction } from "@/utils/transaction";
import MessageCard from "@/components/vues/MessageCard.vue";

import GenerateSecret from "@/components/vues/GenerateSecret.vue";
import PublicKey from "@/components/vues/PublicKey.vue";
import Address from "@/components/vues/Address.vue";
import { crypt, maxPrivateKey } from "@/utils/crypt";
import { keystoreModule } from "@/store/keystore";
import { IKey } from "@/utils/crypt/ecdsa";

import { hashSha256 } from "@/utils/crypt/sha256";
import { hashRipemd160 } from "@/utils/crypt/ripemd160";

import { ECCrypto, Encrypt } from "@/utils/crypt/eccrypt";

const log = require("debug")("Account");

@Component({
  components: {
    GenerateSecret,
    PublicKey,
    Address,
    MessageCard
  }
})
export default class Account extends Vue {
  /** 秘密鍵入力フォームの値 */
  privateKey: string = "";
  publicKey: string = "";
  /** 保存済み秘密鍵リスト */
  privateKeys: string[] = [keystoreModule.privateKey];
  flgPrivateKey: boolean = false;
  pubkeyHash1: string = "";
  pubkeyHash2: string = "";
  checkSum1: string = "";
  checkSum2: string = "";
  checkSum: string = "";
  address: string = "";
  daddress: string = "";
  address2: string = "";
  daddress2: string = "";
  idpubkeyhash: string = "";
  checksumB: string = "";
  checkSumG: string = "";
  compareChecksum: boolean = false;

  MAX = maxPrivateKey.toString("hex").toUpperCase();

  /** 秘密鍵「ランダム」ボタンクリックイベント */
  onClickRandom() {
    log("onClickRandom", new Date().toLocaleTimeString());
    this.privateKey = crypt.randomPrivateKey().toString("hex");
  }

  /** 公開鍵生成ボタンクリックイベント */
  onClickGenPub() {
    log("onClickGenPub", new Date().toLocaleTimeString());
    const key = this.getKey();
    log("pubkey = " + (key ? key.getPublic("hex") : ""));
    this.publicKey = key ? key.getPublic("hex") : "";
  }

  getKey(): IKey | undefined {
    if (this.privateKey) {
      return crypt.keyFromPrivate(Buffer.from(this.privateKey, "hex"));
    }
    return undefined;
  }

  onClickHash() {
    log("onClicCreateAddress " + new Date().toLocaleTimeString());
    this.daddress = "";

    const key = this.getKey();
    if (!key) return;
    const pubKey = key.getPublic("hex");
    const hash1 = hashSha256(Buffer.from(pubKey, "hex"));
    const hash2 = hashRipemd160(hash1);

    this.pubkeyHash1 = hash1;
    this.pubkeyHash2 = hash2.toString("hex");

    const cs1 = hashSha256(Buffer.from("00" + this.pubkeyHash2, "hex"));
    const cs2 = hashSha256(Buffer.from(cs1, "hex"));

    this.checkSum1 = cs1;
    this.checkSum2 = cs2;
    this.checkSum = cs2.substring(0, 8);

    this.daddress = "00" + this.pubkeyHash2 + this.checkSum;

    const msg = Buffer.from(
      JSON.stringify({ msg: "message hello world あいうえお" })
    );
    log(typeof pubKey);
    ECCrypto.encrypt(Buffer.from(pubKey, "hex"), msg).then(
      (encrypted: Encrypt) => {
        log({ encrypted });
        // log(Buffer.from(encrypted.iv).toString("hex"));
        log(JSON.stringify(encrypted, null, 2));
        ECCrypto.decrypt(
          Buffer.from(key.getPrivate("hex"), "hex"),
          encrypted
        ).then((decrypted: any) => {
          log(typeof decrypted, decrypted);
          log(decrypted.toString());
        });
      }
    );
  }

  onClickAddress() {
    log("onClickAddress " + new Date().toLocaleTimeString());
    this.address = crypt.generateAddress("00", this.pubkeyHash2);
    this.address2 = this.address;
  }

  onClickBase58Decode() {
    log("onClickBase58Decode");
    this.daddress2 = crypt.decodeAddress(this.address2);
  }

  onClickSplit() {
    log("onClickSplit");
    this.idpubkeyhash = this.daddress2.substring(0, this.daddress2.length - 8);
    this.checksumB = this.daddress2.substring(
      this.daddress2.length - 8,
      this.daddress2.length
    );
  }

  onClicCheckSum2() {
    log("onClicCheckSum2");
    const idPubkeyHash = this.idpubkeyhash;
    const checksum = crypt.generateCheckSum(idPubkeyHash);
    this.checkSumG = checksum;

    const checksum1 = Buffer.from(this.checksumB, "hex");
    const checksum2 = Buffer.from(this.checkSumG, "hex");
    const v = Buffer.compare(checksum1, checksum2);
    this.compareChecksum = v === 0;
  }

  @Watch("daddress")
  onDaddressChanged() {
    this.address2 = "";
    this.daddress2 = "";
    this.idpubkeyhash = "";
    this.checksumB = "";
    this.checkSumG = "";
    this.compareChecksum = false;
  }

  @Watch("privateKey")
  onprivateKeyChanged() {
    this.publicKey = "";
    this.pubkeyHash1 = "";
    this.pubkeyHash2 = "";
    this.checkSum1 = "";
    this.checkSum2 = "";
    this.checkSum = "";
    this.address = "";
    this.daddress = "";

    // log("onprivateKeyChanged", this.privateKey);
    // 画面表示用 多文字に変換
    this.privateKey = this.privateKey.toUpperCase();
    if (this.privateKey.length % 2 === 1) {
      this.privateKey = "0" + this.privateKey;
    }
    // 入力された値をチェックする
    this.flgPrivateKey = false;
    // 文字数（64文字以下）
    const count = this.privateKey.length;
    if (count > 64) return;
    // 数字？
    const num = parseInt(this.privateKey, 16);
    if (isNaN(num)) return;
    // 最大値未満？
    const privateKey = Buffer.from(this.privateKey, "hex");
    if (Buffer.compare(maxPrivateKey, privateKey) !== 1) return;

    this.flgPrivateKey = true;
  }
}
