<template>
    <div class="personal">
        <div class="personal-info">
            <div @click="changeDialog()">
                <el-image  class="personal-img" fit="contain" :src="userPic" />
            </div>

            <div class="personal-msg">
                <div class="userName" > {{ personalInfo.userName}}</div>
                <div class="introduction"> {{ personalInfo.introduction}}</div>
            </div>
            <el-button class="edit-info" round @click="goPage()">修改个人信息</el-button>
        </div>

        <div class="personal-body">
            <el-tabs type="card">
                <el-tab-pane label="我的歌曲" class="content">
                    <PlayList :playList="collectSongList" @changeDataList="changeDataList"   @deleteCollectSong="deleteCollectSong" :isOwn="true"></PlayList>

                    <el-pagination
                            class="pagination"
                            background
                            layout="total, prev, pager, next"
                            :current-page="songCollect.pageNum"
                            :page-size="songCollect.pageSize"
                            :total="songCollect.total"
                            @current-change="handleCurrentChange"
                    >
                    </el-pagination>
                </el-tab-pane>

                <el-tab-pane label="我的歌单" class="content">

                    <!-- 收藏的歌单列表-->
                    <el-table :data="songSheetList" style="width: 100%" stripe @row-click="handleSongDetail"
                              @cell-mouse-enter="cellMouseEnter"
                              @cell-mouse-leave="cellMouseLeave">
                        <el-table-column prop="name" label="歌单名" width="540">
                        </el-table-column>
                        <el-table-column prop="collectTime" label="收藏时间" width="540">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template #default="scope">
                                <div v-if="scope.row.hoverFlag" style="font-size: 30px">
                                    <el-tooltip class="item" effect="dark" content="移除" placement="top" >
                                        <el-icon>
                                            <DocumentDelete style=" margin-right: 8px" @click="deleteCollectSongSheet(scope.row)"/>
                                        </el-icon>
                                    </el-tooltip>

                                    <el-tooltip class="item" effect="dark" content="链接" placement="top">
                                        <el-icon>
                                            <Paperclip style=" margin-right: 8px"/>
                                        </el-icon>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-pagination
                            class="pagination"
                            background
                            layout="total, prev, pager, next"
                            :current-page="songSheetCollect.pageNum"
                            :page-size="songSheetCollect.pageSize"
                            :total="songSheetCollect.total"
                            @current-change="handleCurrentChange"
                    >
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
        </div>

        <el-dialog v-model="dialogTableVisible" title="修改头像">
            <Upload></Upload>
        </el-dialog>

    </div>
</template>
<script lang="ts">
    import PlayList from "@/components/PlayList.vue";
    import {defineComponent} from "vue";
    import Upload from "../setting/Upload.vue";
    import {mapGetters} from "vuex";
    import {attachImageUrl, getUseCollSongList, getUserId,getCollectInfoSongSheet,deleteCollectSongSheet,deleteCollectSong} from "@/api/backInfo";

    export default defineComponent({
        components: {
            PlayList,
            Upload
        },
        methods: {
            goPage() {
                this.$router.push("/setting");
            },
            changeDialog() {
                this.dialogTableVisible  = !this.dialogTableVisible;
                console.log(this.dialogTableVisible);
            },
            getUserInfo(id) {
                getUserId(id).then(res => {
                    this.personalInfo = res;
                })
            },
            // 照片路径
            imageUrl(pic) {
                return attachImageUrl(pic);
            },

            // 子集修改集合数据之后重新赋值给父级
            changeDataList(changeData) {
                this.collectSongList = changeData;
            },
            // 移除hover的事件
            cellMouseLeave() {
                for (let index = 0; index < this.songSheetList.length; index++) {
                    const element = this.songSheetList[index];
                    element['hoverFlag'] = false
                }
            },
            // 鼠标进入某一行
            cellMouseEnter(row, column, cell, event) {
                // 注意必须是使用两次深拷贝 因为 hoverFlag 属性不是tableData原有的 则直接修改无效  所以两次深拷贝重新赋值
                for (let index = 0; index < this.songSheetList.length; index++) {
                    const element = this.songSheetList[index]
                    if (element.id == row.id) {
                        element['hoverFlag'] = true
                    } else {
                        element['hoverFlag'] = false
                    }
                }
            },
            // 跳转到歌单详情页面
            handleSongDetail(row, event, column) {
                this.$router.push({path: '/song-sheet-detail', query: {itemId: row.songSheetId}} );
            },
            // 移除对应的歌单数据
            deleteCollectSongSheet(row) {
                deleteCollectSongSheet(row.songSheetId).then(res => {
                     this["$message"].success("移除成功");
                    // 分页查询用户收藏的歌曲信息
                    getCollectInfoSongSheet(this.userId, this.songSheetCollect.pageNum, this.songSheetCollect.pageSize).then(res => {
                        this.songSheetList = res.records;
                        this.songSheetCollect.total = res.total;
                    })
                })
            },
            // 移除对应的歌曲信息
            deleteCollectSong(songId) {
                deleteCollectSong(songId).then(res => {
                    this["$message"].success("移除成功");
                    // 分页查询用户收藏的歌曲信息
                    getUseCollSongList(this.userId, this.songCollect.pageNum, this.songCollect.pageSize).then(res => {
                        this.collectSongList = res.records;
                        this.songCollect.total = res.total;
                    })

                })
            }
        },
        created(): void {
            this.getUserInfo(this.userId);
            // 分页查询用户收藏的歌曲信息
            getUseCollSongList(this.userId, this.songCollect.pageNum, this.songCollect.pageSize).then(res => {
                this.collectSongList = res.records;
                this.songCollect.total = res.total;
            })

            // 分页查询用户收藏的歌曲信息
            getCollectInfoSongSheet(this.userId, this.songSheetCollect.pageNum, this.songSheetCollect.pageSize).then(res => {
                this.songSheetList = res.records;
                this.songSheetCollect.total = res.total;
            })
        },
        data() {
            return {
                personalInfo: {
                    userName: "",
                    userSex: "",
                    birth: "",
                    location: "",
                    introduction: "",
                },
                dialogTableVisible: false,
                collectSongList: [],
                // 收藏歌曲分页信息
                songCollect: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 100,
                },
                // 收藏歌单分页信息
                songSheetCollect: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 100,
                },
                songSheetList: [], // 歌单集合
            }
        },
        computed: {
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
            height: $header-height + 200px;
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
