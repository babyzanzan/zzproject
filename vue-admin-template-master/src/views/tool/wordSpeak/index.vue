<!-- 文字转语音工具 -->
<template>
  <div>
    <el-row>
        <el-col :span="10">
            <el-input
                type="textarea"
                :autosize="{ minRows: 6}"
                placeholder="请输入语音播报内容"
                v-model="readText"
                resize="none">
            </el-input>
        </el-col>
    </el-row>

    <el-button icon="el-icon-microphone" @click="play">语音播报</el-button>
    <el-button icon="el-icon-video-pause" @click="paused">播报暂停</el-button>
    <el-button icon="el-icon-video-play" @click="goahead">播报继续</el-button>
  </div>
</template>
<script>
import Speech from 'speak-tts'
export default {
  name:'wordSpeak',
  data(){
    return{
      speech:null,
      readText:''
    }
  },
  mounted(){
    this.speechInit();
  },
  methods:{
    speechInit(){
     this.speech = new Speech();
     this.speech.setLanguage('zh-CN');
     this.speech.init().then(()=>{
        console.log('语音播报初始化完成')
      })
   },
  //播放按钮
  play(){
    console.log("开始播报")
    this.speech.speak({
        text:this.readText,
        listeners: {
            //开始播放
            onstart: () => {
                console.log("开始播放")
            },
            //判断播放是否完毕
            onend: () => {
                console.log("播放是否完毕");      
            },
            //恢复播放
            onresume: () => {
                console.log("恢复播放")
            },
        },}).then(()=>{
          console.log("读取成功")
        })
    },
    //暂停
    paused() {
      console.log("暂停")
      this.speech.pause();
    },
    //从暂停处继续播放
    goahead() {
      console.log("继续")
      this.speech.resume();
    }
  },
    //离开页面取消语音
  destroyed() {
    this.speech.cancel();
  },
}
</script>