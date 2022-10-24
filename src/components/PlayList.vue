<!-- 歌曲列表组件,数据源为 playList,所以子组件调用都需要将数据转化好 并且实现 @changeDataList 事件 -->
<template>
    <div class="play-list">
        <el-table :data="playList" style="width: 100%" stripe @row-click="handleSong" @cell-mouse-enter="cellMouseEnter"
                  @cell-mouse-leave="cellMouseLeave">
            <el-table-column prop="title" label="歌曲名" width="180"/>
            <el-table-column prop="artist" label="歌手" width="180"/>
            <el-table-column prop="album" label="专辑名"/>
            <el-table-column label="操作">
                <template #default="scope">
                    <div v-if="scope.row.hoverFlag" style="font-size: 30px">
                        <el-tooltip class="item" effect="dark" content="添加到播放列表" placement="top">
                            <el-icon>
                                <Plus style=" margin-right: 8px"/>
                            </el-icon>
                        </el-tooltip>

                        <el-tooltip class="item" effect="dark" content="添加到我的歌单" placement="top">
                            <el-icon>
                                <DocumentAdd style=" margin-right: 8px"/>
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

</template>

<script lang="ts">
    import {defineComponent, getCurrentInstance, toRefs, computed} from 'vue';
    import {attachImageUrl, findSongDetailById, findSongUrlById} from "@/api";
    import {mapGetters, useStore} from "vuex";
    import {DocumentAdd, Paperclip, Plus} from '@element-plus/icons-vue';

    export default defineComponent({
        props: {
            playList: Array,
            path: String,
        },
        emits: ["changeDataList"],
        setup(props) {
            const {proxy} = getCurrentInstance();
            const store = useStore();
            const currentPlayList = computed(() => store.getters.currentPlayList); // 当前播放
            const currentPlayIndex = computed(() => store.getters.currentPlayIndex); // 当前歌曲在播放列表的位置
            const {path, playList} = toRefs(props);

            function goAblum(item) {
                // 这里歌手和歌单公用
                proxy.$router.push({path: `/${path.value}`, query: {itemId: item.id}});
            }

            // 点击某一行触发的事件 点击歌曲
            function handleSong(row, event, column) {
                // 获取歌曲的url 和详情信息,显示当前的图片然后进行播放
                findSongDetailById(row.id).then(resizeBy => {
                    // 查询歌曲的详细信息
                    // 获取歌曲的播放链接
                    findSongUrlById(row.id).then(result => {
                        const songInfo = {
                            id: row.id,
                            url: result[0].url,
                            pic: resizeBy[0].al.picUrl,
                            index: 1,
                            songTitle: row.title,
                            singerName: row.artist,
                            singerId: row.artist_id,
                            lyric: ''
                        };
                        proxy.$store.dispatch("playMusic", songInfo);
                        if (currentPlayList.value.findIndex((v) => {
                            return v.id == row.id
                        }) == -1) {
                            //当前播放列表中没有此歌曲则向列表中添加
                            currentPlayList.value.splice(currentPlayIndex.value + 1, 0, songInfo);
                            proxy.$store.commit("setCurrentPlayList", currentPlayList.value);
                            proxy.$store.commit("setCurrentPlayIndex", currentPlayIndex.value + 1)
                        }
                    });
                });
            }


            // 鼠标进入某一行
            function cellMouseEnter(row, column, cell, event) {
                // 注意必须是使用两次深拷贝 因为 hoverFlag 属性不是tableData原有的 则直接修改无效  所以两次深拷贝重新赋值
                let Arr = JSON.parse(JSON.stringify(playList.value))
                for (let index = 0; index < Arr.length; index++) {
                    const element = Arr[index]
                    if (element.id == row.id) {
                        console.log('找到对应行')
                        element['hoverFlag'] = true
                    } else {
                        element['hoverFlag'] = false
                    }
                }
                proxy.$emit("changeDataList", JSON.parse(JSON.stringify(Arr)));
            }

            // 移除hover的事件
            function cellMouseLeave() {
                let Arr = JSON.parse(JSON.stringify(playList.value))
                for (let index = 0; index < Arr.length; index++) {
                    const element = Arr[index];
                    element['hoverFlag'] = false
                }
                proxy.$emit("changeDataList", JSON.parse(JSON.stringify(Arr)));
            }


            return {
                goAblum,
                handleSong,
                cellMouseEnter,
                cellMouseLeave,
                DocumentAdd,
                Paperclip,
                Plus
            };
        },
        methods: {
            imageUrl(pic) {
                return attachImageUrl(pic);
            }
        }

    });

</script>


<style lang="scss" scoped>

    @import "@/assets/css/var.scss";
    @import "@/assets/css/global.scss";

    .card-frame {
        .card {
            position: relative;
            height: 0;
            padding-bottom: 100%;
            overflow: hidden;
            border-radius: 5px;

            .card-img {
                width: 100%;
                transition: all 0.4s ease;
            }
        }

        .card-name {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            margin: 0.5rem 0;
        }

        &:hover .card-img {
            transform: scale(1.2);
        }
    }

    .mask {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 5px;
        background-color: rgba(52, 47, 41, 0.4);
        @include layout(center, center);
        transition: all 0.3s ease-in-out;
        opacity: 0;

        .mask-icon {
            @include icon(2em, rgba(240, 240, 240, 1));
        }

        &:hover {
            opacity: 1;
            cursor: pointer;
        }
    }

    @media screen and (min-width: $sm) {
        .card-frame {
            width: 18%;
            margin: 0.5rem 1%;
        }
    }

    @media screen and (max-width: $sm) {
        .card-frame {
            width: 46%;
            margin: 0.5rem 2%;
        }
    }
</style>
