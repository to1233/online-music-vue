<template>
    <div class="home">
        <el-row :span="24">
            <el-col :span="12">
                <div class="searchComponent">
                    <el-autocomplete
                            v-model="searchWords"
                            :fetch-suggestions="querySearchAsync"
                            :popper-append-to-body="false"
                            placeholder="搜索"
                            @select="startSearch"
                            @keydown.enter="startSearch"
                    />
                </div>
            </el-col>
        </el-row>
        <!--tab页显示-->
        <el-row>
            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleChange" stretch>
                <el-tab-pane label="所有音乐" name="all">
                    <PlayList :activeName="activeName" :playList="songList" @changeDataList="changeDataList" :isAll="true"></PlayList>
                </el-tab-pane>
                <el-tab-pane label="网易云音乐" name="netease">
                    <PlayList :activeName="activeName" :playList="songList" @changeDataList="changeDataList"></PlayList>
                </el-tab-pane>
                <el-tab-pane label="酷我音乐" name="kuwo">
                    <PlayList :activeName="activeName" :playList="songList" @changeDataList="changeDataList"></PlayList>
                </el-tab-pane>
              <!--  <el-tab-pane label="QQ音乐" name="qq">
                    <PlayList :activeName="activeName" :playList="songList" @changeDataList="changeDataList"></PlayList>
                </el-tab-pane>-->
                <el-tab-pane label="酷狗音乐" name="kugou">
                    <PlayList :activeName="activeName" :playList="songList" @changeDataList="changeDataList"></PlayList>
                </el-tab-pane>

                <el-pagination @current-change="handleCurrentChange" v-model:current-page="currentPage2" background
                               layout="prev, pager, next" :total="100"/>
            </el-tabs>
        </el-row>

    </div>
</template>

<script lang="ts">
    import {defineComponent, ref, getCurrentInstance} from 'vue';
    import PlayList from "@/components/PlayList.vue";
    import Client from "@/api/client";

    export default defineComponent({
        name: 'Home',
        components: {
            PlayList
        },
        setup() {
            // 歌曲id
            const songList = ref([]); // 歌单列表
            const activeName = ref('netease');
            const searchWords = ref(''); // 搜索关键词
            const result = ref([]);
            const {proxy} = getCurrentInstance();

            const currentPage2 = ref(1);

            /**
             * 触发联想搜索
             */
            function startSearch() {
                searchSongs(activeName.value, 1); // 搜索歌曲信息
            }

            async function searchSongs(activeName, currentPage) {
                if (searchWords.value == '') {
                    (proxy as any).$message({
                        message: "搜索内容不能为空哦",
                        type: "warning",
                    });
                    return;
                }
                if (activeName != "all") {
                    Client.searchSongs(searchWords.value, currentPage, activeName).then(result => {
                        songList.value = result.data;
                    });
                } else {
                    let result = await Client.searchSongsAll(searchWords.value, currentPage);
                    songList.value = result;
                }
            }

            const handleCurrentChange = (val: number) => {
                searchSongs(activeName.value, val); // 搜索歌曲信息
            }


            /**
             * 联想搜索
             * @param queryString 查询对应的文件
             * @param cb 回调函数
             */
            async function querySearchAsync(queryString: string, cb: (arg: any) => void) {
                if (queryString == '' || queryString == undefined) {
                    await hotSearchList('netease');
                    cb(result.value);
                } else {
                    await searchRemote(queryString, 'netease');
                    cb(result.value);
                }
            }

            /**
             * 远程搜索联想
             * @param queryString 关键词
             */
            async function searchRemote(queryString, sourceName) {
                // 联想搜索
                await Client.searchSongSuggest(queryString, sourceName).then(resizeBy => {
                    result.value = resizeBy.data;
                });
            }


            /**
             * 展示对应的热搜
             **/
            async function hotSearchList(sourceName) {
                // 联想搜索
                await Client.hotSearchList(sourceName).then(resizeBy => {
                    result.value = resizeBy.data;
                });
            }


            /**
             * 网易云---校验是否可以播放
             * @param song 歌曲信息
             */
            function isPlayable(song) {
                return getNEScore(song) < 10;
            }

            function getNEScore(song) {
                if (!song) return 0;
                const privilege = song.privilege;

                if (song.program) return 0;

                if (privilege) {
                    if (privilege.st != null && privilege.st < 0) {
                        return 100;
                    }
                    if (
                        privilege.fee > 0 &&
                        privilege.fee !== 8 &&
                        privilege.payed === 0 &&
                        privilege.pl <= 0
                    )
                        return 10;
                    if (privilege.fee === 16 || (privilege.fee === 4 && privilege.flag & 2048))
                        return 11;
                    if (
                        (privilege.fee === 0 || privilege.payed) &&
                        privilege.pl > 0 &&
                        privilege.dl === 0
                    )
                        return 1e3;
                    if (privilege.pl === 0 && privilege.dl === 0) return 100;

                    return 0;
                }

                if (song.status >= 0) return 0;
                if (song.fee > 0) return 10;

                return 100;
            }

            // 子集修改集合数据之后重新赋值给父级
            function changeDataList(changeData) {
                songList.value = changeData;
            }

            /**
             * 切换tab页面的时候
             * @param tabPaneName 切换标签后的数据
             * @param event
             */
            function handleChange(tabPaneName, event) {
                searchSongs(tabPaneName.props.name, 1);
            }


            // 歌单id
            return {
                songList,
                activeName,
                searchWords,
                startSearch,
                querySearchAsync,
                changeDataList,
                handleChange,
                currentPage2,
                handleCurrentChange
            }
        }
    });
</script>

<style lang="scss" scoped>

    .demo-tabs{
        margin-bottom: 2rem;
    }

    .el-tabs {
        flex: auto;
        --el-tabs-header-height: 40px;
    }

    ::v-deep .el-autocomplete {
        width: 50% !important;
        position: relative;
        display: inline-block;
    }

    .searchComponent {
        margin-left: 2rem;
    }


</style>
