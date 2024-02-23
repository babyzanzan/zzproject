<!-- 库存报表 -->
<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="货主商品ID">
        <PopProducts @selectProduct="selectProduct" />
      </el-form-item>
      <!-- <el-form-item label="">
        <el-select v-model="selectInfo.warehouseId" placeholder="请选择">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="">
        <el-switch
                v-model="selectInfo.showZero"
                active-text="显示零库存"
                style="margin-left: 10px;">
        </el-switch>
      </el-form-item> -->
      <el-form-item label="">
        <el-button style="margin-left: 10px;" @click="queryInfo('click')" type="primary">搜索</el-button>
      </el-form-item> 
    </el-form>
    <DIYtable templateName="即时库存模板" :pageSize="size" :currentPages="currentPage" :loaded="loading" :viewType="type" :dataTable="tableData"></DIYtable>
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
  </div>
</template>
  
<script>
import { getInventories } from '@/api/table' 
import PopProducts from '@/components/PopProducts/index.vue'
import DIYtable from '@/components/DIYtable/index.vue'
export default {
  name:'inventoryTable',
  components: {
    DIYtable,PopProducts
  },
  data() {
    return {
        // 从DIYtable对应的数据库表格中获取的表格数据
      tableData: [],
      loading: false,
      selectInfo:{
        productId: '',
        //warehouseId: 1,
        //showZero: false,
      },
      total:0,   // 数据总数
      currentPage:1,  // 当前页面
      size:10,//每页显示的条数
      pageCount:1,//总页数
      options: [{
        value: 1,
        label: '合格库'
      }, {
        value: 2,
        label: '退货库'
      }, {
        value: 3,
        label: '不合格库'
      }],
      type:'inventories'
    }
  },
  methods: {
    handleSizeChange(val){
      this.size = val
      this.queryInfo('click')
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage;
      this.queryInfo()
    },
    queryInfo(type){
      this.loading = true
      if(type==='click'){  //如果是通过点击查询按钮进行搜索的话，就初始化当前页码为第1页
        this.currentPage = 1
      }
      getInventories({
        page:this.currentPage,
        size:this.size,
        productId:this.selectInfo.productId,
        warehouseId:this.selectInfo.warehouseId,
        showZero:this.selectInfo.showZero
      })
      .then((res)=>{
        if(this.total!==res.data.totalRecordNumber&&type!=='click'){ //如果现在的 total 和 返回的 totalPageNumber 不同就是说明搜索的结果不对了,重新进查询
          this.$message({
            message: '操作出错,已重新查询',
            type: 'warning'
          })
          this.currentPage = 1
          this.queryInfo('click')
        }else{
          this.tableData = res.data.data
          this.pageCount = res.data.totalPageNumber
          this.total = res.data.totalRecordNumber
        }
        this.loading = false
      })
      .catch((error)=>{
        console.log(error)
        this.loading = false
      })
    },
    selectProduct (p) {
      this.selectInfo.productId = p.toString()
    },
  },
  mounted(){
    this.queryInfo('click')
  }
}
  
</script>
  