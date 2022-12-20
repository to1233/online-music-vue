<template>
    <div>
        <el-form ref="signUpForm" label-width="70px" status-icon :model="registerForm" :rules="SignUpRules">
            <el-form-item prop="username" label="用户名">
                <el-input v-model="registerForm.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="密码">
                <el-input type="password" placeholder="密码" v-model="registerForm.password"></el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword" label="确认密码">
                <el-input type="password" placeholder="密码" v-model="registerForm.confirmPassword"></el-input>
            </el-form-item>
            <el-form-item prop="sex" label="性别">
                <el-radio-group v-model="registerForm.sex">
                    <el-radio :label="0">女</el-radio>
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="2">保密</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="phoneNum" label="手机">
                <el-input placeholder="手机" v-model="registerForm.phoneNum"></el-input>
            </el-form-item>
            <el-form-item prop="email" label="邮箱">
                <el-input v-model="registerForm.email" placeholder="邮箱"></el-input>
            </el-form-item>
            <el-form-item prop="birth" label="生日">
                <el-date-picker type="date" placeholder="选择日期" v-model="registerForm.birth" style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item prop="introduction" label="签名">
                <el-input type="textarea" placeholder="签名" v-model="registerForm.introduction"></el-input>
            </el-form-item>
            <el-form-item class="sign-btn">
                <el-button type="primary" @click="handleSignUp()">注册</el-button>
                <el-button  @click="cancel(formRef)">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import { defineComponent } from "vue";
    import { getCurrentInstance, reactive } from "vue";
    import { AREA } from "@/enums";
    import { signUp} from "@/api/client";
    export default  defineComponent({
        emits: ["closeSignUpDialog"],
        setup() {
            const { proxy } = getCurrentInstance();

            const registerForm = reactive({
                username: "",
                password: "",
                sex: "",
                phoneNum: "",
                email: "",
                birth: new Date(),
                introduction: "",
                location: "",
            });

            // 注册并登录
            function handleSignUp() {
                signUp(registerForm).then(res => {
                   console.log(res);
                });
            }


            // 取消
            function cancel() {
                proxy.$emit("closeSignUpDialog");
            }
            return {
                registerForm,
                handleSignUp,
                cancel,
                AREA
            };

        }
    });
</script>
