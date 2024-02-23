<!-- navbar通知控件 -->
<template>
    <el-tabs v-model="activeName">
        <el-tab-pane label="消息" name="message" >
            <div class="table-wrapper">
              <el-table :data="messageData" :show-header="false" default-expand-all @row-click="toChat">
                <el-table-column  width="60" property="sendAvator" label="发送者头像" >
                    <template slot-scope="scope">
                        <el-avatar size="medium" :src="scope.row['sendAvator']"></el-avatar>
                    </template>
                </el-table-column>
                <el-table-column width="80" property="sendName" label="发送者名称" show-overflow-tooltip></el-table-column>
                <el-table-column width="100" property="sendTime" label="发送时间" show-overflow-tooltip></el-table-column>
              </el-table>
              <div style="text-align: center;">
                <el-button type="text" @click="clearNotice('消息')">清空列表  <i class="el-icon-circle-close"></i></el-button>
              </div>
            </div>
        </el-tab-pane>
        <el-tab-pane label="任务" name="quest">
            <div class="table-wrapper">
                <el-table :data="questData" :show-header="false">
                <el-table-column width="80" property="questFrom" label="任务来自" show-overflow-tooltip></el-table-column>
                <el-table-column width="90" property="questTitle" label="任务标题" show-overflow-tooltip></el-table-column>
                <el-table-column width="100" property="questTime" label="任务时间" show-overflow-tooltip></el-table-column>
            </el-table>
            <div style="text-align: center;">
              <el-button type="text" @click="clearNotice('任务')">清空列表  <i class="el-icon-circle-close"></i></el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label=""></el-tab-pane>
        <el-tab-pane label=""></el-tab-pane>
    </el-tabs>
</template>
<script>
export default {
    name:'notice',
    props:{
      activeTab: {
        type: String,
        default: 'message'
      }
    },
    computed:{
      activeName:{
        get() {
          return this.activeTab
        },
        set() {},
      }
    },
    data() {
      return {
        messageData: [{
          sendTime: '2016-05-02',
          sendAvator: 'https://i.gtimg.cn/club/item/face/img/8/15918_100.gif',
          sendName: 'aa'
        }, {
          sendTime: '2016-05-04',
          sendAvator: 'https://i.gtimg.cn/club/item/face/img/0/15640_100.gif',
          sendName: 'bb'
        }],
        questData: [{
          questTime: '2016-05-02',
          questTitle: '学习',
          questFrom: 'aa'
        }, {
          questTime: '2016-05-04',
          questTitle: '工作',
          questFrom: 'bb'
        }]
      };
    },
    methods: {
      toChat(row, column, event){//点击消息后会跳转到聊天消息界面

        //跳转之前要把这条未读消息  删掉
        
        this.$store.commit('settings/changeChatInfo',{chatInfo:row}) //点击未读的聊天信息 提交给vuex作全局变量
        this.$router.push({path:'/toChat/chatRoom'})
      },
      clearNotice(type){
        if(type==='消息'){
          this.messageData = []
        }else if(type==='任务'){
          this.questData = []
        }
        this.$emit("noticeNum",this.messageData.length+this.questData.length)
      }
    },
    mounted(){
      this.$emit("noticeNum",this.messageData.length+this.questData.length)
    }
};
</script>
<style scoped>
  /**表格背景透明end */
.table-wrapper >>> .el-table__row>td{
    /* 去除表格线 */
    border: none;
}
</style>
