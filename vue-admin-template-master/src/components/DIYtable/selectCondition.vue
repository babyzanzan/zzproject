<!-- 动态筛选条件 -->
<template>
    <div>
      <div style="margin-left: 10px;">
        <el-checkbox-group  v-model="queryInfo" @change="changeCondition">
            <el-checkbox-button v-for="item in conditionList" :label="item" :key="item">{{item}}</el-checkbox-button>
        </el-checkbox-group>
        <el-input style="width: 150px;margin-top: 10px;" :style="{'margin-left':index===0?'0px':'10px'}" 
          v-for="(inputItem,index) in queryCondition"
          :placeholder="'按'+inputItem.columItemLable+'查询'"
          v-model="selectCondition[inputItem.columItemName]"
          :key="inputItem.columItemName"
          @input="check"
          clearable>
        </el-input>
      </div>
    </div>
</template>
<script>
export default {
  name: 'selectCondition',
  props:['columList','conditionList'],
  data() {
    return {
      queryInfo: [],
      selectCondition: {}
    }
  },
  computed:{
    queryCondition(){ //处理查询条件 和 v-model内容
      let condition = []
      for(const element of this.queryInfo){
        for(const elementColum of this.columList){
          if(elementColum.columItemLable===element){
            condition.push(elementColum)
            this.selectCondition[elementColum.columItemName] = ""
          }
        }
      }
      return condition
    }
  },
  methods:{
    changeCondition(){
      for(const element of this.conditionList){//将没选中的查询条件赋值为null
        for(const elementColum of this.columList){
          if(elementColum.columItemLable===element&&!this.queryInfo.includes(element)){
            delete this.selectCondition[elementColum.columItemName]
          }
        }
      }
      this.$store.commit('settings/changeSelectCondition',{selectCondition:this.selectCondition}) //给vuex存储查询条件
    },
    check(val){
      this.$forceUpdate();  //强制刷新
    }
  },
  mounted(){
    this.$store.commit('settings/changeSelectCondition',{selectCondition:this.selectCondition}) //加载完成时初始化
  }

}
</script>