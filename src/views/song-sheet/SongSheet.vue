<template>
    <div class="play-list play-list-container">
        <el-tag v-for="item in this.SheetTypeEnums" :type="item.name === this.cat ? 'success' : ''" class="sheetType"  @click="changeSheetType(item.name)">{{item.name}}</el-tag>
        <el-divider />
        <!-- 歌单列表--->
       <SheetList dataType="sheet" ref="sheetList"></SheetList>
    </div>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import SheetList from "@/components/SheetList.vue";
    import {mapGetters} from "vuex";
    import {SheetTypeEnums} from "@/enums";
    export default defineComponent({
        name: 'Home',
        components: {
            SheetList
        },
        setup() {
            return {
                SheetTypeEnums
            }
        },
        computed: {
          ...mapGetters([
              'pageNum', // 歌单当前页码
              'cat',
          ])
        },
        methods: {
            // 修改分页歌单种类
            changeSheetType(sheetTypeName) {
                (this.$refs.sheetList as any).changeSheet(sheetTypeName);
            },
        }
    });
</script>
<style lang="scss" scoped>
    /**
  歌单分类标签样式
  */
    .sheetType {
        margin: 0 1rem;
    }

</style>
