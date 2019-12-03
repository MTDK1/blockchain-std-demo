<template src="./templates/TransactionPool.html"></template>

<script>
// @ is an alias to /src
import From from "@/components/From.vue";
import To from "@/components/To.vue";
import Data from "@/components/Data.vue";
import Transaction from "@/components/Transaction.vue";

export default {
  name: "transaction",
  components: {
    From,
    To,
    Data,
    Transaction
  }
};
</script>
