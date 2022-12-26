import cloud from '../api/cloud/index';
import kuwo from '../api/kuwo/index' ;
import qq from '../api/qq/index';  // 垃圾腾讯云
import kugou from '../api/kugou/index';
/**
 * 可用客户端
 */
const availableProvider = [kuwo,cloud,  kugou];
const enableProvider = availableProvider;
const sourceNameProvider = {};


enableProvider.forEach((provider) => {
    sourceNameProvider[provider.meta.enName] = provider;
})

/**
 * 通过源名称来获取对应的对象
 * @param sourceName
 */
function getProviderName(sourceName) {
    return sourceNameProvider[sourceName] || '未支持的数据源'
}

/**
 * 导出对应的接口汇总类
 */
export default class Client {
    static getProviderName = getProviderName;

    /**
     * 搜索信息
     * @param keyword 关键词
     * @param page 当前页码
     * @param sourceName 搜索名称
     */
    static searchSongs(keyword, page, sourceName) {
        const provider = getProviderName(sourceName);
        return provider.searchSongs(keyword, page);
    }

    /**
     * 查询所有的关于此关键词的数据
     * @param keyword
     * @param page
     */
    static async searchSongsAll(keyword, page) {
        let resultAll = [];
        for (let sourceName in sourceNameProvider) {
            const provider = getProviderName(sourceName);
            await provider.searchSongs(keyword, page).then(result => {
                resultAll =  [...resultAll, ...result.data ];
            });
        }
        return resultAll
    }



    /**
     * 联想搜索
     * @param keyword 搜索关键词
     */
    static searchSongSuggest(keyword, sourceName) {
        const provider = getProviderName(sourceName);
        return provider.searchSongSuggest(keyword);
    }

    static findSongInfoById(row, sourceName) {
        const provider = getProviderName(sourceName);
        return provider.findSongInfoById(row)
    }

    static hotSearchList(sourceName) {
        const provider = getProviderName(sourceName);
        return provider.hotSearchList()
    }

    /**
     * 查询热门歌手信息
     * @param pageNum 当前页码
     * @param sourceName 源名称
     */
    static getSingerList(pageNum, sourceName) {
        const provider = getProviderName(sourceName);
        return provider.getSingerList(pageNum);
    }

    /**
     * 查询对应的歌单
     * @param pageNum
     * @param cat
     * @param sourceName
     */
    static getSongSheetList(pageNum, cat, sourceName) {
        const provider = getProviderName(sourceName);
        return provider.getSongSheetList(pageNum, cat);
    }

    /**
     * 查询对应的歌手信息
     * @param singerId 歌手id
     * @param sourceName 源类型
     */
    static getSingerInfoById(singerId, sourceName) {
        const provider = getProviderName(sourceName);
        return provider.getSingerInfoById(singerId);
    }

    /**
     * 查询对应歌单的详情信息
     * @param sheetId 歌单id
     * @param sourceName 源类型
     */
    static findSheetInfoById(sheetId, sourceName) {
        const provider = getProviderName(sourceName);
        return provider.findSheetInfoById(sheetId);
    }

}
