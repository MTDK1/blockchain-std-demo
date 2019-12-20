import * as tsx from "vue-tsx-support";
import { MessageCard } from "@/components";
import { crypt } from "@/utils/crypt";
import { VBtn, VCardActions } from "vuetify/lib";
import { keystoreModule } from "@/store/keystore";

const log = require("debug")("PrivateKey");

export default tsx.component({
  name: "PrivateKey",
  props: {
    title: {
      type: String
    }
  },
  data() {
    return { privateKey: "" };
  },
  components: {
    MessageCard,
    VBtn,
    VCardActions
  },
  methods: {
    /** 秘密鍵をランダムに作成する */
    random() {
      this.privateKey = crypt.randomPrivateKey().toString("hex");
      // log("random", this.privateKey);
      keystoreModule.savePrivateKey(this.privateKey);
    }
  },
  render(_h: any) {
    if (!this.privateKey) {
      this.privateKey = keystoreModule.privateKey;
    }
    return (
      <MessageCard title={this.title}>
        {this.privateKey}
        
        <v-card-actions slot="actions">
          <v-btn large color="primary" onClick={this.random}>
            ランダム
          </v-btn>
        </v-card-actions>
      </MessageCard>
    );
  }
});
