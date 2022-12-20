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
function findSongUrlById(songId) {
    return request({
        url: `kuGou/song/findSongUrl/${songId}`,
        method: 'get',
    }).then(resizeBy => {
        if(resizeBy.url =='') {
            resizeBy =  findSongUrlVipById(songId);
        }
        return {data: resizeBy.url,imgUrl: resizeBy.imgUrl};
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
 * 数据源标识
 */
const meta = {name: '酷狗', enName: 'kugou'}


export default {
    searchSongs,
    meta,
    findSongUrlById
}
