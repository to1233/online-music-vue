<template>
    <div class="setting">
        <h1>设置</h1>
        <el-tabs tab-position="left">
            <el-tab-pane label="个人资料" class="content">
                <PersonalData></PersonalData>
            </el-tab-pane>

            <el-tab-pane label="更改密码" class="content">
                  <Password></Password>
            </el-tab-pane>

            <el-tab-pane label="账号和安全" class="content">
                <el-button type="danger" @click="cancelAccount">注销账号</el-button>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import {defineComponent} from "vue";
    import {deleteUser} from "@/api";
    import {mapGetters} from "vuex";
    import PersonalData from "./PersonalData";
    import Password from "./Password";


    export default defineComponent({
        components :{
            PersonalData,
            Password
        },
        methods: {
            // 注销账号
            cancelAccount() {
                this.$messageBox.confirm(
                    '确定注销当前账号吗?',
                    'Warning',
                    {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning',
                    }
                )
                    .then(() => {
                        deleteUser(this.userId).then(res => {
                            if (res) {
                                this.$message.success("注销成功");
                                this.$store.commit("setUserId", false);
                            } else {
                                this.$message.error("注销失败");
                            }
                        });
                    })
                    .catch(() => {
                        this.$message.warn("操作取消")
                    })
            }
        },

        data() {
            return {}
        },
        computed: {
            ...mapGetters([
                "userId"
            ])
        }
    })

</script>


<style lang="scss" scoped>
    @import "@/assets/css/var.scss";
    @import "@/assets/css/global.scss";

    h1 {
        border-bottom: 1px solid $color-grey;
    }

    .content {
        padding-top: 20px;
        text-align: center;
    }

    @media screen and (min-width: $sm) {
        .setting {
            margin: 30px 10%;
            margin-top: 0;
            padding: 20px;
            min-height: 60vh;
        }
    }

    @media screen and (max-width: $sm) {
        .setting {
            padding: 20px;
        }
    }
</style>
