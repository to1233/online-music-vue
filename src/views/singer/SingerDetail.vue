<template>
    <div>
        <el-page-header @back="goBack" title="返回">
            <template #content>
                <span class="text-large font-600 mr-3"> {{songDetails.name}} </span>
            </template>
            <el-container>
                <el-aside class="album-slide">
                    <el-image class="singer-img" fit="contain" :src="songDetails.picUrl"/>
                </el-aside>
                <el-main class="album-main">
                    <p v-html="songDetails.briefDesc"></p>
                    <PlayList :playList="songList" @changeDataList="changeDataList"></PlayList>
                </el-main>
            </el-container>

        </el-page-header>
    </div>

</template>

<script lang="ts">
    import {defineComponent} from "vue";
    import PlayList from "@/components/PlayList.vue";
    import Client from "@/api/client";
    import {mapGetters} from "vuex";

    export default defineComponent({
        components: {
            PlayList,
        },
        methods: {
            // 子集修改集合数据之后重新赋值给父级
            changeDataList(changeData) {
                this.songList = changeData;
            },
            // 回退到上一个路由
            goBack() {
                this.$router.go(-1);
            },
        },
        computed: {
            ...mapGetters([
                'source',
            ])
        },
        created(): void {
            this.singerId = this.$route.query["itemId"] as string;
            // 搜索对应的歌曲,这里选择对应的数据源跳转到歌手详情信息
            Client.getSingerInfoById(this.singerId, this.source).then(resizeBy => {
                this.songDetails = resizeBy.artist;
                this.songList = resizeBy.songs;
                console.log(this.songList);
            })
        },
        data() {
            return {
                singerId: '1',
                songDetails: {
                    artist: {
                        picUrl: '',
                        briefDesc: '',
                    }
                },
                songList: [],
            }
        },
    });
</script>

<style lang="scss" scoped>
    @import "@/assets/css/var.scss";

    .album-slide {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 20px;

        .singer-img {
            height: 250px;
            width: 250px;
            border-radius: 10%;
        }

        .album-info {
            width: 60%;
            padding-top: 2rem;

            li {
                width: 100%;
                height: 30px;
                line-height: 30px;
            }
        }
    }

    .album-main {
        p {
            color: rgba(0, 0, 0, 0.5);
            margin: 10px 0 20px 0px;
        }
    }

    @media screen and (min-width: $sm) {
        .album-slide {
            position: fixed;
            width: 400px;
        }
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
