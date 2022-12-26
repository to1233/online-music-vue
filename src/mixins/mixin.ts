import {computed, getCurrentInstance} from "vue";
import {useStore} from "vuex";
import Client from "@/api/client";

export default  function () {

    const { proxy } = getCurrentInstance() as any;

    /**
     *  更新播放的歌曲信息
     * @param song 歌曲信息 {id: row.id, url: result[0].url,pic: resizeBy[0].al.picUrl,index:1, songTitle: row.title,singerName: row.artist,lyric: ''}
     * @param currentSongList 当前歌曲集合
     */
    function playMusic(song : SongInfo, currentSongList) {

        const {id,url,pic,index,lyric,songTitle,singerName  } = song;
        if (url && url !=undefined) {
            proxy.$store.dispatch('playMusic', {
                id,
                url,
                pic,
                index,
                songTitle,
                singerName,
                lyric,
                currentSongList,
            });
        } else {
            const store = useStore();
            const currentPlayList = computed(() => store.getters.currentPlayList); // 当前播放
            // 获取歌曲的播放链接
            Client.findSongInfoById(song, song.source).then(result => {
                if (result.data =='') {
                    (proxy  as any).message.warn("可用链接为空,播放下一首")
                    return;
                }
                const songInfo = song;
                songInfo .url = result.data,
                songInfo.pic = songInfo.pic == '' ? result.imgUrl : songInfo.pic,
                currentPlayList[index] =songInfo;
                (proxy  as any).$store.commit("setCurrentPlayList", currentPlayList);
                (proxy  as any).$store.dispatch("playMusic", songInfo);
            });
        }




    }
    return {
        playMusic,
    };
}
