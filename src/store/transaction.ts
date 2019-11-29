import {
  Mutation,
  Action,
  VuexModule,
  getModule,
  Module,
} from "vuex-module-decorators";
import store from "@/store/index"; // デコレータでstoreを指定するためimportする必要あり
const log = require("debug")("TransactionStore");

// state's interface
export interface TransactionState {
  sendTo: string;
  data: string;
}
@Module({ dynamic: true, store, name: "transaction", namespaced: true })
class TransactionStore extends VuexModule implements TransactionState {
  // state
  sendTo: string = "";
  data: string = "";
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
}

export const TransactionModule = getModule(TransactionStore);
