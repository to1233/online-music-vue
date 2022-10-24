import { getCurrentInstance } from "vue";

export default  function () {

    const { proxy } = getCurrentInstance() as any;

    /**
     *  更新播放的歌曲信息
     * @param song 歌曲信息 {id: row.id, url: result[0].url,pic: resizeBy[0].al.picUrl,index:1, songTitle: row.title,singerName: row.artist,lyric: ''}
     * @param currentSongList 当前歌曲集合
     */
    function playMusic(song : SongInfo, currentSongList) {

        const {id,url,pic,index,lyric,songTitle,singerName  } = song;
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
    }

    return {
        playMusic,
    };
}
