import * as tsx from "vue-tsx-support";
import { VCard, VCardText } from "vuetify/lib";

const log = require("debug")("MessageCard");

export default tsx.component({
  name: "MessageCard",
  props: {
    title: {
      type: String,
      required: true as true
    }
  },
  components: {
    VCard, // Vuetifyを使う場合はここ（使う場所）で登録しておく必要がある
    VCardText
  },
  render(_h: any) {
    log(this.$slots);
    return (
      <v-card class="md-12" max-width="100%" outlined>
        <v-card-text>
          <p class="title text--primary">{this.title}</p>
          <p class="body-1">
            {this.$slots.default ? this.$slots.default[0] : ""}
          </p>
        </v-card-text>
        {this.$slots.actions ? this.$slots.actions : ""}
      </v-card>
    );
  }
});
