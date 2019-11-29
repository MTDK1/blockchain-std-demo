import { Component, Vue, Prop, Provide, Watch } from "vue-property-decorator";
import { TransactionModule } from "@/store/transaction";
import { keystoreModule } from "@/store/keystore";
import { crypt } from "@/utils/crypt";
import { hashSha256 } from "@/utils/crypt/index";

const log = require("debug")("Transaction");

@Component
export default class Transaction extends Vue {
  private get sendTo() {
    return TransactionModule.sendTo;
  }
  private get dt() {
    return TransactionModule.data;
  }
  private get publicKey() {
    const pri = keystoreModule.privateKey;
    const key = crypt.keyFromPrivate(Buffer.from(pri, "hex"));
    return key.getPublic("hex").toString("hex");
  }

  transactionObj = { txid: "", sendTo: "", data: "", pub: "", sig: "" };
  private get transaction() {
    return JSON.stringify(this.transactionObj, null, 2);
  }

  private clearSig() {
    this.transactionObj.sig = "";
  }

  @Watch("sendTo")
  onSendToChanged() {
    log("data:", TransactionModule.data);
    log(this.sendTo);
    this.clearSig();
    this.transactionObj.sendTo = this.sendTo;
  }
  @Watch("dt")
  onDataChanged() {
    log(this.dt);
    this.clearSig();
    this.transactionObj.data = this.dt;
  }
  @Watch("publicKey")
  onPubChanged() {
    log(this.publicKey);
    this.clearSig();
    this.transactionObj.pub = this.publicKey;
  }

  public onClickGenerate() {
    const buf = Buffer.from(keystoreModule.privateKey, "hex");
    const key = crypt.keyFromPrivate(buf);
    this.transactionObj.data = TransactionModule.data;
    this.transactionObj.sendTo = TransactionModule.sendTo;
    this.transactionObj.pub = key.getPublic("hex").toString("hex");

    this.clearSig();
    log("トランザクション", this.transactionObj);
    const text = JSON.stringify(this.transactionObj);
    const hex = crypt.string2hex(text);
    log("hex", { hex });
    const sig = crypt.sign(hex, key);
    this.transactionObj.sig = sig;
    log("署名付きトランザクション", { sig: this.transactionObj });

    this.transactionObj.txid = "";
    const stx = Buffer.from(crypt.string2hex(JSON.stringify(this.transactionObj)), "hex")
    const btxid = Buffer.from(hashSha256(stx), "hex");
    const atxid = btxid.reverse();
    this.transactionObj.txid = atxid.toString("hex");
    // this.transaction = JSON.stringify(this.transactionObj, null, 2);
  }
}
