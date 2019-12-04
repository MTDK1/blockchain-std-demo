<template>
  <div>
    <GenerateSecret />
    <PublicKey />
    <Address />
  </div>
</template>

<script>
// @ is an alias to /src
import GenerateSecret from "@/components/vues/GenerateSecret.vue";
import PublicKey from "@/components/vues/PublicKey.vue";
import Address from "@/components/vues/Address.vue";

export default {
  name: "account",
  components: {
    GenerateSecret,
    PublicKey,
    Address
  }
};
</script>
