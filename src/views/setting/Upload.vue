<template>
    <div class="upload">
        <el-upload drag :action="uploadUrl(this.userId)" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <el-icon class="el-icon--upload">upload-filled</el-icon>
            <div class="el-upload_text">将文件拖到或者点击上传</div>
            <template #tip>
                <p class="el-upload__tip">只能上传 {{uploadTypes}}</p>
            </template>
        </el-upload>
    </div>

</template>

<script>
    import { defineComponent } from "vue";

    import { uploadUrl } from "@/api";
    import {mapGetters} from "vuex";
    export default  defineComponent({
        methods: {

            // 上传图片前的检查
            beforeAvatarUpload(file) {
                const ltCode = 2;
                const isLt10M = file.size / 1024 / 1024;
                const isExistFileType = this.uploadTypes.includes(file.type.replace(/image\//, ""));

                if (isLt10M > ltCode || isLt10M <= 0) {
                    this.$message.error(`图片大小范围是 0~${ltCode}MB!`);
                }
                if (!isExistFileType) {
                    this.$message.error(`图片只支持 ${this.uploadTypes.join("、")} 格式!`);
                }
                return isLt10M && isExistFileType;
            },

            // 上传成功后的回调
            handleAvatarSuccess(response, file) {
                this.$message({
                    message: response.message,
                    type: response.type,
                });
                if (response.success) this.$store.commit("setUserPic", response.data);
            }

        },
        computed: {
            ...mapGetters([
                "userId",
            ])
        },
        data() {
          return {
              uploadTypes: [
                  "jpg",
                  "jpeg",
                  "png",
                  "gif"
              ]
          }
        },
    })

</script>

<style scoped>
    .upload {
        width: 100%;
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

