export default ({
    state: {

        /** 音乐信息 */
        songId: "",// 音乐ID
        songTitle: "", // 歌名
        songUrl: "", // 音乐url
        songPic: `https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg`, // 歌曲图片
        singerName: "", // 歌手名
        lyric: [], // 处理后的歌词数据
        singerId: '1' , // 歌手id
        /** 音乐播放信息*/
        isPlay: false, // 播放状态
        volume: 0, // 音量
        duration: 0, // 音乐时长
        currentTime: 0, // 当前音乐的播放位置
        changeTime: 0, // 指定播放时刻
        autoNext: true, // 用于触发自动播放下一首

        /**音乐列表信息 */
        currentPlayList: [], // 当前播放列表
        songDetails: null, // 单个歌单信息
        currentPlayIndex: -1, // 当前歌曲在歌曲列表的位置

        showAside: false, // 是否显示侧边栏
        pageNum: 1, // 记录当前页码 以便回退的时候进行重新加载
        cat: '全部歌曲', // 记录当前歌单的类别 以便回退的时候进行重新加载
    },
    getters: {
        songId: (state: any) => state.songId,
        songTitle: (state) => state.songTitle,
        songUrl: (state) => state.songUrl,
        songPic: (state) => state.songPic,
        singerName: (state) => state.singerName,
        lyric: (state) => state.lyric,

        isPlay: (state) => state.isPlay,
        playBtnIcon: (state) => state.playBtnIcon,
        volume: (state) => state.volume,
        duration: (state) => state.duration,
        singerId: (state) =>state.singerId,
        curTime: (state) => state.curTime,
        changeTime: (state) => state.changeTime,
        autoNext: (state) => state.autoNext,

        currentPlayList: (state) => state.currentPlayList,
        songDetails: (state) => state.songDetails,
        currentPlayIndex: (state) => state.currentPlayIndex,
        showAside: (state) => state.showAside,
        pageNum: (state) => state.pageNum,
        cat: (state) => state.cat
    },
    mutations: {
        setSongId: (state, songId) => {
            state.songId = songId;
        },
        setSongTitle: (state, songTitle) => {
            state.songTitle = songTitle;
        },
        setSongUrl: (state, songUrl) => {
            state.songUrl = songUrl;
        },
        setSongPic: (state, songPic) => {
            state.songPic = songPic;
        },
        setSingerName: (state, singerName) => {
            state.singerName = singerName;
        },
        setAutoNext: (state, autoNext) => {
            state.autoNext = autoNext;
        },
        setLyric: (state, lyric) => {
            state.lyric = lyric;
        },
        // 设置对应的页码
        setPageNum: (state, pageNum) => {
            state.pageNum = pageNum;
        },
        setIsPlay: (state, isPlay) => {
            state.isPlay = isPlay;
        },
        setPlayBtnIcon: (state, playBtnIcon) => {
            state.playBtnIcon = playBtnIcon;
        },
        setVolume: (state, volume) => {
            state.volume = volume;
        },
        setSingerId: (state, singerId) => {
            state.singerId = singerId;
        },
        setDuration: (state, duration) => {
            state.duration = duration;
        },
        setCurTime: (state, curTime) => {
            state.curTime = curTime;
        },
        setChangeTime: (state, changeTime) => {
            state.changeTime = changeTime;
        },

        setCurrentPlayList: (state, currentPlayList) => {
            state.currentPlayList = currentPlayList;
        },
        setSongDetails: (state, songDetails) => {
            state.songDetails = songDetails;
        },
        setCurrentPlayIndex: (state, currentPlayIndex) => {
            state.currentPlayIndex = currentPlayIndex;
        },
        setShowAside: (state, showAside) => {
            state.showAside = showAside;
        },

        // 设置歌单的种类
        setCat: (state, cat) => {
            state.cat = cat;
        },
    },
    actions: {
        playMusic: ({commit}, {id, url, pic, index, songTitle, singerName, lyric,singerId}) => {
            commit("setSongId", id);
            commit("setSongUrl", url);
            commit("setSongPic", pic);
            commit("setCurrentPlayIndex", index);
            commit("setSongTitle", songTitle);
            commit("setSingerName", singerName);
            commit("setLyric", lyric);
            commit("setSingerId",singerId);
        },

        // 清空当前信息
        clearAll: ({commit}) => {
            commit("setIsPlay", false);
            commit("setSongUrl", '');
            commit("setSongPic", 'https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg');
            commit("setSongTitle", '');
            commit("setSingerName", '');
            commit("setCurrentPlayIndex", 0);
            commit("setCurrentPlayList", []);
        },

        // 记录当前歌单的搜索信息
        keepSheetInfo: ({commit}, {pageNum, cat}) => {
            commit("setPageNum", pageNum);
            commit("setCat", cat);
        },

        // 记录当前歌手的搜索信息
        keepSingerPage: ({commit}, {pageNum}) => {
            commit("setPageNum", pageNum);
        }


    },
});
