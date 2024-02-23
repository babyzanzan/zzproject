<!-- 视频播放器组件(可适用流媒体直播) -->
<template>
    <div :style="{width:playerWidth+'px', height:playerHeight+'px'}">
    	<!-- 使用组件 -->
      <video-player  class="video-player vjs-custom-skin"
           ref="videoPlayer"
           :playsinline="false"
           :options="playerOptions">
	  </video-player>
    </div>
</template>
 
<script type="text/ecmascript-6">
// 以下三行一定要引入
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
//引入hls.js，用于直播流
import 'videojs-contrib-hls'
//import 'video.js/dist/lang/zh-CN'
 export default {
	name: 'videoplayer',
	components: { // 必需引入
		videoPlayer
    },
	props: {
    	videoUrl: {
      		type: String,
      		default: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
    	},
		videoType:{
			type: String,
			default: "video/mp4"
		},
		playerWidth:{
			type: String,
			default: '400'
		},
		playerHeight:{
			type: String,
			default: '400'
		},
		autoPlay:{
			type: Boolean,
			default: false
		},
		isMute:{
			type: Boolean,
			default: false
		}
  	},
	data () {
		return {
			fileAreaHeight: 200,
			//视频封面
            mp4Pic: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Fc893aaa3-2e28-402f-9d36-79aa8f62ad92%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1690696899&t=d5581c351d49a2d9d051d6b738a21afd'
		}
	},
	computed: { // 使用计算属性
	    playerOptions () {
	      const playerOptionsObj = {
	        playbackRates: [0.5, 1.0, 1.5, 2.0], //视频播放速度
	        autoplay: this.autoPlay, // 如果true，浏览器准备好时开始回放。
	        muted: this.isMute, // 默认情况下将会消除任何音频。
	        loop: false, // 导致视频一结束就重新开始。
	        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）。
	        language: 'zh-CN',
	        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）。
	        fluid: false, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
	        techOrder: ["html5"],
			html5: { hls: { withCredentials: false } },
			sources: [{
				//rtmp流
  					// type: 'rtmp/flv',
  					// src: 'rtmp://58.200.131.2:1935/livetv/hunantv',
				//.m3u8部分
  					//type: "application/x-mpegURL",
  					//src: 'http://ivi.bupt.edu.cn/hls/cctv1hd.m3u8',
				//mp4格式
  					//   type: "video/mp4",  // MP4
  					//   src: "https://images.nnyun.net/lvEh8zLaKkJla-zndPHaHB1KMBUC"
	          type: this.videoType,	// 资源格式写法：'video/mp4'，否则控制台会出现notSupportedMessage设置的错误。  rtmp/flv(流媒体) 这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
	          src: this.videoUrl // 视频url地址
	        }],
	        poster: this.mp4Pic, // 视频封面地址
	        width: document.documentElement.clientWidth,
	        //height: this.fileAreaHeight,	// 设置高度，fluid需要设置成flase
	        notSupportedMessage: '此视频暂无法播放...', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
	        controlBar: {
	          timeDivider: true,
	          durationDisplay: true,
	          remainingTimeDisplay: false,
	          fullscreenToggle: true  //全屏按钮
	        }
	      }
	      return playerOptionsObj
      }
    },
}
</script>