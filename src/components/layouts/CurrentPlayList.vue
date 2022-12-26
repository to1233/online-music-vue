<template>
    <transition name="aside-fade">
        <div class="yin-current-play" id="currentPlay" v-if="showAside">
            <h2 class="title">当前播放</h2>
            <div class="control">
                <el-row>
                    <el-col :span="10">
                        共 {{ (currentPlayList && currentPlayList.length) || 0 }} 首
                    </el-col>

                    <el-col :span="10" @click="addMyMenu">
                        <el-icon>
                            <DocumentAdd/>
                        </el-icon>
                        添加到我的歌单
                    </el-col>
                    <el-col :span="4" @click="clearAll">
                        <el-icon>
                            <Delete/>
                        </el-icon>
                        清空
                    </el-col>
                </el-row>
            </div>

            <el-table :data="currentPlayList" style="width: 100%" stripe @row-click="playMusic"
                      @cell-mouse-enter="cellMouseEnter" @cell-mouse-leave="cellMouseLeave" :show-header="false"
                      empty-text="没有歌曲">
                <el-table-column prop="songTitle" label="歌曲名" width="140"/>
                <el-table-column prop="singerName" label="歌手"/>
                <el-table-column prop="album" label="专辑"/>
                <el-table-column label="操作">
                    <template #default="scope">
                        <div v-if="scope.row.hoverFlag" style="font-size: 30px">

                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <el-icon @click="deleteSong(scope.row)">
                                    <Delete style=" margin-right: 8px"/>
                                </el-icon>
                            </el-tooltip>

                            <el-tooltip class="item" effect="dark" content="链接" placement="top">
                                <el-icon>
                                    <Paperclip style=" margin-right: 8px"/>
                                </el-icon>
                            </el-tooltip>
                        </div>

                    </template>
                </el-table-column>
            </el-table>
        </div>
    </transition>
</template>

<script lang="ts">
    import {defineComponent, getCurrentInstance, computed, onMounted} from "vue";
    import {useStore} from "vuex";
    import {saveUserTempPlayList} from "@/api/backInfo";
    import mixin from "@/mixins/mixin";

    export default defineComponent({
        setup() {
            const {proxy} = getCurrentInstance();
            const store = useStore();
            const {playMusic} = mixin();

            const songId = computed(() => store.getters.songId); // 音乐 ID
            const currentPlayList = computed(() => store.getters.currentPlayList); // 当前播放
            const showAside = computed(() => store.getters.showAside); // 是否显示侧边栏
            const autoNext = computed(() => store.getters.autoNext); // 是否自动播放下一首

            const token = computed(() => store.getters.token);



            // 将当前歌曲添加到我的歌单中
            function addMyMenu() {
                // 如果已经登录则向后端发送请求并记录当前的歌单信息
                if(token.value) {
                    saveUserTempPlayList(currentPlayList.value).then(resizeBy => {
                        (proxy as any).$message({
                            message: "添加成功",
                            type: "success",
                        })
                    });
                } else {
                    (proxy as any).$message({
                        message: "请先登录",
                        type: "warn",
                    })
                    // 弹出登录窗口
                    proxy.$store.commit("setSignInDiaLog",true);
                }
            }

            // 清空当前的播放信息
            function clearAll() {
                proxy.$store.dispatch('clearAll');
            }

            // 将目标歌曲信息进行移除
            function deleteSong(row) {

                let Arr = JSON.parse(JSON.stringify(currentPlayList.value));
                let cloudSongList = Arr.filter(item => {
                    return item.id != row.id
                });
                proxy.$store.commit("setCurrentPlayList", JSON.parse(JSON.stringify(cloudSongList)));
                // 如果是删除的是正在播放的歌曲,则触发下一曲的方法
                proxy.$store.commit("setAutoNext", !autoNext.value);
            }

            // 鼠标进入某一行
            function cellMouseEnter(row, column, cell, event) {
                // 注意必须是使用两次深拷贝 因为 hoverFlag 属性不是tableData原有的 则直接修改无效  所以两次深拷贝重新赋值
                let Arr = JSON.parse(JSON.stringify(currentPlayList.value))
                for (let index = 0; index < Arr.length; index++) {
                    const element = Arr[index]
                    if (element.id == row.id) {
                        element['hoverFlag'] = true
                    } else {
                        element['hoverFlag'] = false
                    }
                }
                proxy.$store.commit("setCurrentPlayList", JSON.parse(JSON.stringify(Arr)));
            }

            // 移除hover的事件
            function cellMouseLeave() {
                let Arr = JSON.parse(JSON.stringify(currentPlayList.value))
                for (let index = 0; index < Arr.length; index++) {
                    const element = Arr[index];
                    element['hoverFlag'] = false
                }
                // proxy.$store.commit("setCurrentPlayList", JSON.parse(JSON.stringify(Arr)));
            }


            return {
                songId,
                currentPlayList,
                showAside,
                playMusic,
                cellMouseEnter,
                cellMouseLeave,
                deleteSong,
                clearAll,
                addMyMenu
            };
        },

    })
</script>
<style lang="scss" scoped>
    @import "@/assets/css/current-play.scss";
</style>
