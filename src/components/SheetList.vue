<!-- 引用组件为Singer.vue 或者SongSheet.vue -->
<template>
    <div class="play-list play-list-container">
        <ul class="play-body">
            <li class="card-frame" v-for="(item, index) in dataList" :key="index">
                <div class="card" @click="showDetail(item)">
                    <el-image class="card-img" fit="contain" :src="item.coverImgUrl+'?param=300y300'"/>
                    <div class="mask" @click="showDetail(item)">
                        <MyMusicIcon class="mask-icon" :icon="BOFANG"></MyMusicIcon>
                    </div>
                </div>
                <p class="card-name">{{ item.name}}</p>
            </li>
        </ul>
        <el-pagination
                class="pagination"
                background
                layout="total, prev, pager, next"
                :current-page="queryParams.pageNum"
                :page-size="queryParams.limit"
                :total="total"
                @current-change="handleCurrentChange"
        >
        </el-pagination>

    </div>


</template>
<script lang="ts">
    import MyMusicIcon from "@/components/layouts/MyMusicIcon.vue";
    import {defineComponent} from 'vue';
    import {getSongSheetList, getSingerList} from '@/api';
    import {Icon} from "@/enums";
    import {mapGetters} from "vuex";

    export default defineComponent({
        name: 'Home',
        components: {
            MyMusicIcon
        },
        props: {
            dataType: {
                type: String,
                default: 'singer'
            }, // 其中 包含 singer  歌手  sheet 歌单
        },
        computed: {
            ...mapGetters([
                'pageNum', // 歌单当前页码
                'cat', // 歌单种类
            ])
        },
        setup() {
            const BOFANG = Icon.BOFANG;
            return {
                BOFANG,
            }
        },
        data() {
            return {
                // 总条数
                total: 0,
                dataList: [],
                // 查询参数
                queryParams: {
                    pageNum: 1,
                    limit: 18,
                    offset: 0,
                    cat: '全部歌单'
                },
            }
        },
        created() {
            this.queryParams.pageNum = this.pageNum;
            this.queryParams.cat = this.cat;
            this.getPageData();
        },
        methods: {
            // 获取当前页
            handleCurrentChange(val) {
                this.queryParams.pageNum = val;
                this.getPageData();
            },
            // 修改分页歌单种类
            changeSheet(sheetTypeName) {
                // 归回第一页
                this.queryParams.pageNum = 1;
                this.queryParams.cat = sheetTypeName;
                // 记录当前的分页参数
                this.$store.dispatch("keepSheetInfo", this.queryParams);
                this.getPageData();
            },

            // 分页获取歌单数据
            getPageData() {
                this.queryParams.offset = (this.queryParams.pageNum - 1) * this.queryParams.limit;

                // 分页查询对应的歌手信息
                if (this.dataType == "singer") {
                    // 记录当前的分页参数
                    this.$store.dispatch("keepSingerPage", this.queryParams);
                    getSingerList(this.queryParams).then(res => {
                        this.dataList = res.artists.map(this.convertSinger());
                        this.total = 300;
                    })
                } else {
                    this.$store.dispatch("keepSheetInfo", this.queryParams);
                    getSongSheetList(this.queryParams).then(res => {
                        this.dataList = res.playlists;
                        this.total = res.total;
                    })
                }
            },

            // 将对应的歌手信息转化成统一
            convertSinger() {
                return (singerInfo) => ({
                    id: singerInfo.id,
                    name: singerInfo.name,
                    coverImgUrl: singerInfo.picUrl
                })
            },

            // 跳转到对应的详情页面
            showDetail(row) {
                if (this.dataType == "singer") {
                    // 记录当前的分页参数
                    this.$store.dispatch("keepSingerPage", this.queryParams);
                    this.$router.push({path: '/singer-detail', query: {itemId: row.id}})
                } else {
                    // 记录当前的分页参数
                    this.$store.dispatch("keepSheetInfo", this.queryParams);
                    this.$router.push({path: '/song-sheet-detail', query: {itemId: row.id}})
                }

            }
        }
    });


</script>

<style lang="scss" scoped>

    .play-list {
        padding: 0 1rem 1rem 1rem;
    }

    .play-list-container {
        margin: 0 8% 30px 8%;
    }

    ul, li {
        list-style: none;
    }

    .play-body {
        display: flex;
        justify-content: flex-start;
        align-items: stretch;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .card-frame {
        width: 13%;
        margin: 0.5rem 1%;

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
    }

    .mask {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 5px;
        background-color: rgba(52, 47, 41, 0.4);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        flex-wrap: nowrap;
        transition: all 0.3s ease-in-out;
        opacity: 0;
    }

    .mask-icon {
        width: 2em;
        height: 2em;
        font-size: 2em;
        color: rgba(240, 240, 240, 1);
        fill: currentColor;
        overflow: hidden;
        position: relative;
    }

</style>
