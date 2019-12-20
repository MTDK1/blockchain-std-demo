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
      </div>
    );
  }
}
