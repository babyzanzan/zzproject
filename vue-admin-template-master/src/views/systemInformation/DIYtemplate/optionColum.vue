<template>
  <div>
    <el-form-item label="操作列方法" prop="optionColum">
      <el-col :span="8">
        <el-input placeholder="操作列方法名称" v-model="item.optionFuncName" @blur="checkInput" :disabled="canEdit"></el-input>
      </el-col> 
      <el-col :span="8">
        <span style="color: red;margin-left:12px;">{{ warn }}</span>
      </el-col>
      <el-col :span="2">
        <el-button type="danger" style="margin-left: 18px;" circle size="mini" icon="el-icon-remove" @click="deleteColum" :disabled="canEdit"></el-button>
      </el-col>
    </el-form-item>
  </div>
</template>

<script>
export default {
    name: 'optionColum',
    props:['index','item','canEdit'],
    data() {
      return {
        warn: ""
      }
    },
    methods:{
      deleteColum(){
        this.$emit("deleteIndex",this.index)
      },
      checkInput(){
        let pattern = /[\u4E00-\u9FA5A-Za-z0-9_]+/g   // 限制输入的操作列方法必须是汉字，字母和下划线
        if(this.item.optionFuncName===undefined||this.item.optionFuncName===""){
           this.warn = "输入不能为空"
        }else if(pattern.test(this.item.optionFuncName) ){
          this.warn = ""
        }else{
          this.warn = "输入必须是汉字，字母和下划线"
          this.item.optionFuncName = ""
        }
      }
    }
}
</script>