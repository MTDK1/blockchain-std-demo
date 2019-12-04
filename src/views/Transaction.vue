<template>
  <div>
    <From />
    <Data />
    <To />
    <Transaction />
  </div>
</template>

<script>
// @ is an alias to /src
import From from "@/components/vues/From.vue";
import To from "@/components/vues/To.vue";
import Data from "@/components/vues/Data.vue";
import Transaction from "@/components/vues/Transaction.vue";

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
