<!-- 购进报表 -->
<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="日期">
          <el-date-picker
                style="margin-left: 10px;"
                v-model="selectInfo.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
          </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="订单ID">
          <el-input v-model="selectInfo.orderId" placeholder="订单ID" clearable></el-input>
      </el-form-item> -->
      <el-form-item label="">
          <el-button @click="queryInfo('click')" type="primary">搜索</el-button>
      </el-form-item> 
      <el-form-item label="">
          <el-button @click="toAdd" type="warning">上传采购订单</el-button>
      </el-form-item>
      <el-form-item label="">
          <el-button @click="revokePurchase=true" type="success">撤销采购订单</el-button>
      </el-form-item> 
    </el-form>
    <DIYtable templateName="采购记录模板" :pageSize="size" :currentPages="currentPage" :loaded="loading" :viewType="type" :dataTable="tableData"></DIYtable>
    <div style="display: flex;justify-content: center;">
      <el-pagination
        background
        :total="total"
        :page-size="10"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-count="pageCount"
        :page-sizes="[5, 10, 20, 30]"
        layout="total, sizes, prev, pager, next, jumper"
        :hide-on-single-page="true"
        style="margin-top: 10px;">
      </el-pagination>
    </div>
    <el-backtop></el-backtop>
    <el-drawer
        title="撤销采购订单明细"
        :before-close="handleClose"
        :visible.sync="revokePurchase"
        direction="rtl"
        custom-class="demo-drawer"
        ref="drawer"
        size="45%">
        <div class="demo-drawer__content">
          <el-form :model="form" :rules="rules" >
            <el-row>
              <el-form-item label="采购订单明细ID" :label-width="formLabelWidth" prop="id">
                <el-col :span="18">
                  <el-input v-model="form.id" placeholder="请输入采购订单明细ID"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="撤销原因" :label-width="formLabelWidth" prop="note">
                <el-col :span="18">
                  <el-input type="textarea" placeholder="请输入撤销原因" resize="none" rows="5" v-model="form.note"></el-input>
                </el-col>
              </el-form-item>
            </el-row>
          </el-form>
          <div class="demo-drawer__footer">
            <el-button style="margin-left: 40%;width: 15%;" type="primary" @click="uploadSubmit" :loading="loadingSubmit">{{ loadingSubmit ? '提交中 ...' : '提交' }}</el-button>
          </div>
        </div>
    </el-drawer>
  </div>
</template>
  
<script>
import { getPurchases,getPurchasesId,uploadRevokePurchase } from '@/api/table' 
import DIYtable from '@/components/DIYtable/index.vue'
const today = [new Date(), new Date()]
const res = {
        "currentPageIndex": 1,
        "totalPageNumber": 1,
        "currentPageSize": 10,
        "totalRecordNumber": 10,
        "data": [
            {
                "billId": 123,
                "billCode": "332211",
                "relatedBillId": "1",
                "billDate": "2023-10-07 00:00:00",
                "createTime": "2023-10-07 08:22:11",
                "supplierName": "民侦探柯南",
                "id": 113,
                "pId": 3334,
                "relatedId": "3324349",
                "quantity": 2000.0000
            }]
          }
export default {
  name:'purchaseTable',
  components: {
    DIYtable,
  },
  data() {
    return {
      revokePurchase: false,
      loadingSubmit: false,
      formLabelWidth: '130px',
      form:{
        id:'',
        note:''
      },
        // 从DIYtable对应的数据库表格中获取的表格数据
      tableData: [],
      loading: false,
      selectInfo:{
        orderId:'',
        dateRange:today
      },
      total:0,   // 数据总数
      currentPage:1,  // 当前页面
      size:10,//每页显示的条数
      pageCount:1,//总页数
      type:'purchases',
      rules: {
        id: [
          { required: true, message: '请输入采购订单明细ID', trigger: 'blur' }
        ],
        note: [
          { required: true, message: '请输入往来户ID', trigger: 'blur' },
          {  max: 50, message: '撤销原因最长50', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSizeChange(val){
      this.size = val
      this.queryInfo('click')
    },
    toAdd(){  // 跳转到添加页面
      this.$router.push({path:'/detail/infoDetail',query: {type: 'purchases_up',limit:5}})
    },
    submitFormat(){  // 上传时格式处理和验证
      if(this.form.id===''||this.form.note===''){
        this.$message({
          showClose: true,
          message: '请填写完整信息!',
          type: 'error'
        })
        return false
      }else{
        return true
      }
    },
    uploadSubmit(){  //提交撤销原因
      this.loadingSubmit=true
      if(this.submitFormat()){
        this.$message({
          showClose: true,
          message: "已提交",
          type: 'success'
        })
        this.loadingSubmit = false
        // uploadRevokePurchase([this.form])
        // .then((res)=>{
        //   this.$message({
        //     showClose: true,
        //     message: res.data.message,
        //     type: 'success'
        //   })
        //   this.loadingSubmit = false
        // })
        // .catch((error)=>{
        //   this.loadingSubmit = false
        // })
      }else{
        this.loadingSubmit = false
      }
    },
    handleClose(done) {
      done()
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage;
      //console.log(this.currentPage);   //点击第几页
      this.queryInfo()
    },
    queryInfo(type){
      this.loading = true
      if(this.selectInfo.dateRange===null){
        this.selectInfo.dateRange = today
      }
      if(type==='click'){  //如果是通过点击查询按钮进行搜索的话，就初始化当前页码为第1页
        this.currentPage = 1
      }
      this.tableData = res.data
        this.pageCount = res.totalPageNumber
        this.total = res.totalRecordNumber
        this.loading = false
      //if(this.selectInfo.orderId!==''){  //如果orderId不为空，则调用id查询接口

      //   getPurchasesId({page:this.currentPage,size:this.size,typeId:1},this.selectInfo.orderId)
      //   .then((res)=>{
      //     if(this.total!==res.data.totalRecordNumber&&type!=='click'){ //如果现在的 total 和 返回的 totalPageNumber 不同就是说明搜索的结果不对了,重新进查询
      //       this.$message({
      //         message: '操作出错,已重新按id查询',
      //         type: 'warning'
      //       })
      //       this.currentPage = 1
      //       this.queryInfo('click')
      //     }else{
      //       this.tableData = res.data.data
      //       this.pageCount = res.data.totalPageNumber
      //       this.total = res.data.totalRecordNumber
      //     }
      //     this.loading = false
      //   })
      //   .catch((error)=>{
      //     this.loading = false
      //   })
      // }else{  // 否则调用日期查询接口
      //   let startDate = this.selectInfo.dateRange[0]
      //   let endDate = this.selectInfo.dateRange[1]
      //   getPurchases({page:this.currentPage,size:this.size,typeId:1,beginDate:startDate,endDate:endDate})
      //   .then((res)=>{
      //     if(this.total!==res.data.totalRecordNumber&&type!=='click'){ //如果现在的 total 和 返回的 totalPageNumber 不同就是说明搜索的结果不对了,重新进查询
      //       this.$message({
      //         message: '操作出错,已重新查询',
      //         type: 'warning'
      //       })
      //       this.currentPage = 1
      //       this.queryInfo('click')
      //     }else{
      //       this.tableData = res.data.data
      //       this.pageCount = res.data.totalPageNumber
      //       this.total = res.data.totalRecordNumber
      //     }
      //     this.loading = false
      //   })
      //   .catch((error)=>{
      //     this.loading = false
      //   })
      // }
    },
  },
  mounted(){
    this.queryInfo('click')
  }
}  
</script>
  