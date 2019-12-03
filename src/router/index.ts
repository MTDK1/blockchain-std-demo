import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Account from "../views/Account.vue";
import Transaction from "../views/Transaction.vue";
import TransactionPool from "../views/TransactionPool.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/account",
    name: "account",
    // component: () =>
    //   import(/* webpackChunkName: "account" */ "../views/Account.vue")
    component: Account,
  },
  {
    path: "/transaction",
    name: "transaction",
    // component: () =>
    //   import(/* webpackChunkName: "transaction" */ "../views/Transaction.vue")
    component: Transaction,
  },
  {
    path: "/txpool",
    name: "txpool",
    // component: () =>
    //   import(/* webpackChunkName: "txpool" */ "../views/TransactionPool.vue"),
    component: TransactionPool,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
