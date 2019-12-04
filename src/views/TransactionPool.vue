<template src="./templates/TransactionPool.html"></template>

<script>
// @ is an alias to /src
import TxItem from "@/components/vues/TxItem.vue";
import { Component, Vue } from 'vue-property-decorator';
import { TransactionModule } from "@/store/transaction";

@Component({
  components: {
    TxItem,
  },
})
export default class TransactionPool extends Vue {
  items = TransactionModule.transactions;
}
</script>
