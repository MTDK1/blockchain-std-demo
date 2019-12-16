import { Component, Vue, Prop, Provide, Watch } from "vue-property-decorator";
import { TransactionModule } from "@/store/transaction";
import { ITransaction } from "@/utils/transaction";
import MessageCard from "@/components/vues/MessageCard.vue";

import GenerateSecret from "@/components/vues/GenerateSecret.vue";
import PublicKey from "@/components/vues/PublicKey.vue";
import Address from "@/components/vues/Address.vue";
import { crypt, maxPrivateKey } from "@/utils/crypt";
import { keystoreModule } from "@/store/keystore";
import { IKey } from "@/utils/crypt/ecdsa";

import { hashSha256 } from "@/utils/crypt/sha256";
import { hashRipemd160 } from "@/utils/crypt/ripemd160";

const log = require("debug")("ECCrypto");

@Component({
  components: {
    MessageCard
  }
})
export default class ECCrypto extends Vue {

}
