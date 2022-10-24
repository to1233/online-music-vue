<template>
    <div>
        <el-row :span="24" justify="space-around">
            <el-tabs >
                <el-tab-pane label="账号密码登录">
                    <!--账号密码登录表单-->
                    <el-form ref="pwdLoginFormRef" :model="pwdLoginForm" :rules="pwdLoginFormRules" >
                        <!-- 用户名-->
                        <el-form-item prop="username">
                            <el-input placeholder="用户名" clearable v-model="pwdLoginForm.userName" prefix-icon="User">

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

           <!--     <el-tab-pane label="手机验证登录">
                    &lt;!&ndash;手机验证登录表单&ndash;&gt;
                    <el-form ref="phoneLoginFormRef" :model="phoneLoginForm" :rules="phoneLoginFormRules" >
                        &lt;!&ndash; 手机号&ndash;&gt;
                        <el-form-item prop="phone">
                            <el-input placeholder="手机号" prefix-icon="Phone"  v-model="phoneLoginForm.phone"></el-input>
                        </el-form-item>
                        <el-form-item prop="phoneCode">
                            <el-input placeholder="验证码" prefix-icon="Key"  v-model="phoneLoginForm.phoneCode">

                            </el-input>
                        </el-form-item>
                        &lt;!&ndash;按钮区域&ndash;&gt;
                        <el-form-item class="login_btns">
                            <el-button type="primary" @click="phoneLogin" :loading="loading">登录</el-button>
                            <el-button type="primary" @click="toRegister"> 注册</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>-->


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
    import {loginByUserName ,loginByPhone } from "@/api";
    import { setToken } from "@/utils/auth";
    export  default  defineComponent({
        emits: ["changeData"],
        setup() {
            const { proxy } = getCurrentInstance() as any;

            const pwdLoginForm =   reactive({
                userName: "",
                password: "",
            });

            const state = reactive({
                pwdLoginFormRules: {
                    username: [{
                        required: true,
                        message: '请输入你的账号',
                        trigger: 'blur'
                    }],
                    // 验证密码是否合法
                    password: [{
                        required: true,
                        message: '请输入你的密码',
                        trigger: 'blur'
                    }]
                },

            });


            const phoneLoginForm  = reactive({
                userName: "",
                password: "",
            });


            function pwdLogin() {
                loginByUserName(pwdLoginForm).then(res => {
                    saveUserInfo(res);
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
                loginByPhone(phoneLoginForm).then(res => {
                    saveUserInfo(res);
                });
            }


            return {
                phoneLogin,
                pwdLogin,
                pwdLoginForm,
                phoneLoginForm,
                state
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
