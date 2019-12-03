(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["account"],{"77be":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("GenerateSecret"),a("PublicKey"),a("Address")],1)},c=[],i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-card",{staticClass:"md-12",attrs:{"max-width":"100%",outlined:""}},[a("v-card-text",[a("div",[e._v("ランダム秘密鍵生成")]),a("p",{staticClass:"display-1 text--primary"},[e._v(" 秘密鍵 ")]),a("div",{staticClass:"text--primary"},[e._v(e._s(e.secretKey))])]),a("v-card-actions",[a("v-btn",{attrs:{text:"",color:"deep-purple accent-1"},on:{click:e.onClickGenerate}},[e._v(" Generate ")]),a("v-btn",{attrs:{text:"",color:"deep-purple accent-1"},on:{click:e.onClickSave}},[e._v(" Save ")]),a("v-btn",{attrs:{text:"",color:"deep-purple accent-1"},on:{click:e.onClickLoad}},[e._v(" Load ")])],1)],1)},n=[],l=(a("0d03"),a("d3b7"),a("25f0"),a("9f12")),s=a("53fe"),u=a("8b83"),v=a("c65a"),o=a("c03e"),d=a("9ab4"),y=a("6283"),p=a("60a3"),b=a("1173"),f=a("34eb")("GenerateSecret"),h=function(e){function t(){var e;return Object(l["a"])(this,t),e=Object(u["a"])(this,Object(v["a"])(t).apply(this,arguments)),e.secretKey=b["a"].privateKey,e}return Object(o["a"])(t,e),Object(s["a"])(t,[{key:"onClickGenerate",value:function(){this.secretKey=y["a"].randomPrivateKey().toString("hex"),b["a"].SET_PRIVATEKEY(this.secretKey),f(b["a"].privateKey)}},{key:"onClickSave",value:function(){if(this.secretKey&&0!=this.secretKey.length){var e=this.secretKey;b["a"].savePrivateKey(e)}}},{key:"onClickLoad",value:function(){b["a"].loadPrivateKey(),this.secretKey=b["a"].privateKey}}]),t}(p["c"]);d["a"]([Object(p["b"])()],h.prototype,"secretKey",void 0),h=d["a"]([p["a"]],h);var K=h,x=K,C=a("2877"),_=a("6544"),m=a.n(_),k=a("8336"),j=a("b0af"),O=a("99d9"),P=Object(C["a"])(x,i,n,!1,null,null,null),g=P.exports;m()(P,{VBtn:k["a"],VCard:j["a"],VCardActions:O["a"],VCardText:O["b"]});var w=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-card",{staticClass:"mt-5 md-12",attrs:{"max-width":"100%",outlined:""}},[a("v-card-text",[a("div",[e._v("秘密鍵から公開鍵を計算する")]),a("p",{staticClass:"display-1 text--primary"},[e._v(" 公開鍵 ")]),a("div",{staticClass:"text--primary"},[e._v(e._s(e.publicKey))])])],1)},S=[],V=a("c51e"),E=V["a"],G=Object(C["a"])(E,w,S,!1,null,null,null),T=G.exports;m()(G,{VCard:j["a"],VCardText:O["b"]});var A=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-card",{staticClass:"mt-5 md-12",attrs:{"max-width":"100%",outlined:""}},[a("v-card-text",[a("div",[e._v("公開鍵からアドレスを計算する")]),a("p",{staticClass:"display-1 text--primary"},[e._v(" アドレス ")]),a("div",{staticClass:"text--primary"},[e._v(e._s(e.address))])])],1)},$=[],L=a("876f"),B=Object(C["a"])(L["a"],A,$,!1,null,null,null),J=B.exports;m()(B,{VCard:j["a"],VCardText:O["b"]});var F={name:"account",components:{GenerateSecret:g,PublicKey:T,Address:J}},I=F,R=Object(C["a"])(I,r,c,!1,null,null,null);t["default"]=R.exports},c51e:function(e,t,a){"use strict";(function(e){a("0d03"),a("d3b7"),a("25f0");var r=a("9f12"),c=a("53fe"),i=a("8b83"),n=a("c65a"),l=a("c03e"),s=a("9ab4"),u=a("6283"),v=a("60a3"),o=a("1173"),d=a("34eb")("PublicKey"),y=function(t){function a(){var e;return Object(r["a"])(this,a),e=Object(i["a"])(this,Object(n["a"])(a).apply(this,arguments)),e.publicKey=e.calculatePubkey(),e}return Object(l["a"])(a,t),Object(c["a"])(a,[{key:"onPrivateKeyChanged",value:function(){d("onPrivateKeyChanged",this.privateKey),this.publicKey=this.calculatePubkey()}},{key:"calculatePubkey",value:function(){d("calculatePubkey",o["a"].privateKey);var t=o["a"].privateKey;if(!t||0===t.length)return"";var a=u["a"].keyFromPrivate(e.from(t,"hex"));return a.getPublic("hex").toString("hex")}},{key:"privateKey",get:function(){return o["a"].privateKey}}]),a}(v["c"]);s["a"]([Object(v["b"])()],y.prototype,"publicKey",void 0),s["a"]([Object(v["d"])("privateKey")],y.prototype,"onPrivateKeyChanged",null),y=s["a"]([v["a"]],y),t["a"]=y}).call(this,a("b639").Buffer)}}]);
//# sourceMappingURL=account.355acc10.js.map