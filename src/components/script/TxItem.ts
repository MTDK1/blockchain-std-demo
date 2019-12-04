import { Component, Vue, Prop, Provide, Watch } from "vue-property-decorator";
import { TransactionModule } from "@/store/transaction";

const log = require("debug")("TxItem");

@Component
export default class TxItem extends Vue {
  @Prop({ type: Number, required: true })
  index!: number;

  get txid() {
    if (TransactionModule.transactions.length > this.index) {
      return TransactionModule.transactions[this.index].txid;
    }
    return "";
  }
}
