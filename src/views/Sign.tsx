import { Component, Vue, Prop, Provide, Watch } from "vue-property-decorator";
import { PrivateKey,MessageCard } from "@/components";
const log = require("debug")("Sign");

@Component({
  components: {
    PrivateKey, MessageCard
  }
})
export class Sign extends Vue {
  render(h: any) {
    return (
      <div>
        <MessageCard title="署名作成と検証"></MessageCard>
        <PrivateKey class="mt-5" title="秘密鍵" />
        <MessageCard class="mt-5" title="署名する情報を入力"></MessageCard>
        <MessageCard class="mt-5" title="ハッシュ値を計算"></MessageCard>
        <MessageCard class="mt-5" title="秘密鍵を使ってハッシュ値を暗号化"></MessageCard>
        <MessageCard class="mt-5" title="情報を送信（署名と公開鍵付）"></MessageCard>
        <MessageCard class="mt-5" title="受け取った情報からハッシュ値を計算"></MessageCard>
        <MessageCard class="mt-5" title="受け取った署名を公開鍵を使って復号化"></MessageCard>
        <MessageCard class="mt-5" title="計算したハッシュ値と復号化した値を比較"></MessageCard>
      </div>
    );
  }
}
