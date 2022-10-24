<template>
    <div class="my-header">
            <el-menu
                    :default-active="activeIndex"
                    class="el-menu-vertical-demo"
                    :ellipsis="false"
                    @select="handleSelect"
            >
                <el-menu-item  index="/" >首页</el-menu-item>
                <el-menu-item  index="/song-sheet">歌单</el-menu-item>
                <el-menu-item  index="/singer">歌手</el-menu-item>
                <el-menu-item  index="/search" path="search">
                    <el-input :prefix-icon="Search"  v-model="keywords"  label="搜索" placeholder="搜索" style="margin-top: 10px" @keyup.enter="goSearch()"></el-input>
                </el-menu-item>
                <!-- 左右分割线-->
                <div class="flex-grow" />
                <el-menu-item v-if="!token" index="/sign-in" path="sign-in">登录</el-menu-item>
                <el-menu-item  v-if="!token" index="/sign-up" path="sign-up">注册</el-menu-item>
                <el-image class="user" fit="contain"  :src="attachImageUrl(userPic)" v-if="token" />
                <el-sub-menu index="3" v-if="token">
                        <template #title>{{userName}}</template>
                        <el-menu-item index="/personal">个人信息</el-menu-item>
                        <el-menu-item index="3-2">设置</el-menu-item>
                        <el-menu-item index="/logout">注销</el-menu-item>
                </el-sub-menu>
            </el-menu>


        <el-dialog v-model="dialogFormVisible" width="20%"   >
            <SignIn @changeData="changeData"></SignIn>
        </el-dialog>

        <!-- 注册用户 -->
        <el-dialog v-model="dialogRegisVisible" width="20%"   >
            <SignUp @changeData="changeData"></SignUp>
        </el-dialog>


    </div>
</template>

<script lang="ts">
    import { defineComponent,ref,getCurrentInstance ,computed } from 'vue';
    import SignIn from "@/views/SignIn.vue";
    import SignUp from "@/views/SignUp.vue";
    import { useStore } from "vuex";
    import { attachImageUrl} from "@/api";
    import {setToken, removeToken} from "@/utils/auth";
    export default defineComponent({
        name: 'MyHeader',
        components: {
            SignUp,
            SignIn
        },
        setup() {
            const store = useStore();
            const activeIndex = ref('1');
            const token = computed(() => store.getters.token);
            const userPic = computed(() =>store.getters.userPic);
            const userName = computed(() =>store.getters.userName);

            const keywords = ref(""); // 搜索的值

            const { proxy } = getCurrentInstance() as any;

            const dialogFormVisible = ref(false);

            // 注册窗口
            const dialogRegisVisible = ref(false);

            const handleSelect = (index: string, path: string) => {
                if (checkRouter(index)) {
                    if (index == "/sign-in") {
                        dialogFormVisible.value = true;
                    } else if( index == "/sign-up") {
                        dialogRegisVisible.value = true;
                    }else if (index =="search" ) {
                        return ;
                    } else {
                        // 登录退出
                        logOut();
                    }
                } else {
                    proxy.$router.push({path: index, query: {}});
                }
            }


            function checkRouter(aimIndex) {
                const preventIndexList = ["/sign-in","/sign-up","/search"];
                return preventIndexList.includes(aimIndex);
            }



            function goSearch() {
                if (keywords.value !== "") {
                    proxy.$router.push({path: '/search', query: {keywords: keywords.value  }});
                } else {
                    (proxy as any).$message({
                        message: "搜索内容不能为空",
                        type: "error",
                    });
                }
            }

            // 注销登录
            function logOut() {
                // 移除token
                removeToken();
                proxy.$store.commit("setToken",false);
            }


            // 登录成功后的回调
            function changeData() {
                dialogFormVisible.value = false;
                proxy.$store.commit("setToken",true);
            }

            return {
                activeIndex,
                handleSelect,
                token,
                dialogFormVisible,
                dialogRegisVisible,
                attachImageUrl,
                userPic,
                userName,
                changeData,
                goSearch,
                keywords
            }
        }

    });
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    @import "@/assets/css/var.scss";
    .flex-grow {
        flex-grow: 1;
    }
/*
    !**
      顶部导航栏样式
     *!
    .my-header{
        position: fixed;
        width: 100%;
        height: 60px;
        line-height: 60px;
        margin: 0;
        background-color: #fefefe;
        box-shadow: 0 0 10px rgb(0 0 0 / 40%);
        box-sizing: border-box;
        z-index: 100;
        !*display: flex;*!
        white-space: nowrap;
        flex-wrap: nowrap;
    }*/

    .user {
        width: $header-user-width;
        height: $header-user-width;
        border-radius: $header-user-radius;
    }
</style>
