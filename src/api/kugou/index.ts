import {service as request,getBaseURL} from "@/utils/request";

import {kugou_convert} from "@/utils/common";
import song from "@/store/song";

/**
 * 搜索歌曲 接口
 * @param data  { s:string,搜索关键词}
 */
function searchSongs(keyword, page) {
    return request({
        url: 'kuGou/song/findSongList',
        method: 'post',
        data: {keyWords: keyword,page: page}
    }).then(resizeBy => {
        let cloudSongList = [];
        if (resizeBy.lists && resizeBy.lists.length > 0) {
            cloudSongList  = resizeBy.lists.map(kugou_convert).filter(item => {
                return item.disabled == false
            });
        }
        return {data: cloudSongList}
    });
}

/**
 * 查询歌曲的详情信息
 * @param songId 歌曲id
 */
function findSongInfoById(row) {
    return request({
        url: 'kuGou/song/findSongUrl',
        method: 'post',
        data: {songId: row.id, albumId: row.album_id}
    }).then(resizeBy => {
        return {data: resizeBy.play_url,imgUrl: resizeBy.img,lyric:resizeBy.lyrics};
    })
}




/**
 * 尝试查询Vip 歌曲
 * @param songId
 */
function findSongUrlVipById(songId) {
    return request({
        url: `kuGou/song/findSongUrlVip/${songId}`,
        method: 'get',
    }).then(resizeBy => {
        if(resizeBy.status == "1") {
            return {data: resizeBy.url,imgUrl: resizeBy.imgUrl};
        }
    })
}


/**
 * 根据歌曲id来查询出对应的歌曲的歌词
 * @param songId 歌曲id
 */
function findSongLyricById(row) {
    return request({
        url: 'kuGou/song/lyric',
        method: 'post',
        data: {'songId': row.id,'albumId': row.album_id}
    })
}



/**
 * 数据源标识
 */
const meta = {name: '酷狗', enName: 'kugou'}


export default {
    searchSongs,
    meta,
    findSongLyricById,
    findSongInfoById
}
