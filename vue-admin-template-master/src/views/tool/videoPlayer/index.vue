<template>
    <div>
      <el-tag type="success" class="margin-tag">mp4播放</el-tag>
      <videoPlayer :videoType="videoType[0]" playerWidth="500" playerHeight="300" ></videoPlayer>

      <el-tag type="danger" class="margin-tag">直播流播放</el-tag>
       <el-row :gutter="20">
         <el-col :span="6"><videoPlayer :isMute="true" :videoType="videoType[1]" :videoUrl="videoUrl[1]" :autoPlay="true" playerWidth="400" playerHeight="250"/></el-col>
         <el-col :span="6"><videoPlayer :isMute="true" :videoType="videoType[1]" :videoUrl="videoUrl[2]" :autoPlay="true" playerWidth="400" playerHeight="250"/></el-col>
         <el-col :span="6"><videoPlayer :isMute="true" :videoType="videoType[1]" :videoUrl="videoUrl[3]" :autoPlay="true" playerWidth="400" playerHeight="250"/></el-col>
         <el-col :span="6"><videoPlayer :isMute="true" :videoType="videoType[1]" :videoUrl="videoUrl[4]" :autoPlay="true" playerWidth="400" playerHeight="250"/></el-col>
       </el-row>
    </div>
</template>
<script>
import videoPlayer from '@/components/videoPlayer/index.vue'
export default {
  name:'videoPlayerView',
  components:{
    videoPlayer
  },
  data() {
    return {
     videoUrl:['https://cph-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
            'https://gcalic.v.myalicdn.com/gc/taishan06_1/index.m3u8?contentid=2820180516001',
            'https://gcalic.v.myalicdn.com/gc/wgw05_1/index.m3u8?contentid=2820180516001',
            'https://gctxyc.liveplay.myqcloud.com/gc/zjjjjdl_1/index.m3u8?contentid=2820180516001',
            'https://gcalic.v.myalicdn.com/gc/wgw01_1/index.m3u8?contentid=2820180516001'

      ],
     videoType: ['video/mp4','application/x-mpegURL']
    }
  }
}
</script>
<style>
.margin-tag{
  margin-left:20px;
  margin-top:20px;
  margin-bottom:20px
}
</style>