<template>
    <div class="upload">
        <el-upload drag :action="getUploadUrl(this.userId)" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
    </div>

</template>

<script>
    import { defineComponent } from "vue";

    import { uploadUrl } from "@/api/backInfo";
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
            // 获取到用户上传的路径
            getUploadUrl(userId) {
              return uploadUrl(userId) ;
            },

            // 上传成功后的回调
            handleAvatarSuccess(response, file) {
                this.$message({
                    message: response.msg,
                    type: response.code == 200 ? 'success' : 'warn',
                });
                if (response.code == 200) this.$store.commit("setUserPic", response.msg);
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

    .avatar-uploader .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    </style>

      <style>
      .avatar-uploader .el-upload {
          border: 1px dashed var(--el-border-color);
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: var(--el-transition-duration-fast);
      }

    .avatar-uploader .el-upload:hover {
        border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        text-align: center;
    }
</style>

