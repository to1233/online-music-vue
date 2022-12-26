<template>
  <div class="sheetDetail">
    <el-page-header @back="goBack" title="返回">
      <template #content>
        <span class="text-large font-600 mr-3"> {{songTitle}}</span>
      </template>

      <el-container>
        <el-aside class="album-slide">
          <el-image class="album-img" fit="contain" :src="songPic"/>
        </el-aside>

        <el-main>
          <!-- 显示右侧歌词信息-->
          <div class="container">
            <div class="lyric-container">
              <div class="song-lyric">
                <transition-group name="lyric-fade">
                  <!--有歌词-->
                  <ul :style="{ top: lrcTop }" class="has-lyric" v-if="lyricArr.length" key="has-lyric">
                    <li v-for="(item, index) in lyricArr" :key="index">
                      {{ item[1] }}
                    </li>
                  </ul>
                  <!--没歌词-->
                  <div v-else class="no-lyric" key="no-lyric">
                    <span>暂无歌词</span>
                  </div>
                </transition-group>
              </div>
            </div>
          </div>
        </el-main>

      </el-container>
    </el-page-header>
  </div>

</template>

<script lang="ts">
  import {computed, defineComponent, getCurrentInstance, ref, watch} from "vue";
  import { useStore } from "vuex";
  import { parseLyric } from "@/utils/common";
  import Client from "@/api/client";


  export default defineComponent({
    setup() {
      const store = useStore();

      const lrcTop = ref("80px"); // 歌词滑动
      const lyricArr = ref([]); // 当前歌曲的歌词
      const songId = computed(() => store.getters.songId); // 歌曲ID
      const lyric = computed(() => store.getters.lyric); // 歌词
      const currentPlayList = computed(() => store.getters.currentPlayList); // 存放的音乐
      const currentPlayIndex = computed(() => store.getters.currentPlayIndex); // 当前歌曲在歌曲列表的位置
      const curTime = computed(() => store.getters.curTime);
      const songTitle = computed(() => store.getters.songTitle); // 歌名
      const singerName = computed(() => store.getters.singerName); // 歌手名
      const songPic = computed(() => store.getters.songPic); // 歌曲图片
      const {proxy} = getCurrentInstance();
      // 回退到上一个路由
      function goBack() {
        proxy.$router.go(-1);
      }
      watch(songId, () => {
        lyricArr.value = parseLyric(currentPlayList.value[currentPlayIndex.value].lyric);
      });
      // 处理歌词位置及颜色
      watch(curTime, () => {
        if (lyricArr.value.length !== 0) {
          for (let i = 0; i < lyricArr.value.length; i++) {
            if (curTime.value >= lyricArr.value[i][0]) {
              for (let j = 0; j < lyricArr.value.length; j++) {
                (document.querySelectorAll(".has-lyric li") as NodeListOf<HTMLElement>)[j].style.color = "#989898";
                (document.querySelectorAll(".has-lyric li") as NodeListOf<HTMLElement>)[j].style.fontSize = "14px";
              }
              if (i >= 0) {
                lrcTop.value = -i * 40 + 50 + "px";
                (document.querySelectorAll(".has-lyric li") as NodeListOf<HTMLElement>)[i].style.color = "#95d2f6";
                (document.querySelectorAll(".has-lyric li") as NodeListOf<HTMLElement>)[i].style.fontSize = "18px";
              }
            }
          }
        }
      });

      lyricArr.value = lyric.value ? parseLyric(lyric.value) : [];

      return {
        songPic,
        singerName,
        songTitle,
        lrcTop,
        lyricArr,
        songId,
        goBack
      };
    },
  });
</script>


<style lang="scss" scoped>
  @import "@/assets/css/var.scss";

  /**
   左右边界
   */
  .sheetDetail {
    margin: 0 1rem;
  }


  .album-slide {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;


    .album-img {
      height: 250px;
      width: 250px;
      border-radius: 10%;
    }

    .album-info {
      width: 70%;
      padding-top: 2rem;
    }
  }

  .lyric-container {
    font-family: $font-family;
    .song-lyric {
      position: relative;
      min-height: 300px;
      padding: 30px 0;
      overflow: auto;
      border-radius: 12px;
      background-color: $color-weight-black;
      .has-lyric {
        position: absolute;
        transition: all 1s;
        li {
          width: 100%;
          height: 40px;
          text-align: center;
          font-size: 14px;
          line-height: 40px;
        }
      }
      .no-lyric {
        position: absolute;
        margin: 100px 0;

        span {
          font-size: 18px;
          text-align: center;
        }
      }
    }
  }

  .lyric-fade-enter,
  .lyric-fade-leave-to {
    transform: translateX(30px);
    opacity: 0;
  }

  .lyric-fade-enter-active,
  .lyric-fade-leave-active {
    transition: all 0.3s ease;
  }


  @media screen and (min-width: $sm) {
    .album-main {
      min-width: 600px;
      padding-right: 10vw;
      margin-left: 400px;
    }
  }

  @media screen and (max-width: $sm) {
    .album-slide {
      display: none;
    }
  }
</style>
