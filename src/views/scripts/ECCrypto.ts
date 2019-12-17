import { Component, Vue } from "vue-property-decorator";
import MessageCard from "@/components/vues/MessageCard.vue";

import { ECCrypto as ECC, Encrypt } from "@/utils/crypt/eccrypt";

const log = require("debug")("ECCrypto");

@Component({
  components: {
    MessageCard
  }
})
export default class ECCrypto extends Vue {
  /** 復号化のための秘密鍵 */
  prikey: string =
    "6740F3BC2B6422F39D3AF9EF38895C90044FD3CA0EE36D30349D0455CC795D80";
  /** 暗号化のための公開鍵 */
  pubkey: string =
    "045ccbee8a6ad26193ed3fc98e29b8255604ae940e9304df04639d0263f1cf9350210c24c1d4921c8926e39ca21e924dee8c78a2708087c09972f75f0c5283c59f";

  /** ユーザーが入力するテキスト */
  text1: string = "暗号化したいテキストをここに入力";
  /** 暗号化されたデータ */
  encrypted: string = "";
  encryptedJson: string = "";
  /** 復号化されたデータ */
  text2: string = "";
  /** フラグ */
  text1EQtext2: boolean = this.text1 === this.text2;

  /** 暗号化ボタンクリック */
  onClickEncrypt() {
    // 入力された値を公開鍵を使って暗号化する
    ECC.encrypt(Buffer.from(this.pubkey, "hex"), Buffer.from(this.text1)).then(
      (encrypted: Encrypt) => {
        this.toBintext(encrypted);
        this.encryptedJson = JSON.stringify(
          JSON.parse(Buffer.from(this.encrypted, "hex").toString()),
          null,
          2
        );
      }
    );
  }

  onClickDecrypt() {
    const encrypted = this.fromBintext();
    if (encrypted == null) return;
    ECC.decrypt(Buffer.from(this.prikey, "hex"), encrypted).then(
      (decrypted: any) => {
        this.text2 = decrypted.toString();
        this.text1EQtext2 = this.text1 === this.text2;
      }
    );
  }

  toBintext(encrypted: Encrypt) {
    const keys = Object.keys(encrypted);
    const obj: any = {};
    for (const i in keys) {
      if (keys.hasOwnProperty(i)) {
        const element = (encrypted as any)[keys[i]];
        obj[keys[i]] = element.toString("hex");
      }
    }
    this.encrypted = Buffer.from(JSON.stringify(obj)).toString("hex");
  }

  fromBintext(): Encrypt | null {
    try {
      const encrypted = JSON.parse(
        Buffer.from(this.encrypted, "hex").toString()
      );
      const keys = Object.keys(encrypted);
      const obje: any = {};
      for (const i in keys) {
        if (keys.hasOwnProperty(i)) {
          const element = encrypted[keys[i]];
          obje[keys[i]] = Buffer.from(element, "hex");
        }
      }
      return obje;
    } catch (e) {
      // log(e);
    }
    return null;
  }
}
