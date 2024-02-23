<!-- 商品设置页面 -->
<template>
  <div class="app-container">
    <el-input style="width: 20%;margin-left: 10px;margin-bottom:10px"
        placeholder="请输入商品名称"
        prefix-icon="el-icon-search"
        v-model="selectInfo.keyWord"
        clearable>
    </el-input>
    <!-- <el-input style="width: 20%;margin-left: 10px;"
        placeholder="请输入厂商"
        prefix-icon="el-icon-s-custom"
        v-model="selectInfo.fromPlace"
        clearable>
    </el-input> -->
    <el-button type="primary" style="margin-left: 10px;" @click="queryInfo('click')">搜索</el-button>
    <!-- <el-button type="warning" style="margin-left: 10px;" @click="toAdd">新增商品</el-button> -->
    <DIYtable 
      templateName="商品设置模板"
      :pageSize="size" 
      :currentPages="currentPage" 
      :loaded="loading" 
      :viewType="type" 
      :dataTable="tableData" 
      :itemOption="options"
      :showQuery="true" />
    <div style="display: flex;justify-content: center;">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-count="pageCount"
        :page-size="10"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :hide-on-single-page="true"
        :page-sizes="[5, 10, 20, 30]"
        style="margin-top: 10px;left: 50%;">
      </el-pagination>
    </div>
    <el-backtop></el-backtop>
  </div>
</template>
<script>
import { getProductsInfo,getShelfStorageInfo } from '@/api/table' 
import { mapGetters } from 'vuex'
import DIYtable from '@/components/DIYtable/index.vue'
const res = {
      "currentPageIndex": 1,
        "totalPageNumber": 2,
        "currentPageSize": 10,
        "totalRecordNumber": 12,
        "data": [
            {
                "id": 1,
                "relatedId": "1111",
                "name": "牛郎",
                "code": "11223344",
                "barCode": "44332211",
                "fromPlace": "人类",
            },
            {
              "id": 2,
                "relatedId": "22222",
                "name": "织女",
                "code": "22446688",
                "barCode": "88664422",
                "fromPlace": "仙女",
            },
            {
              "id": 4,
                "relatedId": "33333",
                "name": "牛",
                "code": "88776655",
                "barCode": "55667788",
                "fromPlace": "牲口",
            },
            {
              "id": 5,
                "relatedId": "33333",
                "name": "牛",
                "code": "88776655",
                "barCode": "55667788",
                "fromPlace": "牲口",
            },
            {
              "id": 6,
                "relatedId": "33333",
                "name": "牛",
                "code": "88776655",
                "barCode": "55667788",
                "fromPlace": "牲口",
            },
            {
              "id": 7,
                "relatedId": "33333",
                "name": "牛",
                "code": "88776655",
                "barCode": "55667788",
                "fromPlace": "牲口",
            },
            {
              "id": 8,
                "relatedId": "33333",
                "name": "牛",
                "code": "88776655",
                "barCode": "55667788",
                "fromPlace": "牲口",
            },
            {
              "id": 9,
                "relatedId": "33333",
                "name": "牛",
                "code": "88776655",
                "barCode": "55667788",
                "fromPlace": "牲口",
            },
            {
              "id": 10,
                "relatedId": "33333",
                "name": "牛",
                "code": "88776655",
                "barCode": "55667788",
                "fromPlace": "牲口",
            },
            {
              "id": 11,
                "relatedId": "33333",
                "name": "牛",
                "code": "88776655",
                "barCode": "55667788",
                "fromPlace": "牲口",
            },
            {
              "id": 12,
                "relatedId": "33333",
                "name": "牛",
                "code": "88776655",
                "barCode": "55667788",
                "fromPlace": "牲口",
            }]
}
export default {
  name:'goods',
  components: {
    DIYtable
  },
  data() {
    return {
      // 从DIYtable对应的数据库表格中获取的表格数据
      tableData: [],
      loading: false,
      selectInfo: {
        keyWord: '',
        fromPlace: ''
      },
      options: [],
      total:0,   // 数据总数
      currentPage:1,  // 当前页面
      size:10,//每页显示的条数
      pageCount:1,//总页数

      type: 'products',

    }
  },
  methods: {
    handleSizeChange(val){
      this.size = val
      this.queryInfo('click')
    },
    toAdd(){  // 跳转到添加页面
      this.$router.push({path:'/detail/infoDetail',query: {type: 'products_up',limit: 20}})
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage;
      //console.log(this.currentPage);   //点击第几页
      this.queryInfo()
    },
    queryInfo(type){ //按条件搜索
      console.log(this.selectCondition)
      this.loading = true
      if(type==='click'){  //如果是通过点击查询按钮进行搜索的话，就初始化当前页码为第1页
        this.currentPage = 1
      }
      this.tableData = res.data
      this.pageCount = res.totalPageNumber
      this.total = res.totalRecordNumber
      // getProductsInfo({page:this.currentPage,size:this.size,name:this.selectInfo.keyWord,relatedId:this.selectInfo.owner})
      // .then((res)=>{
      //   if(this.total!==res.data.totalRecordNumber&&type!=='click'){ //如果现在的 total 和 返回的 totalPageNumber 不同就是说明搜索的结果不对了,重新进查询
      //     this.$message({
      //       message: '操作出错,已重新查询',
      //       type: 'warning'
      //     })
      //     this.currentPage = 1
      //     this.queryInfo('click')
      //   }else{
      //     this.tableData = res.data.data
      //     this.pageCount = res.data.totalPageNumber
      //     this.total = res.data.totalRecordNumber
      //   }
      //   this.loading = false
      // })
      // .catch((error)=>{
      //   console.log(error)
      //   this.loading = false
      // })
      // if(this.total!==res.data.totalRecordNumber&&type!=='click'){ //如果现在的 total 和 返回的 totalPageNumber 不同就是说明搜索的结果不对了,重新进查询
      //     this.$message({
      //       message: '操作出错,已重新查询',
      //       type: 'warning'
      //     })
      //     this.currentPage = 1
      //     this.queryInfo('click')
      //   }else{
      //     this.tableData = res.data
      //     this.pageCount = res.totalPageNumber
      //     this.total = res.totalRecordNumber
      //   }
        this.loading = false
    } 
  },
  computed:{
    ...mapGetters([
      'selectCondition'
    ])
  },
  mounted(){
    this.queryInfo('click')
  },
  // created(){
  //   getShelfStorageInfo()
  //   .then((res)=>{
  //     this.options = res.data
  //   })
  //   .catch((error)=>{
  //     console.log(error)
  //     this.loading = false
  //   })
  // },
}

</script>