import { Component, Vue, Prop, Provide, Watch } from "vue-property-decorator";
import { TransactionModule } from "@/store/transaction";
import { crypt } from "@/utils/crypt";

const log = require("debug")("To");

@Component
export default class To extends Vue {
  sendTo = "";
  decoded = "";
  checksum = "";
  calChecksum = "";
  validate = false;
  pubkeyHash = "";
  networkId = "";

  items = [
    "1UMnaroMybeFreDWrcU4xmNpxUgsdMoxW",
    "179D6uVeRXfwobtShZaHJrjWmm96483VEP",
    "1ENXDq1d6H2yUrWJ9LNqGyrFC5EFETuzM3",
    "16UvFkWfsywCT651gqDMBJEDBfuhkZsqxg"
  ];

  private clearAll() {
    this.decoded = "";
    this.checksum = "";
    this.calChecksum = "";
    this.validate = false;
    this.pubkeyHash = "";
    this.networkId = "";
  }

  @Watch("sendTo")
  onSendToChanged() {
    log(this.sendTo);

    this.clearAll();

    this.validate = this.check();
    this.decoded = this.getDecodedAddress();
    this.pubkeyHash = this.pubHash();
    this.networkId = this.getNetworkId();
    this.checksum = this.getChecksum();
    this.calChecksum = this.calculateChecksum(this.networkId + this.pubkeyHash);
    TransactionModule.SET_SENDTO(this.sendTo);
  }

  private check(): boolean {
    const address = this.sendTo;
    return crypt.validateAddress(address);
  }

  private getDecodedAddress(): string {
    const address = this.sendTo;
    const idpubkeyhash = crypt.decodeAddress(address);
    return idpubkeyhash;
  }

  private pubHash(): string {
    const idpubkeyhash = this.getDecodedAddress();
    const pubkeyhash = idpubkeyhash.substring(2, idpubkeyhash.length - 8);
    return pubkeyhash;
  }

  private getChecksum(): string {
    const idpubkeyhash = this.getDecodedAddress();
    const checksum = idpubkeyhash.substring(
      idpubkeyhash.length - 8,
      idpubkeyhash.length
    );
    return checksum;
  }

  private getNetworkId(): string {
    const idpubkeyhash = this.getDecodedAddress();
    return idpubkeyhash.substring(0, 2);
  }

  private calculateChecksum(idpubkeyhash: string): string {
    return crypt.generateCheckSum(idpubkeyhash);
  }
}
