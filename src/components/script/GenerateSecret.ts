// import Vue from "vue";
import { crypt } from "@/utils/crypt";

import { Component, Vue, Prop, Provide } from "vue-property-decorator";
import { keystoreModule } from "@/store/keystore";

const log = require("debug")("GenerateSecret");

@Component
export default class GenerateSecret extends Vue {
  @Provide()
  secretKey = keystoreModule.privateKey;

  public onClickGenerate() {
    this.secretKey = crypt.randomPrivateKey().toString("hex");
    keystoreModule.SET_PRIVATEKEY(this.secretKey);
    log(keystoreModule.privateKey);
  }
}
