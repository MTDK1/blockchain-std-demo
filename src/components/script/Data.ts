import { Component, Vue, Prop, Provide, Watch } from "vue-property-decorator";
import { TransactionModule } from "@/store/transaction";

const log = require("debug")("Data");

@Component
export default class Data extends Vue {
  data = TransactionModule.data;
  amount = 0;

  items = ["", "send"];
  @Watch("data")
  onDataChanged() {
    log("onDataChanged", this.data);
    TransactionModule.SET_DATA(this.data);
  }

  @Watch("amount")
  onAmountChanged() {
    log("onAmountChanged", this.amount);
    if (!isNaN(Number(this.amount))) {
      TransactionModule.SET_AMOUNT(Number(this.amount));
    } else {
      TransactionModule.SET_AMOUNT(0);
    }
    log("Transactin.amount", TransactionModule.amount);
  }
}
