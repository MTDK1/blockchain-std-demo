import { Component, Vue, Prop, Provide, Watch } from "vue-property-decorator";
import { TransactionModule } from "@/store/transaction";
import { ITransaction } from "@/utils/transaction";
import MessageCard from "@/components/vues/MessageCard.vue";

const log = require("debug")("TxItem");

@Component({
  components: {
    MessageCard
  }
})
export default class TxItem extends Vue {
  private transaction?: ITransaction;

  @Prop({ type: Number, required: true })
  index!: number;

  check = {
    txid: false,
    fn: false
  };

  get transactionText() {
    const transaction = this.transaction || this.getTransaction();
    return transaction ? JSON.stringify(transaction, null, 2) : "";
  }

  get txid() {
    const transaction = this.transaction || this.getTransaction();
    return transaction ? transaction.txid : "";
  }

  private getTransaction() {
    if (TransactionModule.transactions.length > this.index) {
      this.transaction = TransactionModule.transactions[this.index];
    }
    return this.transaction;
  }

  onClickedCheck() {
    log("onClickedCheck");
  }
}
