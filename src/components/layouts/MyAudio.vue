<template>
    <audio :src="songUrl"
           controls="controls"
           :ref="player" preload="true"
           @canplay="canplay"
           @timeupdate="timeupdate"
           @ended="ended"  >
        <!-- (1) 属性 controls, preload
          (2) 事件 canplay,timeupdate.ended
          (3) 方法 play() pause()
          controls: 向用户显示音频控件,播放/ 暂停/ 进度条/音量
          preload 属性规定是否在页面加载后载入音频
          canplay 当音频/视频处于加载过程中时会发生的事件
          timeupdate 当目前的播放位置已经更改时
          ended 当目前的播放列表已经结束时-->


    </audio>
</template>
<script lang="ts">
    import {attachImageUrl} from '../../api';
    import { defineComponent,getCurrentInstance,ref,watch,computed } from "vue";
    import {mapGetters} from "vuex";
    import { useStore } from "vuex";



    export default defineComponent({
        data() {
            return {
                divRef: {},
            }
        },
        setup() {
            const { proxy } = getCurrentInstance();
            const store = useStore();
            const divRef = ref<HTMLAudioElement>();
            const player = (el) =>{
                divRef.value = el;
            };
            const songUrl = computed(() => store.getters.songUrl); // 音乐链接
            console.log(songUrl);
            const isPlay = computed(() => store.getters.isPlay); // 播放状态
            const changeTime = computed(() => store.getters.changeTime) ; // 指定播放时刻
            const autoNext = computed(() =>store.getters.autoNext); // 用于触发自动播放下一首
            const volume = computed(() =>store.getters.volume) ; // 音量

            watch(isPlay, () => togglePlay()  );
            // 调到指定时刻播放
            watch(changeTime,() => ( divRef.value.currentTime = changeTime.value));
            // 修改音量
            watch(volume,(value) => (divRef.value.volume = value));

            // 开始 暂停
            function togglePlay() {
                isPlay.value ? divRef.value.play() : divRef.value.pause();
            }

            // 获取歌曲连接后准备播放
            function canplay() {
                proxy.$store.commit("setDuration",divRef.value.duration);
                divRef.value.play();
                proxy.$store.commit("setIsPlay",true);
            }

            // 音乐播放的时候记录音乐播放的位置
            function timeupdate() {
                proxy.$store.commit("setCurTime",divRef.value.currentTime);
            }

            // 音乐播放结束的时候触发
            function ended() {
                proxy.$store.commit("setIsPlay",false);
                proxy.$store.commit("setCurTime",0);
                proxy.$store.commit("setAutoNext",!autoNext.value)
            }

            return {
                songUrl,
                player,
                canplay,
                timeupdate,
                ended,
                attachImageUrl
            };
        },
        computed: {
            ...mapGetters([
                "songUrl", // 音乐播放链接
                "isPlay", // 音乐播放状态
                "volume", // 音量
                "changeTime", // 指定的播放时刻
                "autoNext", // 是否自动触发播放下一首
            ])
        },
        watch: {
          isPlay() {
              this.togglePlay();
          },
            changeTime() {

            }
        },
        methods: {
            // 触发audio 元素的暂停与播放
            togglePlay() {

            }
        }
    })

</script>


<style scoped>
    audio {
        display: none;
    }
</style>
