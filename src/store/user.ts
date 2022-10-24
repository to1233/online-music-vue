export default {
  state: {
    userId: "", // ID
    userName: "", // 名字
    userPic: "", // 图片
  },
  getters: {
    userId: (state) => state.userId,
    userName: (state) => state.userName,
    userPic: (state) => state.userPic,
  },
  mutations: {
    setUserId: (state, userId) => {
      state.userId = userId;
    },
    setUserName: (state, userName) => {
      state.userName = userName;
    },
    setUserPic: (state, userPic) => {
      state.userPic = userPic;
    },
  },
};
