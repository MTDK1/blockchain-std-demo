import { Component, Vue, Prop, Provide, Watch } from "vue-property-decorator";
import { TransactionModule } from "@/store/transaction";

const log = require("debug")("Data");

@Component
export default class Data extends Vue {
  data = TransactionModule.data;

  items = [
    "",
    "send 100"
  ];
  @Watch("data")
  onDataChanged() {
    log(this.data);
    TransactionModule.SET_DATA(this.data);
  }
}
