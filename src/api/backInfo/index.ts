// 记录用户信息
import {service as request, getBaseURL} from '@/utils/request';

/**
 * 记录当前用户的暂存的歌曲信息
 * @ param playList 暂存歌单信息
 */
function saveUserTempPlayList(playList) {
    return request({
        url: 'sys/saveUserTempPlayList',
        method: 'post',
        data: playList
    });
}

/**
 * 将当前歌曲信息保存到后台
 * @param songInfo 歌曲信息
 */
function saveUserSongInfo(songInfo) {
    return request({
        url: 'sys/saveUserSongInfo',
        method: 'post',
        data: songInfo
    });
}

/**
 * 将用户信息注册到后台
 * @param userInfo 用户信息
 */
function registerUser(userInfo) {
    return request({
        url: 'sys/register',
        method: 'post',
        data: userInfo
    });
}

/**
 * 获取图片的拼接前缀
 */
function attachImageUrl(url) {
    return url ? `${getBaseURL()}/${url}` : "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png";
}


/**
 * 登录信息
 * @param userInfo
 */
function loginByUserName(loginVo) {
    return request({
        url: 'sys/login',
        method: 'post',
        data: loginVo
    });
}

/**
 * 获取用户收藏的歌曲列表
 * @param id 用户id
 */
function getUseCollSongList(userId, pageNum, pageSize) {
    return request({
        url: 'sys/getCollectInfoSong',
        method: 'post',
        data: {'userId': userId, 'pageNum': pageNum, 'pageSize': pageSize}
    })
}

function getCollectInfoSongSheet(userId,pageNum,pageSize) {
    return request({
        url: 'sys/getCollectInfoSongSheet',
        method: 'post',
        data: {'userId': userId, 'pageNum': pageNum, 'pageSize': pageSize}
    })

}


/**
 * 根据用户id来查询用户详情信息
 * @param id 用户id
 */
function getUserId(id) {
    return request({
        url: `sys/detail/${id}`,
        method: 'get',
    })
}

/**
 * 更新用户信息
 * @param userInfo 更新后的用户信息
 */
function updateUserMsg(userInfo) {
    return request({
        url: 'sys/updateUserInfo',
        method: 'post',
        data: userInfo
    })
}

/**
 * 更新用户的密码
 * @param passWordForm 更新密码操作,其中 {userId,oldPassword,newPassword,confirmPassword}
 */
function updateUserPassword(passWordForm) {
    return request({
        url: 'sys/updateUserPassword',
        method: 'post',
        data: passWordForm
    })
}


/**
 * 注销当前用户id
 * @param userId
 */
function deleteUser(userId) {
    return request({
        url: `sys/deleteUser/${userId}`,
        method: 'get'
    })

}


/**
 * 保存歌单信息
 * @param songSheetId 歌单id
 * @param name 歌单名称
 */
function saveUserSongSheet(songSheetId,name) {
    return request({
        url: 'sys/saveUserSongSheet',
        method: 'post',
        data: {'songSheetId' :songSheetId, 'name' : name}
    })
}

/**
 * 移除对应的歌单历史信息
 * @param collectSheetId 歌单历史记录的id
 */
function deleteCollectSongSheet(collectSheetId) {
    return request({
        url: 'sys/deleteCollectSongSheet/'+collectSheetId,
        method: 'delete',
    })
}

/**
 * 移除对应的歌单历史信息
 * @param collectSheetId 歌单历史记录的id
 */
function deleteCollectSong(songId) {
    return request({
        url: 'sys/deleteCollectSong/'+songId,
        method: 'delete',
    })
}

// 更新用户头像
function uploadUrl(userId) {
    return `${getBaseURL()}/sys/uploadHead/${userId}`;
}





export {
    loginByUserName,
    attachImageUrl,
    saveUserTempPlayList,
    registerUser,
    getUseCollSongList,
    getUserId,
    updateUserPassword,
    updateUserMsg,
    deleteUser,
    saveUserSongSheet,
    getCollectInfoSongSheet,
    deleteCollectSongSheet,
    deleteCollectSong,
    saveUserSongInfo,
    uploadUrl
}
