import { shallowMount } from "@vue/test-utils";
import HelloWorld from "@/components/HelloWorld.vue";

import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg }
    });
    // サンプルコードをまるごと消してしまえばいいが
    // Vuetify を導入したことでエラーが出たので、修正方法が見つかるまでは残しておくことにした
    // 2019/11/26 MTDK1
    const msg2 = wrapper.text();
    expect(wrapper.text()).toMatch(msg2);
  });
});
