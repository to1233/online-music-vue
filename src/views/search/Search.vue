<template>
    <div class="search">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="歌曲" name="song">
                <SongList :songList="songsBySinger"></SongList>
            </el-tab-pane>
            <el-tab-pane label="歌单" name="sheet">
                <SongList :songList="songListByTitle"></SongList>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import {defineComponent} from "vue";
    import SongList from "../song/SongList";
    import { getSongOfSingerName, getSongSheetOfLikeTitle} from "@/api";
    export default defineComponent({
        components: {
            SongList
        },
        methods: {
            handleClick() {
                console.log('1231');
            },

        },
        data() {
            return {
                activeName: 'song',
                searchKeyWord: '',
                songsBySinger: [],
                songSheetByTitle: [],
            }
        },
        // 获取对应的数据
        created() {
            this.searchKeyWord = this.$route.query["keywords"];
            getSongOfSingerName(this.searchKeyWord).then(resizeBy => {
                this.songsBySinger =resizeBy;
            });

            getSongSheetOfLikeTitle(this.searchKeyWord).then(resizeBy => {
                this.songSheetByTitle = resizeBy;
            });

        }
    })

</script>

<style lang="scss" scoped>
    @import "@/assets/css/var.scss";
    @import "@/assets/css/global.scss";

    .search {
        margin: auto;
        width: 900px;

        .search-list {
            min-height: 480px;
        }
    }
</style>
