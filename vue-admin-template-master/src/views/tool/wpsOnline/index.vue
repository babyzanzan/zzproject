<template>
    <div>
        <el-input v-model="wpsOnlineUrl" placeholder="请输入共享文档地址"></el-input>
        <el-button @click="showWpsOnline" type="primary">显示共享文档</el-button>
        <el-dialog title="在线编辑" :visible.sync="dialogVisible" width="80%">
          <wpsOnline :wpsOnlineUrl="wpsOnlineUrl"></wpsOnline>
        </el-dialog>
    </div>
</template>
<script>
import wpsOnline from '@/components/wpsOnline/index.vue'
export default {
  name:'wpsOnlineView',
  components:{
    wpsOnline
  },
  data(){
    return{
      dialogVisible: false,
      wpsOnlineUrl: 'https://www.kdocs.cn/l/ca6LRfYB5g3q',
    }
  },
  methods:{
    showWpsOnline(){
      console.log()
      if(this.wpsOnlineUrl!==''&&this.wpsOnlineUrl.indexOf("kdocs.cn")!==-1&&this.wpsOnlineUrl.indexOf("https://")!==-1){
        this.dialogVisible = true
      }else{
        this.$message({
          type: 'error',
          message: '请填写正确共享文档地址!'
        })
      }
    }
  }
}
</script>