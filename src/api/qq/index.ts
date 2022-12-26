import {service as request} from '@/utils/request';
import {qq_convert} from "@/utils/common";
import axios from "axios";


/**
 * 分页查询歌曲信息
 * @param keyword 搜索关键词
 * @param page 分页信息
 */
function searchSongs(keyword, page) {
    return request({
        url: 'qq/song/findSongList',
        data: {keyWords: keyword, page: page},
        method: 'post',
    }).then(resizeBy => {
        let cloudSongList = [];
        if (resizeBy.data.song.list && resizeBy.data.song.list.length > 0) {
             cloudSongList = resizeBy.data.song.list.map(qq_convert).filter(item => {
                return item.disabled == false
            });
            ;
            // 循环处理歌曲信息
        }
        return {data: cloudSongList}
    });
}



function findSongUrlById(songId) {
    return request({
        url: `qq/song/findSongUrl/${songId}`,
        method: 'get',
    }).then(resizeBy => {
        if (resizeBy.req_0.data.midurlinfo[0].purl === '') {
            return '';
        }
        return {data: resizeBy.req_0.data.sip[0] + resizeBy.req_0.data.midurlinfo[0].purl}
    })
}
/**
 * 根据歌曲id来查询出对应的歌曲的歌词
 * @param songId 歌曲id
 */
function findSongLyricById(songID) {
    return request({
        url: `qq/song/findSongLyric/${songID}`,
        method: 'get',
    })
}



function findSongInfoById({id}) {
    return axios.all([findSongUrlById(id), findSongLyricById(id)])
        .then(axios.spread(function (acct, perms) {
            // 两个请求现在都执行完成
            return {data: acct.data,lyric: perms};
        }));
}


const meta = {name: 'qq', enName: 'qq'}

export default {
    meta,
    searchSongs,
    findSongUrlById,
    findSongInfoById
}


