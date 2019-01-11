import socketIo from "socket.io-client"; /* eslint-disable */
import URL from "../../config/AppConfig";
import * as types from "../mutation-types";
import Vue from "vue";

const state = {
  webSocket: null,  
  isConnected: false,
  isSocketConnected: false,
  lastLines: []
};

const getters = {
  webSocket: state => state.webSocket,
  isSocketConnected: state => state.isSocketConnected,
  lastLines: state => state.lastLines
};

const actions = {
  setupSocket({ commit, dispatch, state, rootState }) {
    if (!state.webSocket && process.browser) {
      const socketUrl = `${URL.SOCKET_URL}`;
      const socket = socketIo(socketUrl);
      socket.on(`info`, function(info) {
        console.log(info);

        commit(types.UPDATE_IS_CONNECTED, true);
        commit(types.SET_LAST_SOME_LINES, info);
      });

      socket.on(`emit_last_some_lines`, function (data) {
        commit(types.SET_LAST_SOME_LINES, data);
      });

      commit(types.SET_WEBSOCKET, socket);

      socket.on("disconnect", () => {
        commit(types.SET_SOCKET_CONNECTION, false);
      });

      socket.on("connect", () => {
        console.log("connected to socket");
        commit(types.SET_SOCKET_CONNECTION, true);

        socket.emit('join');
      });
    } else if (state.webSocket) {
      state.webSocket.disconnect(true);

      window.setTimeout(() => {
        commit(types.SET_WEBSOCKET, null);
        dispatch("setupSocket");
      }, 500);
    }
  }
};

const mutations = {
  [types.SET_WEBSOCKET](state, socket) {
    state.webSocket = socket;
  },

  [types.SET_SOCKET_CONNECTION](state, isSocketConnected) {
    state.isSocketConnected = isSocketConnected;
  },

  [types.UPDATE_IS_CONNECTED](state, isConnected) {
    state.isConnected = isConnected;
  },

  [types.SET_LAST_SOME_LINES](state, lines) {
      state.lastLines = lines;
  }

};

export default {
  state,
  getters,
  actions,
  mutations
};
