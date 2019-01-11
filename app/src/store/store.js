import Vue from "vue";
import Vuex from "vuex";
import socket from "./modules/socket";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    socket
  }
});

export default store;
