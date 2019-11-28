<template>
  <div>
    <GenerateSecret />
    <PublicKey secretKey="a" />
  </div>
</template>

<script>
// @ is an alias to /src
import GenerateSecret from "@/components/GenerateSecret.vue";
import PublicKey from "@/components/PublicKey.vue";

export default {
  name: "account",
  components: {
    GenerateSecret,
    PublicKey
  }
};
</script>
