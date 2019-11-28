// import Vue from "vue";
import { crypt } from "@/utils/crypt";

import { Component, Vue, Prop, Provide, Watch } from "vue-property-decorator";
import { keystoreModule } from "@/store/keystore";

const log = require("debug")("Address");

@Component
export default class Address extends Vue {
  @Provide()
  address = this.calculateAddress();

  private get privateKey(): string {
    return keystoreModule.privateKey;
  }

  @Watch("privateKey")
  onPrivateKeyChanged() {
    log("onPrivateKeyChanged", this.privateKey);
    this.address = this.calculateAddress();
  }

  private calculateAddress(): string {
    log("calculateAddress", keystoreModule.privateKey);
    const secretKey = keystoreModule.privateKey;
    if (!secretKey || secretKey.length === 0) {
      return "";
    }
    const key = crypt.keyFromPrivate(Buffer.from(secretKey, "hex"));
    const pubHash = crypt.pubKeyHash(key);
    const networkId = '00';
    const address = crypt.generateAddress(networkId, pubHash);
    return address;
  }
}
