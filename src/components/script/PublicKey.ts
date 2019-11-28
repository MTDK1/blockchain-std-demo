// import Vue from "vue";
import { crypt } from "@/utils/crypt";

import { Component, Vue, Prop, Provide, Watch } from "vue-property-decorator";
import { keystoreModule } from "@/store/keystore";
import { watch } from "fs";

// const crypt = require("@/utils/crypt");

const log = require("debug")("PublicKey");

@Component
export default class PublicKey extends Vue {
  @Provide()
  publicKey = this.calculatePubkey();

  private get privateKey(): string {
    return keystoreModule.privateKey;
  }

  @Watch("privateKey")
  onPrivateKeyChanged() {
    log("onPrivateKeyChanged", this.privateKey);
    this.publicKey = this.calculatePubkey();
  }

  private calculatePubkey(): string {
    log("calculatePubkey", keystoreModule.privateKey);
    const secretKey = keystoreModule.privateKey;
    if (!secretKey || secretKey.length === 0) {
      return "";
    }
    const key = crypt.keyFromPrivate(Buffer.from(secretKey, "hex"));
    return key.getPublic("hex").toString("hex");
  }
}
