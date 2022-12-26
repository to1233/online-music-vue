<template>
    <div>
        <el-row :span="24" justify="space-around">
            <el-tabs >
                <el-tab-pane label="账号密码登录">
                    <!--账号密码登录表单-->
                    <el-form ref="pwdLoginFormRef" :model="pwdLoginForm" :rules="SignInRules" >
                        <!-- 用户名-->
                        <el-form-item prop="phone">
                            <el-input placeholder="手机号" clearable v-model="pwdLoginForm.phone" prefix-icon="User">

                            </el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input placeholder="密码" type="password" show-password prefix-icon="Lock" v-model="pwdLoginForm.password">

                            </el-input>
                        </el-form-item>
                        <!--按钮区域-->
                        <el-form-item class="login_btns">
                            <el-button type="primary" @click="pwdLogin" :loading="loading">登录</el-button>
                            <el-button type="primary" @click="toRegister"> 注册</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </el-row>
        <el-row justify="space-around">
            <div>
                登录即表示您已阅读并同意
                <a href="#">服务条款</a>
            </div>
        </el-row>

    </div>


</template>
<script lang="ts">
    import {defineComponent, getCurrentInstance, reactive} from "vue";
    import  {loginByUserName } from "@/api/backInfo";
    import { setToken } from "@/utils/auth";
    export  default  defineComponent({
        emits: ["changeData"],
        setup() {
            const { proxy } = getCurrentInstance() as any;

            const pwdLoginForm =   reactive({
                phone: "",
                password: "",
            });


            // 登录规则
            const validateName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error("手机号不能为空"));
                } else {
                    callback();
                }
            };

            const validatePassword = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("密码不能为空"));
                } else {
                    callback();
                }
            };

            const SignInRules = {
                phone: [{ validator: validateName, trigger: "blur", min: 3 }],
                password: [{ validator: validatePassword, trigger: "blur", min: 3 }],
            };

            const phoneLoginForm  = reactive({
                phone: "",
                password: "",
            });


            /*
            *  登录函数
            * */
            async function pwdLogin() {
                let canRun = true;
                (proxy.$refs["pwdLoginFormRef"] as any).validate((valid) => {
                    if (!valid){
                        return (canRun = false);
                    } else {
                        // 校验通过
                        try {
                            loginByUserName(pwdLoginForm).then(res => {
                                saveUserInfo(res);
                            });
                        } catch (error) {
                            console.error(error);
                        }
                    }
                });


            }

            function saveUserInfo(res) {
                proxy.$store.commit("setToken", true);
                proxy.$store.commit("setUserName", res.userName);
                proxy.$store.commit("setUserId", res.userId);
                proxy.$store.commit("setUserPic", res.avator);
                setToken(res.token);

                proxy.$emit("changeData");
            }

            // 手机号登录
            function phoneLogin() {
              /*  loginByPhone(phoneLoginForm).then(res => {
                    saveUserInfo(res);
                });*/
            }


            return {
                phoneLogin,
                pwdLogin,
                pwdLoginForm,
                phoneLoginForm,
                SignInRules,
            }
        },


        methods: {
            toRegister() {
               return ;
            },
        },
        data() {
          return  {
              loading: false,
          }
        },
    })
</script>
