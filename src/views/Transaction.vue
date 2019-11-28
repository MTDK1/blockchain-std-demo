<template>
  <div>
    <GenerateSecret />
    <PublicKey />
    <Address />
  </div>
</template>

<script>
// @ is an alias to /src
import GenerateSecret from "@/components/GenerateSecret.vue";
import PublicKey from "@/components/PublicKey.vue";
import Address from "@/components/Address.vue";

export default {
  name: "transaction",
  components: {
    GenerateSecret,
    PublicKey,
    Address
  }
};
</script>
