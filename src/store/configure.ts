export default  {
    state: {
        token: false,  // 用户是否登录,
        signInDiaLog: false,  // 登录窗口是否展示,默认是false
    },
    getters : {
        token: (state) =>state.token,
        signInDiaLog: (state) => state.signInDiaLog
    },
    mutations : {
      setToken: (state, token) => {
          state.token = token;
      },
        // 设置登录窗口是否展示
      setSignInDiaLog: (state,signInDiaLog) => {
          state.signInDiaLog = signInDiaLog;
      }
    }
}
