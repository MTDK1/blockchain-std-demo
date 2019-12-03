import {
  Mutation,
  Action,
  VuexModule,
  getModule,
  Module,
} from "vuex-module-decorators";
import store from "@/store/index"; // デコレータでstoreを指定するためimportする必要あり
import { ITransaction } from "@/utils/transaction";
const log = require("debug")("TransactionStore");

// state's interface
export interface TransactionState {
  sendTo: string;
  data: string;
}
@Module({ dynamic: true, store, name: "transactionstore", namespaced: true })
class TransactionStore extends VuexModule implements TransactionState {
  // state
  sendTo: string = "";
  /** fn */
  data: string = "";
  amount: number = 100;
  transactions: ITransaction[] = [];
  // mutation
  @Mutation
  public SET_SENDTO(sendTo: string) {
    this.sendTo = sendTo;
  }
  @Mutation
  public SET_DATA(data: string) {
    log(data);
    this.data = data;
  }
  @Mutation
  public SET_AMOUNT(amount: number) {
    this.amount = amount;
  }
  @Mutation
  public ADD_TRANSACTION(tx: ITransaction) {
    const ntx = Object.assign({}, tx);
    for (const idx in this.transactions) {
      const item = this.transactions[idx];
      if (item.txid === ntx.txid) {
        return;
      }
    }
    this.transactions.push(ntx);
  }
}

export const TransactionModule = getModule(TransactionStore);
