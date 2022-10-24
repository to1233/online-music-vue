export default  {
    state: {
        token: false,  // 用户是否登录,
    },
    getters : {
        token: (state) =>state.token,
    },
    mutations : {
      setToken: (state, token) => {
          state.token = token;
      }
    }
}
