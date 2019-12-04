import { Component, Vue, Prop, Provide, Watch } from "vue-property-decorator";

const log = require("debug")("MessageCard");

@Component
export default class MessageCard extends Vue {
  @Prop({ type: String, required: true })
  title!: string;
}
