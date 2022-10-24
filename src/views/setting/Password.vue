<template>
    <el-form ref="passwordForm" label-width="70px" :model="form" :rules="rules">
        <el-form-item label="旧密码" prop="oldPassword">
            <el-input type="password" v-model="form.oldPassword">
            </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
            <el-input type="password" v-model="form.newPassword"  />
        </el-form-item>

        <el-form-item label="密码确认" prop="confirmPassword">
            <el-input type="password" v-model="form.confirmPassword"></el-input>
        </el-form-item>

        <el-form-item>
            <el-button @click="clearData()">重置</el-button>
            <el-button type="primary" @click="confirm()">确认修改</el-button>
        </el-form-item>
    </el-form>

</template>

<script>
    import { defineComponent,computed } from "vue";
    import {mapGetters} from "vuex";
    import { updateUserPassword } from "@/api";

    export default  defineComponent({
        methods:{
            // 校验密码
            validatePassword(rule,value,callback) {
                if (value == "") {
                    callback(new Error("密码不能为空"))
                } else {
                    callback();
                }
            },
            // 校验密码相等
            validateCheck(rule,value,callback) {
                if (value == "") {
                    callback(new Error("密码不能为空"));
                } else if (value !== this.form.newPassword) {
                    callback(new Error("请输入正确密码"));
                } else {
                    callback();
                }
            },

            confirm() {
                let canRun = true;
                (this.$refs["passwordForm"]).validate((valid) => {
                    if (!valid) return (canRun = false);
                });

                if (!canRun) return ;
                this.form.userId = this.userId;

                // 更新密码
                updateUserPassword(this.form).then(resizeBy => {
                    this.$message.success("更新成功");
                    if (resizeBy) {
                        this.$route.go(-1);
                    }
                })
            },

            // 清空数据
            clearData() {
                this.form.oldPassword = "";
                this.form.newPassword = "";
                this.form.confirmPassword = "";
            }
        },
        data() {
            return {
                form: {
                    oldPassword: '',
                    newPassword : '',
                    confirmPassword:'',
                    userId:'',
                },
                rules: {
                    oldPassword: [{validator: this.validatePassword,trigger: "blur",min:3}],
                    newPassword: [{validator: this.validatePassword,trigger: "blur",min: 3}],
                    confirmPassword: [{validator: this.validateCheck, trigger:"blur",min: 3}],
                }
            }
        },
        computed :{
            ...mapGetters([
                'userId',
                'userName',
            ])
        },

    })


</script>
