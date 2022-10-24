<template>
    <el-form ref="updateForm" label-with="70px" :model="registerForm" :rules="SignUpRules">
        <el-form-item prop="username" label="用户名">
            <el-input v-model="registerForm.userName" placeholder="用户名"></el-input>
        </el-form-item>

        <el-form-item label="性别">
            <el-radio-group v-model="registerForm.sex">
                <el-radio :label="0">女</el-radio>
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">保密</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item prop="birth" label="生日">
            <el-date-picker type="date" placeholder="选择日期" v-model="registerForm.birth" style="width: 100%"></el-date-picker>
        </el-form-item>

        <el-form-item prop="introduction" label="签名">
            <el-input type="textarea" placeholder="签名" v-model="registerForm.introduction"></el-input>
        </el-form-item>

        <el-form-item prop="location" label="地区">
            <el-select v-model="registerForm.location" placeholder="地区" style="width: 100%">
                <el-option v-for="item in this.AREA" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item prop="phoneNum" label="手机">
            <el-input v-model="registerForm.phoneNum" placeholder="手机"></el-input>
        </el-form-item>

        <el-form-item prop="email" label="邮箱">
            <el-input v-model="registerForm.email" placeholder="邮箱"></el-input>
        </el-form-item>

        <el-form-item>
            <el-button @click="goBack(-1)">取消</el-button>
            <el-button type="primary" @click="saveMsg()">保存</el-button>
        </el-form-item>
    </el-form>
</template>

<script >
    import { defineComponent} from "vue";
    import {mapGetters} from "vuex";
    import { AREA} from "@/enums";
    import { getUserId,updateUserMsg } from "@/api";

    export default  defineComponent({
        methods: {
            // 保存表单信息
            saveMsg() {
                this.registerForm.id = this.userId;
                updateUserMsg(this.registerForm).then(res => {
                    if (res) {
                        this.$message.success("更新成功");
                        this.$store.commit("setUserName",this.registerForm.userName);
                        this.$router.go(-1);
                    }

                })
            }
        },
        created()  {
            // 获取用户详情信息
            getUserId(this.userId).then(res => {
               this.registerForm = res;
            });
        },
        data() {
            return {
                registerForm : {
                    userName: '',
                    sex: '',
                    phoneNum: '',
                    email: '',
                    birth: new Date(),
                    introduction: '',
                    location: '',
                    userPic: '',
                    id: ''
                },
                AREA: AREA,
            }
        },
        computed: {
          ...mapGetters([
              'userId',
          ])
        },
    })


</script>
