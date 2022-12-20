import {service as request } from '@/utils/request';
import {kuwo_convert} from "@/utils/common";

/**
 * 查询酷我对应的歌曲信息
 * @param keyword 搜索关键词
 */
function searchSongs(keyword, page) {
    return request({
        url: 'kuwo/song/findSongList',
        data: {keyWords: keyword, page: page},
        method: 'post',
    }).then(resizeBy => {
        let cloudSongList = [];
        if (resizeBy.data.list && resizeBy.data.list.length > 0) {
            cloudSongList = resizeBy.data.list.map(kuwo_convert);
        }
        // 循环处理歌曲信息
        return {data: cloudSongList}
    });
}

/**
 * 查询歌曲的详情信息
 * @param songId 歌曲id
 */
function findSongDetailById(songId) {
    return request({
        url: `kuwo/song/detail/${songId}`,
        method: 'get',
    })
}

/**
 * 查询歌曲的详情信息
 * @param songId 歌曲id
 */
function findSongUrlById(songId) {
    return request({
        url: `kuwo/song/findSongUrl/${songId}`,
        method: 'get',
    }).then(resizeBy => {
        return {data: resizeBy};
    })
}


/**
 * 查询歌手的详情信息
 * @param singerId 歌手id
 */
function getSingerInfoById(singerId) {
    return request({
        url: `kuwo/singer/findSingerDetailById/${singerId}`,
        method: 'get',
    }).then(resizeBy => {
        console.log(resizeBy);
        let singerDetail = resizeBy.artist;
        // 艺术家个人信息
        const artist = {
            picUrl: singerDetail.pic,
            briefDesc: singerDetail.info.substring(0,400),
            name: singerDetail.name // 歌手姓名
        };
        // 艺术家个人歌曲
        return {artist: artist, songs: resizeBy.songs.list.map(kuwo_convert) }
    })
}



/**
 * 数据源标识
 */
const meta = {name: '酷我', enName: 'kuwo'}


export default {
    meta,
    searchSongs,
    findSongDetailById,
    findSongUrlById,
    getSingerInfoById,
}
