<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex xs12>
        <v-img
          :src="require('../assets/logo.png')"
          class="my-3"
          contain
          height="200"
        ></v-img>
      </v-flex>

      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to BDevUx
        </h1>
        <p class="subheading font-weight-regular">
          ブロックチェーン技術を学習するコミュニティ
          <br />please join our community
          <a href="https://bdevux.github.io/" target="_blank"
            >BDevUx Community</a
          >
        </p>
      </v-flex>

      <v-flex mb-5 xs12>
        <h2 class="headline font-weight-bold mb-3">What's this site</h2>

        <v-layout justify-center>
          ブロックチェーン技術を実際にプログラミングしながら学習します。
          このサイトは実際に作成したプログラムの動作を確認するためのものです。
          プログラミング自体の解説は勉強会や Slack で質問してください。
        </v-layout>
      </v-flex>

      <v-flex xs12 mb-5>
        <h2 class="headline font-weight-bold mb-3">Important Links</h2>

        <v-layout justify-center>
          <a
            href="https://github.com/MTDK1/blockchain-std-demo"
            class="subheading mx-3"
            target="_blank"
          >
            Github-MTDK1/blockchain-std-demo
          </a>
        </v-layout>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "HelloWorld",

  data: () => ({})
});
</script>
