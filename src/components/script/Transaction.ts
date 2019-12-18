import { Component, Vue, Prop, Provide, Watch } from "vue-property-decorator";
import { TransactionModule } from "@/store/transaction";
import { keystoreModule } from "@/store/keystore";
import { crypt } from "@/utils/crypt";
import { hashSha256 } from "@/utils/crypt/index";
import { ITransaction } from "@/utils/transaction/index";
import Data from "./Data";

const log = require("debug")("Transaction");

@Component
export default class Transaction extends Vue {
  private get count() {
    return TransactionModule.transactions.length;
  }
  private get sendTo() {
    return TransactionModule.sendTo;
  }
  private get dt() {
    return TransactionModule.data;
  }
  private get publicKey() {
    const pri = keystoreModule.privateKey;
    const key = crypt.keyFromPrivate(Buffer.from(pri, "hex"));
    return key.getPublic("hex"); //.toString("hex");
  }

  transactionObj: ITransaction = {
    txid: "",
    ver: 0,
    data: {
      fn: ""
    },
    pubKey: ""
  };
  private get transaction() {
    return JSON.stringify(this.transactionObj, null, 2);
  }

  @Watch("sendTo")
  onSendToChanged() {}
  @Watch("dt")
  onDataChanged() {}
  @Watch("publicKey")
  onPubChanged() {}

  public onClickGenerate() {
    const buf = Buffer.from(keystoreModule.privateKey, "hex");
    const key = crypt.keyFromPrivate(buf);
    this.transactionObj.data.fn = TransactionModule.data;
    this.transactionObj.data.sendTo = TransactionModule.sendTo;
    this.transactionObj.data.amount = TransactionModule.amount;
    this.transactionObj.pubKey = key.getPublic("hex"); //.toString("hex");
    this.transactionObj.data.sendTime = new Date().getTime();

    // this.clearSig();
    this.transactionObj.txid = "";
    this.transactionObj.data.sig = "";
    log("トランザクション", this.transactionObj);
    const text = JSON.stringify(this.transactionObj);
    const hex = crypt.string2hex(text);
    log("hex", { hex });
    const sig = crypt.sign(hex, key);
    this.transactionObj.data.sig = sig;
    log("署名付きトランザクション", { sig: this.transactionObj });

    this.transactionObj.txid = "";
    const stx = Buffer.from(
      crypt.string2hex(JSON.stringify(this.transactionObj)),
      "hex"
    );
    const btxid = Buffer.from(hashSha256(stx), "hex");
    const atxid = btxid.reverse();
    this.transactionObj.txid = atxid.toString("hex");
    // this.transaction = JSON.stringify(this.transactionObj, null, 2);
  }

  public onClickSend() {
    log("onClickSend");
    TransactionModule.ADD_TRANSACTION(this.transactionObj);
    log(
      "transactions:",
      JSON.stringify(TransactionModule.transactions, null, 2)
    );
  }
}
