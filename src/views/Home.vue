<template>
  <div class="home">
    <el-row :span="24">
      <el-col :span="12">
        <div class="searchComponent">
          <el-autocomplete
                  v-model="searchWords"
                  :fetch-suggestions="querySearchAsync"
                  :popper-append-to-body="false"
                  placeholder="搜索"
                  @select="startSearch"
                  @keydown.enter="startSearch"
          />
        </div>

      </el-col>
    </el-row>
    <!--tab页显示-->
    <el-row>
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick" stretch>
        <el-tab-pane label="所有音乐" name="all">
          <PlayList :playList="songList" @changeDataList="changeDataList"></PlayList>
        </el-tab-pane>
        <el-tab-pane label="网易云音乐" name="first">
          <PlayList :playList="songList"></PlayList>
        </el-tab-pane>
        <el-tab-pane label="QQ音乐" name="second">Config</el-tab-pane>
        <el-tab-pane label="酷狗音乐" name="third">Role</el-tab-pane>
        <el-tab-pane label="咪咕音乐" name="fourth">Task</el-tab-pane>
      </el-tabs>
    </el-row>

  </div>
</template>

<script lang="ts">
import { defineComponent ,ref,getCurrentInstance} from 'vue';
import PlayList from "@/components/PlayList.vue";
import { searchSongs,searchSongSuggest} from "@/api";
export default defineComponent({
  name: 'Home',
  components : {
    PlayList
  },
  setup() {
    // 歌曲id
    const songList = ref([]); // 歌单列表
    const activeName = ref('all');
    const searchWords = ref(''); // 搜索关键词
    const result = ref([]);
    const {proxy} = getCurrentInstance();
    /**
     * 触发搜索
     */
    function  startSearch() {
      if (searchWords.value == '') {
        (proxy as any).$message({
          message: "搜索内容不能为空哦",
          type: "warning",
        });
        return;
      }
      searchSongs({ 's': searchWords.value}).then(resizeBy => {
         let cloudSongList =   resizeBy.songs.map(convert(false)).filter(item=>{
           return item.disabled == false
         });

          songList.value = cloudSongList;
       });
    }

   async function querySearchAsync(queryString: string, cb: (arg: any) => void) {
     if (queryString == '' ||queryString == undefined) {
       cb([]);
     } else {
      await searchRemoteCloud(queryString);
       cb(result.value);
     }

    }

    // 远程搜索联想---网易云
    async function searchRemoteCloud(queryString) {
      // 联想搜索
      await   searchSongSuggest({ s: queryString}).then(resizeBy =>{
        // 存在三种类型 songs  artists albums

        let songArr = resizeBy.songs.map(item => {
          return {
            value: item.name,
            id: item.id
          }
        });


        let artistArr = resizeBy.artists.map(item => {
          return {
            value: item.name,
            id: item.id
          }
        });


        let albumArr = resizeBy.artists.map(item => {
          return {
            value: item.name,
            id: item.id
          }
        });

        result.value  =  [...songArr, ...artistArr,...albumArr];
      });
    }

    function convert(allowAll) {
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
        disabled: allowAll ? false : !isPlayable(songInfo),
      });
    }

    function isPlayable(song) {
      return getNEScore(song) < 10;
    }

    function getNEScore(song) {
      if (!song) return 0;
      const privilege = song.privilege;

      if (song.program) return 0;

      if (privilege) {
        if (privilege.st != null && privilege.st < 0) {
          return 100;
        }
        if (
                privilege.fee > 0 &&
                privilege.fee !== 8 &&
                privilege.payed === 0 &&
                privilege.pl <= 0
        )
          return 10;
        if (privilege.fee === 16 || (privilege.fee === 4 && privilege.flag & 2048))
          return 11;
        if (
                (privilege.fee === 0 || privilege.payed) &&
                privilege.pl > 0 &&
                privilege.dl === 0
        )
          return 1e3;
        if (privilege.pl === 0 && privilege.dl === 0) return 100;

        return 0;
      }

      if (song.status >= 0) return 0;
      if (song.fee > 0) return 10;

      return 100;
    }



    // 子集修改集合数据之后重新赋值给父级
    function changeDataList(changeData) {
      songList.value =changeData;
    }

    function handleClick() {
      console.log()
    }





    // 歌单id
    return {
      songList,
      activeName,
      searchWords,
      startSearch,
      querySearchAsync,
      changeDataList,
      handleClick
  }
  }
});
</script>

<style lang="scss" scoped>

  .el-tabs {
    flex: auto;
    --el-tabs-header-height: 40px;
  }

   ::v-deep .el-autocomplete {
      width:50% !important;
      position: relative;
      display: inline-block;
   }

  .searchComponent{
    margin-left: 2rem;
  }


</style>
