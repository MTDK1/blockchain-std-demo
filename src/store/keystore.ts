import {
  Mutation,
  MutationAction,
  Action,
  VuexModule,
  getModule,
  Module,
} from "vuex-module-decorators";
import store from "@/store/index"; // デコレータでstoreを指定するためimportする必要あり

// state's interface
export interface KeyStoreState {
  privateKey: string;
}
@Module({ dynamic: true, store, name: "keystore", namespaced: true })
class KeyStore extends VuexModule implements KeyStoreState {
  
  // state
  privateKey: string = localStorage["bdebuxdemo.privatekey"] || "";
  // mutation
  @Mutation
  public SET_PRIVATEKEY(key: string) {
    this.privateKey = key;
  }
  @Action({})
  public savePrivateKey(key: string) {
    localStorage["bdebuxdemo.privatekey"] = key;
    if(key !== this.privateKey)
      this.SET_PRIVATEKEY(key);
  }
  @Action({})
  public loadPrivateKey() {
    const key = localStorage["bdebuxdemo.privatekey"];
    this.SET_PRIVATEKEY(key);
  }
  // actions
  // @Action({})
  // // カウンターに100加算するアクション
  // public increment100() {
  //   // actions内で簡単にthisからmutationを呼び出せる。
  //   this.SET_INCREMENT_COUNTER(this.incrementCounter + 100);
  // }
  // @Action({})
  // // カウンターに100減算するアクション
  // public decrement100() {
  //   this.SET_DECREMENT_COUNTER(this.decrementCounter - 100);
  // }
  // actions + mutation
  // incrementCounter decrementCounter両方をリセットするアクションとミューテーション
  // @MutationAction({ mutate: ["incrementCounter", "decrementCounter"] })
  // async resetCounter() {
  //   return {
  //     incrementCounter: 0,
  //     decrementCounter: 1000,
  //   };
  // }
}

export const keystoreModule = getModule(KeyStore);
