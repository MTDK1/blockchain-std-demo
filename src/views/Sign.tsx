// import { Component, Vue, Prop, Provide, Watch } from "vue-property-decorator";
import * as tsx from "vue-tsx-support";
import { PrivateKey, MessageCard } from "@/components";
import { VTextField, VBtn, VCardActions } from "vuetify/lib";
import { hashSha256 } from "@/utils/crypt/sha256";
import { hashRipemd160 } from "@/utils/crypt/ripemd160";
import { ECCrypto as ECC, Encrypt } from "@/utils/crypt/eccrypt";
import { keystoreModule } from "@/store/keystore";
import { crypt } from "@/utils/crypt";
const log = require("debug")("Sign");

export default tsx.component({
  name: "Sign",
  data() {
    return {
      message: "送信したい メッセージ を入力してください。 Hello world!!",
      hash1: ""
    };
  },
  components: {
    PrivateKey,
    MessageCard,
    VTextField,
    VBtn,
    VCardActions
  },
  methods: {
    onInputMessage(message: string) {
      this.message = message;
    },
    hash() {
      log("hash");
      const h1 = hashSha256(Buffer.from(this.message));
      const h2 = hashRipemd160(h1);
      log("h2", h2);
      this.hash1 = h2.toString("hex");
    },
    encrypt() {
      const priKey = keystoreModule.privateKey;
      const key = crypt.keyFromPrivate(Buffer.from(priKey));
      const pubKey = key.getPublic("hex");
      const sig = key.sign(this.hash1, "hex", {}).toDER();
      log({ sig });

      ECC.sign(Buffer.from(priKey, "hex"), Buffer.from(this.hash1, "hex")).then(
        (encrypted: Encrypt) => {
          log(encrypted);
        }
      );
    }
  },
  render(_h: any) {
    log("render", new Date());
    return (
      <div>
        <MessageCard title="署名作成と検証">
          メッセージが送信途中で改ざんされていないことを証明する。
          ただし、署名に使用した秘密鍵を所有していることは証明できるが、
          送信者が現実世界における送信者本人ということは証明できない。
        </MessageCard>
        <PrivateKey class="mt-5" title="秘密鍵" />
        <MessageCard class="mt-5" title="送信するメッセージ">
          <v-text-field
            value={this.message}
            label="送信するメッセージ"
            onInput={this.onInputMessage}
          ></v-text-field>
        </MessageCard>
        <MessageCard class="mt-5" title="ハッシュ値を計算">
          <span>{this.hash1}</span>
          <v-card-actions slot="actions">
            <v-btn large color="primary" onClick={this.hash}>
              SHA256 + RIPEMD160
            </v-btn>
          </v-card-actions>
        </MessageCard>
        <MessageCard class="mt-5" title="秘密鍵を使ってハッシュ値を暗号化">
          <v-card-actions slot="actions">
            <v-btn large color="primary" onClick={this.encrypt}>
              暗号化
            </v-btn>
          </v-card-actions>
        </MessageCard>
        <MessageCard
          class="mt-5"
          title="メッセージ、署名、公開鍵を送信"
        ></MessageCard>
        <MessageCard
          class="mt-5"
          title="受け取った情報からハッシュ値を計算"
        ></MessageCard>
        <MessageCard
          class="mt-5"
          title="受け取った署名を公開鍵を使って復号化"
        ></MessageCard>
        <MessageCard
          class="mt-5"
          title="計算したハッシュ値と復号化した値を比較"
        ></MessageCard>
      </div>
    );
  }
});
