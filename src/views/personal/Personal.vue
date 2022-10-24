<template>
    <div class="personal">
        <div class="personal-info">
            <el-image class="personal-img" fit="contain" :src="imageUrl(userPic)" @click="dialogTableVisible = true"/>
            <div class="personal-msg">
                <div class="userName"> {{ personalInfo.userName}}</div>
                <div class="introduction"> {{ personalInfo.introduction}}</div>
            </div>
            <el-button class="edit-info" round :icon="Edit" @click="goPage()">修改个人信息</el-button>
        </div>

        <div class="personal-body">
            <SongList :songList="collectSongList" :show="true" @changeData="changeData"></SongList>
        </div>

        <el-dialog v-model="dialogTableVisible" title="修改头像">
            <Upload></Upload>
        </el-dialog>

    </div>
</template>
<script lang="ts">
    import SongList from "@/views/song/SongList.vue";
    import { attachImageUrl, getUserId, getUseCollSongList } from "@/api";
    import { defineComponent} from "vue";
    import Upload from "../setting/Upload.vue";
    import {mapGetters} from "vuex";
    export default  defineComponent({
        components : {
            SongList,
            Upload
        },
        methods: {
            goPage() {
                this.$router.push("/setting");
            },
            getUserInfo(id) {
                getUserId(id).then(res => {
                    this.personalInfo = res;
                })
            },
            // 照片路径
            imageUrl(pic) {
                return  attachImageUrl(pic);
            }
        },
        created(): void {
            this.getUserInfo(this.userId);
            getUseCollSongList(this.userId).then(res =>{
                this.collectSongList = res;
            })
        },
        data() {
            return {
                personalInfo : {
                    userName: "",
                    userSex: "",
                    birth:"",
                    location:"",
                    introduction: "",
                },
                dialogTableVisible: false,
                collectSongList: [],
            }
        },
        computed : {
            ...mapGetters([
                "userId", // 用户id
                "userPic", // 用户头像
            ])
        },
        watch: {
          userPic() {
              this.dialogTableVisible = false;
          }
        },
    })
</script>

<style lang="scss" scoped>
    @import "@/assets/css/var.scss";

    .personal {
        padding-top: $header-height + 150px;

        &::before {
            content: "";
            background-color: $color-blue-shallow;
            position: absolute;
            top: 0;
            width: 100%;
            height: $header-height + 150px;
        }
    }

    .personal-info {
        position: relative;
        margin-bottom: 60px;
        .personal-img {
            height: 200px;
            width: 200px;
            border-radius: 50%;
            border: 5px solid $color-white;
            position: absolute;
            top: -180px;
            left: 50px;
            cursor: pointer;
        }
        .personal-msg {
            margin-left: 300px;
            position: absolute;
            top: -120px;

            .userName {
                font-size: 50px;
                font-weight: 600;
            }

            .introduction {
                font-size: 20px;
                font-weight: 500;
            }
        }
        .edit-info {
            position: absolute;
            right: 10vw;
            margin-top: -120px;
        }
    }

    @media screen and (min-width: $sm) {
        .personal-body {
            padding: 0px 100px;
        }
    }

    @media screen and (max-width: $sm) {
        .edit-info {
            display: none;
        }
    }
</style>
