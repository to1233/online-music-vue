<template>

    <div class="common-layout">
        <el-container>
            <el-aside >
                <MyHeader></MyHeader>
            </el-aside>
            <el-main>
                <router-view />
                <PlayBar></PlayBar>
                <CurrentPlayList></CurrentPlayList>
                <MyAudio></MyAudio>
            </el-main>
        </el-container>
    </div>
</template>
<script lang="ts" setup>
    import { getCurrentInstance } from "vue";
    import MyHeader from "@/components/layouts/MyHeader.vue";
    const { proxy } = getCurrentInstance();
    import PlayBar from "@/components/layouts/PlayBar.vue";
    import MyAudio from "@/components/layouts/MyAudio.vue";
    import CurrentPlayList from "@/components/layouts/CurrentPlayList.vue";
    if (sessionStorage.getItem("dataStore")) {
        proxy.$store.replaceState(Object.assign({}, proxy.$store.state, JSON.parse(sessionStorage.getItem("dataStore"))));
    }

    window.addEventListener("beforeunload", () => {
        sessionStorage.setItem("dataStore", JSON.stringify(proxy.$store.state));
    });
</script>

<style lang="scss" scoped>

    .el-container {
        min-height: calc(100% - 60px);
    }
    .el-header {
        padding: 0;
    }
    .el-main {
        padding-left: 0;
        padding-right: 0;
    }
</style>
