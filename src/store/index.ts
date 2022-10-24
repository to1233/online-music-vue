import { createStore } from 'vuex'
import song from "@/store/song";
import configure from "@/store/configure";
import user from "@/store/user";

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    song,
    configure,
    user
  }
})
