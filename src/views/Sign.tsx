// import { Component, Vue, Prop, Provide, Watch } from "vue-property-decorator";
import * as tsx from "vue-tsx-support";
import { PrivateKey, MessageCard } from "@/components";
import { VTextField, VBtn, VCardActions } from "vuetify/lib";
import { hashSha256, hashShar256d } from "@/utils/crypt/sha256";
import { hashRipemd160 } from "@/utils/crypt/ripemd160";
import { ECCrypto as ECC, Encrypt } from "@/utils/crypt/eccrypt";
import { keystoreModule } from "@/store/keystore";
import { crypt } from "@/utils/crypt";
import { digest } from "@/utils/crypt/crypto";
import { Message } from "js-sha256";
const log = require("debug")("Sign");

export default tsx.component({
  name: "Sign",
  data() {
    return {
      message: "送信したい メッセージ を入力してください。 Hello world!!",
      hash1: "",
      sig1: "",
      pubkey: "",
      priKey: "",
      hash2: "",
      hash3: "",
      pubkey2:
        "048ff5a0ee012c09512073b79fee2ce5c9534e7c5d86588127fe829cb867a7426e7ecab85bda24579ae7ac9c905c89f1e6abd1f7c03609bf83c83a2cc940e1277b"
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
    onInputPubkey(key: string) {
      this.pubkey2 = key;
    },
    hash() {
      const message: Message = this.message;
      this.hash1 = hashShar256d(message);
      this.priKey = keystoreModule.privateKey;
    },
    hashB() {
      const message: Message = this.message;
      this.hash2 = hashShar256d(message);
    },

    sign() {
      // 作成された秘密鍵
      const priKey = keystoreModule.privateKey;
      // 秘密鍵、公開鍵のペア
      const key = crypt.keyFromPrivate(Buffer.from(priKey));
      this.pubkey = key.getPublic("hex");
      // 署名
      const sig = key.sign(Buffer.from(this.hash1, "hex"));
      this.sig1 = sig.toDER("hex");
    },
    verify1() {
      // 作成された秘密鍵
      // const priKey = keystoreModule.privateKey;
      // 秘密鍵、公開鍵のペア
      // const key = crypt.keyFromPrivate(Buffer.from(priKey));
      // const pubKey = key.getPublic("hex");
      const key2 = crypt.keyFromPublic(Buffer.from(this.pubkey, "hex"));
      this.hash3 = key2.verify(this.hash1, Buffer.from(this.sig1, "hex"))
        ? "検証成功"
        : "検証失敗";
    },
    verify2() {
      try {
        const key2 = crypt.keyFromPublic(Buffer.from(this.pubkey2, "hex"));
        this.hash3 = key2.verify(this.hash1, Buffer.from(this.sig1, "hex"))
          ? "検証成功"
          : "検証失敗(" + new Date().toLocaleTimeString() + ")";
      } catch {
        this.hash3 = "検証失敗(" + new Date().toLocaleTimeString() + ")";
      }
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
          <div>
            <p>メッセージ：{this.message}</p>
            <p>ハッシュ：{this.hash1}</p>
          </div>
          <v-card-actions slot="actions">
            <v-btn large color="primary" onClick={this.hash}>
              SHA256D
            </v-btn>
          </v-card-actions>
        </MessageCard>
        <MessageCard class="mt-5" title="署名作成">
          <div>
            <p>秘密鍵：{this.priKey}</p>
            <p>ハッシュ：{this.hash1}</p>
            <p>署名：{this.sig1}</p>
          </div>
          <v-card-actions slot="actions">
            <v-btn large color="primary" onClick={this.sign}>
              署名作成
            </v-btn>
          </v-card-actions>
        </MessageCard>
        <MessageCard class="mt-5" title="メッセージ、署名、公開鍵を送信">
          <div slot="default">
            <p>メッセージ：{this.message}</p>
            <p>署名：{this.sig1}</p>
            <p>公開鍵：{this.pubkey}</p>
          </div>
        </MessageCard>
        <MessageCard class="mt-5" title="受け取った署名を公開鍵を使って検証">
          <div>
            <p>メッセージ：{this.message}</p>
            <p>署名：{this.sig1}</p>
            <p>公開鍵：{this.pubkey}</p>
            <v-text-field
              value={this.pubkey2}
              label="他の公開鍵"
              onInput={this.onInputPubkey}
            ></v-text-field>
            <p>検証結果：{this.hash3}</p>
          </div>
          <v-card-actions slot="actions">
            <v-btn large color="primary" onClick={this.verify1}>
              公開鍵で検証
            </v-btn>
            <v-btn large color="primary" onClick={this.verify2}>
              自分で設定した公開鍵で検証
            </v-btn>
          </v-card-actions>
        </MessageCard>
      </div>
    );
  }
});
