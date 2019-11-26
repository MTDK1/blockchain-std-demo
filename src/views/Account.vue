<template>
  <GenerateSecret />
</template>

<script>
// @ is an alias to /src
import GenerateSecret from "@/components/GenerateSecret.vue";

export default {
  name: "account",
  components: {
    GenerateSecret
  }
};
</script>
