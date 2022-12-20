<template>
    <div class="sheetDetail">
        <el-page-header @back="goBack" title="返回">
            <template #content>
                <span class="text-large font-600 mr-3"> {{songDetails.title}} </span>
            </template>

            <el-container>

                <el-aside class="album-slide">
                    <el-image class="album-img" fit="contain" :src="songDetails.pic"/>
                    <h3 class="album-info">{{songDetails.title}}</h3>
                    <el-divider></el-divider>
                    <el-row :gutter="40">

                        <el-col :span="5">
                            <el-tooltip
                                    class="box-item"
                                    effect="dark"
                                    content="播放全部"
                                    placement="top"
                            >
                                <el-button type="info" :icon="CaretRight" @click="showAll" circle></el-button>
                            </el-tooltip>
                        </el-col>

                        <el-col :span="5">
                            <el-tooltip
                                    class="box-item"
                                    effect="dark"
                                    content="收藏"
                                    placement="top"
                            >
                                <el-button type="warning" :icon="Star" circle @click="collectSongSheet" ></el-button>
                            </el-tooltip>
                        </el-col>
                    </el-row>
                </el-aside>
                <el-main>
                    <h1>简介</h1>
                    <!-- 歌曲-->
                    <PlayList :playList="currentSongList" @changeDataList="changeDataList"></PlayList>
                </el-main>

            </el-container>

        </el-page-header>
    </div>

</template>

<script lang="ts">
    import {Search, Position, Star, FolderAdd, CaretRight} from '@element-plus/icons-vue'
    import {defineComponent} from "vue";
    import {mapGetters} from "vuex";
    import PlayList from "@/components/PlayList.vue";
    import Client from "@/api/client";
    import {  saveUserSongSheet } from "@/api/backInfo"
    import { cloud_convert } from "@/utils/common.ts";

    export default defineComponent({
        created() {
            this.sheetId = this.$route.query["itemId"] as string;
            // 查询歌单详情信息
            Client.findSheetInfoById(this.sheetId,'netease').then(res => {
                this.songDetails.pic = res.playlist.coverImgUrl;
                this.songDetails.title = res.playlist.name;
                this.currentSongList = res.playlist.tracks.map(cloud_convert).filter(item => {
                    return !item.disabled
                }); // 歌单中的歌曲信息
            })
        },
        setup() {
            return {
                Search,
                Position,
                Star,
                FolderAdd,
                CaretRight
            }
        },
        components: {
            PlayList,
        },
        methods: {

            // 回退到上一个路由
            goBack() {
                this.$router.go(-1);
            },

            /**
             * 将当前的歌单下的歌曲信息替换掉临时列表中
             */
            showAll() {
                this.$store.dispatch('clearAll');
                if(this.currentSongList.length > 0) {
                    const song = this.currentSongList[0];
                    // 获取歌曲的播放链接
                    Client.findSongUrlById(song.id, song.source).then(result => {
                        const songInfo = song;
                        songInfo .url = result.data,
                         songInfo.pic = songInfo.pic == '' ? result.imgUrl : songInfo.pic,
                        this.currentSongList[0] =songInfo;
                        this.$store.dispatch('playMusicList',this.currentSongList);
                    });

                }
            },

            // 子集修改集合数据之后重新赋值给父级
            changeDataList(changeData) {
                this.currentSongList = changeData;
            },

            // 将歌单收藏到数据库中
            collectSongSheet(row) {
                if (this.token) {
                    saveUserSongSheet(this.sheetId,this.songDetails.title).then(resizeBy => {
                         this["$message"].success("保存成功");
                    });
                } else {
                    // 弹出登录窗口
                    this["$message"].warn("请先登录");
                    this.$store.commit("setSignInDiaLog",true);
                }

            },
        },
        data() {
            return {
                currentSongList: [], // 当前歌单的音乐
                sheetId: "", // 歌单ID,
                score: 0, //
                rank: 0,
                disabledRank: false,
                songDetails: {
                    pic: '', // 歌单图片
                    title: '', // 歌单名称

                },
            }
        },
        computed: {
            ...mapGetters([
                "token"
            ])
        },
    })


</script>


<style lang="scss" scoped>
    @import "@/assets/css/var.scss";

    /**
     左右边界
     */
    .sheetDetail {
        margin: 0 1rem;
    }


    .album-slide {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 20px;


        .album-img {
            height: 250px;
            width: 250px;
            border-radius: 10%;
        }

        .album-info {
            width: 70%;
            padding-top: 2rem;
        }
    }

    .album-main {
        h1 {
            font-size: 22px;
        }

        p {
            color: rgba(0, 0, 0, 0.5);
            margin: 10px 0 20px 0px;
        }

        /*歌单打分*/
        .album-score {
            display: flex;
            align-items: center;
            margin: 1vw;

            h3 {
                margin: 10px 0;
            }

            span {
                font-size: 60px;
            }

            & > div:last-child {
                margin-left: 10%;
            }
        }

        .album-body {
            margin: 20px 0 20px 0px;
        }
    }

    @media screen and (min-width: $sm) {
        .album-main {
            min-width: 600px;
            padding-right: 10vw;
            margin-left: 400px;
        }
    }

    @media screen and (max-width: $sm) {
        .album-slide {
            display: none;
        }
    }
</style>
