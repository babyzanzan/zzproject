<template>
  <div class="dashboard-container">
    <el-row>
      <el-card class="box-card">
        <el-row class="demo-avatar demo-basic">
          <el-col :span="5">
            <el-avatar style="width: 150px;height: 150px;" size="large" :src="avatar"></el-avatar>
          </el-col>
          <el-col :span="17">
            <p>今天是 <span class="dashboard-lunar">{{ LunarDay.lunarYear }}</span> 
              <span class="dashboard-lunar-zodiac">  {{ LunarDay.zodiac }}</span> 年 
              农历 <span class="dashboard-lunar">{{ LunarDay.dateStr }}</span>
              <span class="dashboard-lunar-solarTerm">  {{ LunarDay.solarTerm }}</span>
            </p>
            <p>当前时间为：{{ todayDate }} {{ todayTime }}</p>
            <span class="dashboard-name">{{ name }} </span>, {{ hello }}
          </el-col>
        </el-row>
      </el-card>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="10">    
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>公告</span>
          </div>
          <el-collapse v-model="activeNames" accordion>
            <el-collapse-item :title="item.noticeDate" :name="item.noticeName" v-for="item in notice">
              <div>{{ item.noticeTitle }}</div>
              <div v-html="item.noticeContent" @click="copyNoticeContent(item.noticeContent)">
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
      <el-col :span="10">    
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>消息</span>
          </div>
        </el-card>
      </el-col>
    </el-row>   
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLunar } from 'chinese-lunar-calendar'
export default {
  name: 'Dashboard',
  data(){
    return{
      todayDate: '',
      todayTime:'',
      hello: '',
      LunarDay: '',
      activeNames: ['1'],
      notice:[{
        noticeDate: '2023-07-05',
        noticeName: '1',
        noticeTitle: '这是2023年7月5日的公告',
        noticeContent: `Excel在线文档地址 https://www.kdocs.cn/l/ca6LRfYB5g3q`
      },{
        noticeDate: '2023-07-06',
        noticeName: '2',
        noticeTitle: '这是2023年7月6日的公告',
        noticeContent: 'Excel在线文档地址  https://www.kdocs.cn/l/ckVjm7ZZaN8E'
      }]
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar'
    ])
  },
  methods: {
    copyNoticeContent(content){
      this.$copyText(content).then(
	      e=>{
          this.$message({
            type: 'success',
            message: '已复制消息内容'
          })
	      },
	      e=>{
	        console.log('复制失败：', e);
	      }
      )
    },
    jugementHello(hours){//根据时间显示问候语
      if (hours > 22 || hours <= 5) {
        this.hello = '已经很晚了，请早点休息，明天上班才会活力满满！'
      } else if (hours > 5 && hours <= 10) {
        this.hello = '上午好！工作顺利嘛，不要久坐，多起来走动走动哦！'
      } else if (hours > 10 && hours <= 12) {
        this.hello = '中午好，工作了一个上午，现在是午休时间，好好休息下午才能元气满满！'
      } else if (hours > 12 && hours <= 17) {
        this.hello = '下午好，要努力，但不要着急，繁花锦簇，硕果累累都需要过程！'
      } else if (hours > 17 && hours <= 22) {
        this.hello = '晚上好，今天也努力了一天，让自己放松一下吧！'
      } else {
        this.hello = '你好，欢迎您再次回来！'
      }
    },
    getDate(){//获取当前日期
      let date = new Date()
      let Y = date.getFullYear(),
          M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1),
          D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
      this.LunarDay = getLunar(Y,M,D)
      return Y + '年' + M + '月' + D + '日 '
    },
    getTime() {   // 获取当前时间
      let date = new Date()  //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()),
          m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()),
          s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
      this.jugementHello(h)
      return h + ':' + m + ':' + s
    },
  },
  mounted(){
    this.todayDate = this.getDate()
    this.todayTime = this.getTime() 
    setInterval(() =>{
      this.todayTime =  this.getTime() 
    }, 1000) 
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.dashboard-name {
  font-size: 30px;
  color: rgb(79, 113, 224);
}
.dashboard-lunar {
  font-size: 20px;
  color: rgb(235, 151, 73);
}
.dashboard-lunar-zodiac {
  font-size: 20px;
  color: rgb(247, 51, 51);
}
.dashboard-lunar-solarTerm{
  font-size: 20px;
  color: rgb(43, 173, 54);
}
</style>
