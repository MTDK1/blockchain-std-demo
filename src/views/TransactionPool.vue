<template src="./templates/TransactionPool.html"></template>

<script>
// @ is an alias to /src
import TxItem from "@/components/vues/TxItem.vue";
import MessageCard from "@/components/vues/MessageCard.vue";
import { Component, Vue } from "vue-property-decorator";
import { TransactionModule } from "@/store/transaction";

@Component({
  components: {
    TxItem,
    MessageCard
  }
})
export default class TransactionPool extends Vue {
  items = TransactionModule.transactions;
}
</script>
