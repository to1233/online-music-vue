<template>
  <el-container>
    <el-aside class="album-slide">
      <el-image class="singer-img" fit="contain" :src="songDetails.artist.picUrl" />
    </el-aside>
    <el-main class="album-main">
      <h1>{{ songDetails.name }}</h1>
      <p>{{ songDetails.artist.briefDesc }}</p>
      <PlayList :playList="songList" @changeDataList="changeDataList"></PlayList>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent} from "vue";
import PlayList from "@/components/PlayList.vue";
import { getSingerInfoById } from "@/api";

export default defineComponent({
  components: {
    PlayList,
  },
  methods: {

    // 子集修改集合数据之后重新赋值给父级
    changeDataList(changeData) {
      this.songList = changeData;
    },
    convertSongInfo() {
      return (songInfo) => ({
        id: `${songInfo.id}`,
        title: songInfo.name,
        artist: songInfo.ar[0].name,
        artist_id: `${songInfo.ar[0].id}`,
        album: songInfo.al.name,
        album_id: `nealbum_${songInfo.al.id}`,
        source: 'netease',
        source_url: `http://music.163.com/#/song?id=${songInfo.id}`,
        img_url: songInfo.al.picUrl,
        url: `netrack_${songInfo.id}`,
        disabled: songInfo.st < 0,
      });
    },
  },
  created(): void {
    this.singerId = this.$route.query["itemId"] as string;
    getSingerInfoById(this.singerId).then(resizeBy => {
      this.songDetails = resizeBy;
      this.songList =resizeBy.hotSongs.map(this.convertSongInfo()).filter(item => {
         return !item.disable
      });
    })

  },
  data() {
    return {
      singerId: '1',
      songDetails: {
        artist : {
          picUrl: '',
          briefDesc: '',
        }
      },
      songList: [],
    }
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";

.album-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;

  .singer-img {
    height: 250px;
    width: 250px;
    border-radius: 10%;
  }

  .album-info {
    width: 60%;
    padding-top: 2rem;
    li {
      width: 100%;
      height: 30px;
      line-height: 30px;
    }
  }
}

.album-main {
  p {
    color: rgba(0, 0, 0, 0.5);
    margin: 10px 0 20px 0px;
  }
}

@media screen and (min-width: $sm) {
  .album-slide {
    position: fixed;
    width: 400px;
  }
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
