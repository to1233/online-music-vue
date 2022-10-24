<template>
    <div class="content">
        <el-table highlight-current-row :data="songList" @row-click="handleClick">
            <el-table-column prop="name" label="歌曲" />
            <el-table-column prop="singerName" label="歌手" />
            <el-table-column prop="introduction" label="专辑" />
        </el-table>
    </div>
</template>

<script lang="ts">
    import { defineComponent,toRefs } from "vue";
    import mixin  from '@/mixins/mixin';
    export default  defineComponent({
        props:{
            songList: Array
        },
        emits: ["changeData"],
        setup(props){
            // 更改store 状态
            const { playMusic } = mixin();
            const { songList } = toRefs(props);
           function  handleClick(row) {
                playMusic(row,songList);
            }
           return {
               handleClick
           }
        },
    })


</script>


<style lang="scss" scoped>
    @import "@/assets/css/var.scss";
    @import "@/assets/css/global.scss";

    .content {
        background-color: $color-white;
        border-radius: $border-radius-songlist;
        padding: 10px;
    }

    .content:deep(.el-table__row.current-row) {
        color: $color-black;
        font-weight: bold;
    }

    .content:deep(.el-table__row) {
        cursor: pointer;
    }

    .icon {
        @include icon(1.2em, $color-black);
    }
</style>
