// 解析播放时间
export function formatSeconds(value) {
    let theTime = parseInt(value);
    let theTime1 = 0;
    let theTime2 = 0;
    if (theTime > 60) {
        theTime1 = parseInt((theTime / 60).toString()); // 分
        theTime = parseInt((theTime % 60).toString()); // 秒
        // 是否超过一个小时
        if (theTime1 > 60) {
            theTime2 = parseInt((theTime1 / 60).toString()); // 小时
            theTime1 = 60; // 分
        }
    }
    // 多少秒
    let result = "";
    if (parseInt(theTime.toString()) < 10) {
        result = "0:0" + parseInt(theTime.toString());
    } else {
        result = "0:" + parseInt(theTime.toString());
    }
    // 多少分钟时
    if (theTime1 > 0) {
        if (parseInt(theTime.toString()) < 10) {
            result = "0" + parseInt(theTime.toString());
        } else {
            result = parseInt(theTime.toString()).toString();
        }
        result = parseInt(theTime1.toString()) + ":" + result;
    }
    // 多少小时时
    if (theTime2 > 0) {
        if (parseInt(theTime.toString()) < 10) {
            result = "0" + parseInt(theTime.toString());
        } else {
            result = parseInt(theTime.toString()).toString();
        }
        result = parseInt(theTime2.toString()) + ":" + parseInt(theTime1.toString()) + ":" + result;
    }
    return result;
}


// 解析歌词
export function parseLyric(text) {
    let lines = text.split("\n");
    const pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g;
    const result = [];

    // 对于歌词格式不对的特殊处理
    if (!/\[.+\]/.test(text)) {
        return [[0, text]];
    }

    while (!pattern.test(lines[0])) {
        lines = lines.slice(1);
    }

    lines[lines.length - 1].length === 0 && lines.pop();
    for (const item of lines) {
        const time = item.match(pattern); // 存前面的时间段
        const value = item.replace(pattern, ""); // 存歌词
        for (const item1 of time) {
            const t = item1.slice(1, -1).split(":");
            if (value !== "") {
                result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
            }
        }
    }
    result.sort((a, b) => a[0] - b[0]);
    return result;
}

// 解析日期
export function getBirth(value) {
    if (value == null || value == "") return "";
    const date = new Date(value);
    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return year + "-" + month + "-" + day;
}


/**
 * 将网易云的数据转化为统一的数据
 * @param allowAll
 */
export function cloud_convert(songInfo,index) {

    return ({
        id: `${songInfo.id}`,
        songTitle: songInfo.name,
        singerName: songInfo.ar[0].name,
        singerId: `${songInfo.ar[0].id}`,
        album: songInfo.al.name,
        album_id: `nealbum_${songInfo.al.id}`,
        source: 'netease',
        sourceName: '网易云',
        source_url: songInfo.al.picUrl,
        pic: songInfo.al.picUrl,
        url: '',
        index: index,
        disabled:songInfo.fee ==1 ||songInfo.fee ==4 ,
    });
}

/**
 * 将酷我的后端歌曲信息统一转化格式
 * @param song
 */
export function kuwo_convert(song) {
    return ({
        id: song.rid,
        songTitle: song.name,
        singerName: song.artist,
        singerId: song.artistid,
        album: song.album,
        album_id: song.albumid,
        source: 'kuwo',
        sourceName: '酷我',
        source_url: '',
        pic: song.pic,
        url: '',
        lyric_url: song.FileHash,
    })
}

/**
 * 将后台的qq 歌曲转化为统一的歌曲信息
 * @param song
 */
export function  qq_convert(song) {
    return ({
        id: song.songmid,
        songTitle: song.songname,
        singerName: song.singer[0].name,
        singerId: song.singer[0].id,
        album: song.albumname,
        album_id: `kgalbum_${song.albumid}`,
        pic: qqGetImageUrl(song.albummid, 'album'),
        source: 'qq',
        sourceName: 'QQ',
        source_url: '',
        disabled: !qqIsPlayable(song)
    })
}


export function kugou_convert(song) {
    return ({
        id: song.FileHash,
        songTitle: song.SongName,
        singerName: song.SingerName,
        singerId: song.SingerId,
        album: song.AlbumName,
        album_id: song.AlbumID,
        pic: '',
        source: 'kugou',
        sourceName: '酷狗',
        source_url: `http://www.kugou.com/song/#hash=${song.FileHash}&album_id=${song.AlbumID}`,
        disabled: false,
        lyric_url: song.FileHash,
    })

}

/**
 * 获取qq 歌曲封面图
 * @param qqimgid
 * @param imgType
 */
function qqGetImageUrl(qqimgid, imgType) {
    if (qqimgid == null) {
        return '';
    }
    let category = '';

    if (imgType === 'artist') {
        category = 'mid_singer_300';
    }
    if (imgType === 'album') {
        category = 'mid_album_300';
    }

    const s = [
        category,
        qqimgid[qqimgid.length - 2],
        qqimgid[qqimgid.length - 1],
        qqimgid,
    ].join('/');
    const url = `http://imgcache.qq.com/music/photo/${s}.jpg`;

    return url;
}

function qqIsPlayable(song) {
    const switchFlag = song.switch.toString(2).split('');

    switchFlag.pop();
    switchFlag.reverse();
    const playFlag = switchFlag[0];
    // 当前标志位
    return playFlag === '1';
}

