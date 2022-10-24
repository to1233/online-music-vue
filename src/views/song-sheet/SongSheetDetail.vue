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
                                <el-button type="info" :icon="CaretRight" circle></el-button>
                            </el-tooltip>
                        </el-col>


                        <el-col :span="5">
                            <el-tooltip
                                    class="box-item"
                                    effect="dark"
                                    content="添加到我的歌单"
                                    placement="top"
                            >
                                <el-button type="success" :icon="FolderAdd" circle></el-button>
                            </el-tooltip>
                        </el-col>

                        <el-col :span="5">
                            <el-tooltip
                                    class="box-item"
                                    effect="dark"
                                    content="收藏"
                                    placement="top"
                            >
                                <el-button type="warning" :icon="Star" circle></el-button>
                            </el-tooltip>
                        </el-col>
                        <el-col :span="5">
                            <el-tooltip
                                    class="box-item"
                                    effect="dark"
                                    content="链接"
                                    placement="top"
                            >
                                <el-button type="danger" :icon="Position" circle></el-button>
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
    import {findSheetInfoById, attachImageUrl} from "@/api";

    export default defineComponent({
        created() {
            this.sheetId = this.$route.query["itemId"] as string;
            // 查询歌单详情信息
            findSheetInfoById({id: this.sheetId}).then(res => {
                this.songDetails.pic = res.playlist.coverImgUrl;
                this.songDetails.title = res.playlist.name;
                this.currentSongList = res.playlist.tracks.map(this.convert()).filter(item => {
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
            imageUrl(pic) {
                return attachImageUrl(pic);
            },

            // 回退到上一个路由
            goBack() {
                this.$router.go(-1);
            },

            // 子集修改集合数据之后重新赋值给父级
            changeDataList(changeData) {
                this.currentSongList = changeData;
            },
            convert() {
                return (songInfo) => ({
                    id: `${songInfo.id}`,
                    title: songInfo.name,
                    artist: songInfo.ar[0].name,
                    artist_id: `${songInfo.ar[0].id}`,
                    album: songInfo.al.name,
                    album_id: `nealbum_${songInfo.al.id}`,
                    source: 'netease',
                    source_url: `http://music.163.com/#/song?id=${songInfo.id}`,
                    img_url: songInfo.al.picUrl,
                    url: `netrack_${songInfo.id}`,
                    disabled: songInfo.st < 0,
                });
            }
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
                "userId"
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
