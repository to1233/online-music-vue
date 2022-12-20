import {service as request, getBaseURL} from '@/utils/request';
import {cloud_convert} from "@/utils/common";


/**
 * 搜索歌曲 接口
 * @param data  { s:string,搜索关键词}
 */
function searchSongs(keyword, page) {
    return request({
        url: 'cloud/song/findSongList',
        method: 'post',
        data: {s: keyword,offset: (page-1)*15}
    }).then(resizeBy => {
        let cloudSongList = [];
        if (resizeBy.songs && resizeBy.songs.length > 0) {
            cloudSongList = resizeBy.songs.map(cloud_convert).filter(item => {
                return item.disabled == false
            });
        }

        return {data: cloudSongList}
    });
}

/**
 * 下拉框热搜
 */
function hotSearchList() {
    return request({
        url: 'cloud/song/hotSearch',
        method: 'get',
    }).then(resizeBy => {
        console.log(resizeBy);
        let hots = resizeBy.hots == undefined ? [] : resizeBy.hots.map(item => {
            return {
                value: item.first,
                id: item.first
            }
        })
        return {data: hots}
    });
}


/**
 * 联想搜索歌曲信息
 * @param data 搜索信息
 */
function searchSongSuggest(keyword) {
    return request({
        url: 'cloud/song/searchSuggest',
        method: 'post',
        data: {s: keyword}
    }).then(resizeBy => {

        // 存在三种类型 songs  artists albums
        let songArr = resizeBy.songs == undefined ? [] : resizeBy.songs.map(item => {
            return {
                value: item.name,
                id: item.id
            }
        });

        let artistArr = resizeBy.artists == undefined ? [] : resizeBy.artists.map(item => {
            return {
                value: item.name,
                id: item.id
            }
        });

        let albumArr = resizeBy.albums == undefined ? [] : resizeBy.albums.map(item => {
            return {
                value: item.name,
                id: item.id
            }
        });
        return {data: [...songArr, ...artistArr, ...albumArr]};
    })
}

/**
 * 根据歌单类型来查询出对应的歌单数据
 * @param data 搜索以及分页信息 {offset: (page-1)* limit ,limit: 20 ,type: '全部歌单')}
 *
 */
function getSongSheetList(pageNum, cat) {
    return request({
        url: 'cloud/songSheet/findSongSheet',
        method: 'post',
        data: {offset: (pageNum - 1) * 20, cat: cat}
    })
}


/**
 * 根据歌单id来查询对应的歌单详情
 * @param data 歌单信息
 */
function findSheetInfoById(sheetId) {
    return request({
        url: `cloud/songSheet/findSheetInfoById`,
        method: 'post',
        data: {id: sheetId}
    })
}

/**
 * 根据歌曲id来查询出对应的歌曲详情信息
 * @param songId 歌曲id
 */
function findSongDetailById(songId) {
    return request({
        url: `cloud/song/detail/${songId}`,
        method: 'get',
    })
}

/**
 * 根据歌曲id来查询对应的歌曲Url
 * @param songId 歌曲id
 */
function findSongUrlById(songId) {
    return request({
        url: `cloud/song/findSongUrl/${songId}`,
        method: 'get',
    }).then(resizeBy => {
        return {data: resizeBy[0].url}
    })
}

/**
 * 分页查询热门歌手信息
 * @param data {offset: (pageNum -1) * limit, limit :18}
 */
function getSingerList(pageNum) {
    return request({
        url: 'cloud/singer/top/list',
        method: 'post',
        data: {offset: (pageNum - 1) * 20, limit: 20}
    })
}

/**
 * 根据歌手id来查询歌手信息详情
 * @param singerId 歌手id
 */
function getSingerInfoById(singerId) {
    return request({
        url: `cloud/singer/findSingerDetailById/${singerId}`,
        method: 'post',
        data: {}
    }).then(resizeBy => {
        let cloudSongList = resizeBy.hotSongs.map(cloud_convert).filter(item => {
            return item.disabled == false
        });
        return {songs: cloudSongList, artist: resizeBy.artist}
    })
}

/**
 * 根据歌单id来查询出对应的歌曲集合
 * @param sheetId 歌单id
 */
function findSongListBySheetId(sheetId) {
    return request({
        url: `cloud/songSheet/findSongListBySheetId/${sheetId}`,
        method: 'get',
    })
}


/**
 * 查询对应的歌单评分
 * @param sheetId 歌单id
 */
export function findRankBySheetId(sheetId) {
    return request({
        url: `cloud/songSheet/findRankBySheetId/${sheetId}`,
        method: 'get',
    })
}

/**
 * 用户登录
 * @param userInfo
 */
export function loginByUserName(userInfo) {
    return request({
        url: 'loginByUserName',
        method: 'post',
        data: userInfo,
    })
}


/**
 * 用户登录 手机登录
 * @param userInfo
 */
export function loginByPhone(userInfo) {
    return request({
        url: 'loginByPhone',
        method: 'post',
        data: userInfo,
    })
}

// 更新用户头像
export function uploadUrl(userId) {
    return `${getBaseURL()}/user/avatar/update?id=${userId}`;
}

/**
 * 注册信息
 */
export function signUp(userInfo) {
    return request({
        url: 'signUp',
        method: 'post',
        data: userInfo,
    })
}


/**
 * 更新用户信息
 * @param userInfo 待更新的用户信息
 */
export function updateUserMsg(userInfo) {
    return request({
        url: 'user/updateUserMsg',
        method: 'post',
        data: userInfo
    })
}

/**
 * 更新用户密码
 * @param passwordInfo
 */
export function updateUserPassword(passwordInfo) {
    return request({
        url: 'user/updatePassword',
        method: 'post',
        data: passwordInfo
    })
}



/**
 * 根据歌手名来查询歌曲集合
 * @param singerName 歌手名
 */
export function getSongOfSingerName(singerName) {
    return request({
        url: `song/singerName/${singerName}`,
        method: 'get'
    })
}

export function getSongOfSingerId(singerId) {
    return request({
        url: `song/singer/detail/${singerId}`,
        method: 'get'
    })
}

/**
 * 根据歌单名字来查询出对应的歌单信息
 * @param title
 */
export function getSongSheetOfLikeTitle(title) {
    return request({
        url: `songSheet/likeTitle/${title}`,
        method: 'get'
    })
}


/**
 * 数据源标识
 */
const meta = {name: '网易云', enName: 'netease'}

export default {
    meta,
    searchSongSuggest,
    getSongSheetList,
    findSheetInfoById,
    findSongDetailById,
    findSongUrlById,
    hotSearchList,
    searchSongs,
    getSingerList,
    getSingerInfoById,
    findSongListBySheetId
}
