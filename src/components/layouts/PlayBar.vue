<template>
    <div class="play-bar" :class="{show:!toggle}">
        <!-- 播放进度 -->

        <el-slider class="progress" v-model="nowTime" @change="changeTime" size="small"></el-slider>

        <div class="control-box">
            <div class="info-box">
                <!-- 歌曲图片-->
                <el-image class="song-bar-img" fit="contain" :src="songPic" @click="goPlayerPage"/>
                <!-- 播放开始与结束时间 -->
                <div v-if="songId">
                    <div class="song-info">{{this.songTitle}}---<router-link :to="{path:'/singer-detail',query:{itemId: this.singerId}}"> {{this.singerName}} </router-link>  </div>
                    <div class="time-info"> {{startTime}} / {{endTime}}</div>
                </div>
            </div>

            <div class="song-ctr">

                <MyMusicIcon class="yin-play-show" :icon="playStateList[playStateIndex]" @click="changePlayState"></MyMusicIcon>
                <!-- 上一首-->
                <MyMusicIcon class="yin-play-show" :icon="iconList.SHANGYISHOU" @click="changePlayState"></MyMusicIcon>
                <!--播放-->
                <MyMusicIcon :icon="playButtonIcon" @click="togglePlay"></MyMusicIcon>
                <!--下一首-->
                <MyMusicIcon class="yin-play-show" :icon="iconList.XIAYISHOU" @click="nextSong"></MyMusicIcon>
            </div>

            <!-- 歌曲列表-->
            <div class="song-ctr song-edit">
                <MyMusicIcon :icon="iconList.LIEBIAO" @click="changeAside"></MyMusicIcon>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import MyMusicIcon from "@/components/layouts/MyMusicIcon.vue";
    import {defineComponent} from "vue";
    import {Icon} from "@/enums";
    import {mapGetters} from "vuex";
    import { formatSeconds } from "@/utils/common";
    import { attachImageUrl} from "@/api";
    export  default  defineComponent({
        components:{
            MyMusicIcon,
        },
        data() {
          return {
              startTime: "00:00",
              endTime: "00:00",
              nowTime: 0, // 进度条位置
              toggle: true,
              playButtonIcon: Icon.BOFANG,  // 触发播放的按钮图标所以是 三角 ,暂停为 双竖线
              volume: 50,
              playState: Icon.XUNHUAN,
              playStateList: [Icon.XUNHUAN, Icon.LUANXU],
              playStateIndex: 0,
              iconList: {
                  ZHEDIE: Icon.ZHEDIE,
                  SHANGYISHOU: Icon.SHANGYISHOU,
                  XIAYISHOU: Icon.XIAYISHOU,
                  YINLIANG: Icon.YINLIANG,
                  JINGYIN: Icon.JINGYIN,
                  LIEBIAO: Icon.LIEBIAO,
                  dislike: Icon.Dislike,
                  like: Icon.Like,
              }
          }
        },
        computed: {
          ...mapGetters([
              "userId",
              "isPlay", // 播放状态
              "playBtnIcon", // 播放状态的图标
              "songId", // 音乐id
              "singerId", // 用于显示对应的歌手id
              "songUrl", // 音乐地址
              "songTitle", // 歌名
              "singerName", // 歌手名
              "songPic", // 歌曲图片
              "curTime", // 当前音乐的播放位置
              "duration", // 音乐时长
              "currentPlayList",
              "currentPlayIndex", // 当前歌曲在歌曲列表的位置
              "showAside", // 是否显示侧边栏
              "autoNext", // 用于触发自动播放下一首
          ])
        },
        watch:{
            curTime() {
                this.startTime = formatSeconds(this.curTime);
                this.endTime = formatSeconds(this.duration);
                // 移动进度条
                this.nowTime = (this.curTime / this.duration) * 100;
            },
            // 自动播放下一首
            autoNext() {
                console.log("触发了下一首");
                this.nextSong();
            },
            isPlay(value) {
                 this.playButtonIcon =  value ? Icon.ZANTING : Icon.BOFANG;
            },
        },
        methods: {
            // 播放与暂停
            togglePlay() {
                this.$store.commit("setIsPlay", this.isPlay ? false : true);
            },
            // 是否显示侧边栏
            changeAside() {
                this.$store.commit("setShowAside", !this.showAside);
                console.log(!this.showAside);
            },
            // 滑动时间
            changeTime() {
                this.$store.commit("setChangeTime", this.duration * (this.nowTime * 0.01));
            },
            changePlayState() {
                this.playStateIndex = this.playStateIndex >= this.playStateList.length - 1 ? 0 : ++this.playStateIndex;
                this.playState = this.playStateList[this.playStateIndex];
            },
            nextSong() {
                // 下一首
                if (this.playState === Icon.LUANXU) {
                    let playIndex = Math.floor(Math.random() * this.currentPlayList.length);
                    playIndex = playIndex === this.currentPlayIndex ? playIndex + 1 : playIndex;
                    this.$store.commit("setCurrentPlayIndex", playIndex);
                    this.toPlay(this.currentPlayList[playIndex].url);
                } else if (this.currentPlayIndex !== -1 && this.currentPlayList.length > 1) {
                    if (this.currentPlayIndex < this.currentPlayList.length - 1) {
                        this.$store.commit("setCurrentPlayIndex", this.currentPlayIndex + 1);
                        this.toPlay(this.currentPlayList[this.currentPlayIndex].url);
                    } else {
                        this.$store.commit("setCurrentPlayIndex", 0);
                        this.toPlay(this.currentPlayList[0].url);
                    }
                } else if (this.currentPlayList.length ==0) {
                    // 说明数据已经被清空 则清空当前播放的歌曲信息
                    this.$store.dispatch('clearAll');
                }
            },

            // 选中播放
            toPlay(url) {
                if (url && url !== this.songUrl) {
                    const song = this.currentPlayList[this.currentPlayIndex];
                    this.$store.dispatch('playMusic',song);
                }
            },

            goPlayerPage() {
                this.$router.push({path: '/lyric', query: {itemId: this.songId  }});
            }

        }


    })

</script>



<style lang="scss" scoped>
    @import "@/assets/css/play-bar.scss";
</style>
