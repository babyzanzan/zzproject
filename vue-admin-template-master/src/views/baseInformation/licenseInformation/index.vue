<!-- 证照设置页面 -->
<template>
  <div class="app-container">
    <el-select v-model="clientType" placeholder="请选择" @change="clientTypeSelect">
      <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
      </el-option>
    </el-select>
    <!-- <el-button type="warning" style="margin-left: 10px" @click="toAdd">新增证件信息</el-button> -->
    <el-button type="success" style="margin-left: 10px" @click="uploadCard = true">上传证照图片</el-button>
    <el-drawer
      title="上传证照图片"
      :before-close="handleClose"
      :visible.sync="uploadCard"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
      size="45%"
      >
      <div class="demo-drawer__content">
        <el-form :model="form" :rules="rules">
          <el-row>
            <el-form-item label="往来户类型ID" :label-width="formLabelWidth" prop="ClientTypeId">
              <el-col :span="15">
                <el-input v-model="form.ClientTypeId" placeholder="请输入往来户类型ID"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="往来户ID" :label-width="formLabelWidth" prop="ClientId">
              <el-col :span="15">
                <el-input v-model="form.ClientId" placeholder="请输入往来户ID"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="类型ID" :label-width="formLabelWidth" prop="CardTypeId">
              <el-col :span="15">
                <el-input v-model="form.CardTypeId" placeholder="请输入类型ID"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="文件数组" :label-width="formLabelWidth">
              <el-upload
                action="#"
                list-type="picture-card"
                :auto-upload="false"
                :multiple="true"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-change="uploadFiles"
                :file-list="fileList">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
          </el-row>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button style="margin-left: 40%;width: 15%;" type="primary" @click="uploadCardSubmit" :loading="loadingDrawer">{{ loadingDrawer ? '提交中 ...' : '提交' }}</el-button>
        </div>
      </div>
    </el-drawer>
    <el-row style="margin-top: 10px;" :gutter="20">
      <el-col :span="6">
        <div class="grid-content">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span>证件类型</span>
            </div>
            <div v-for="o in tableData" :key="o.id" class="text item">
              <el-tooltip class="item" effect="dark" :content="o.name" placement="top">
                <el-col :span="22" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;margin-top: 10px">
                  <el-button type="text" @click="showItemDetail(o)">{{ o.name }}</el-button>
                </el-col>
              </el-tooltip>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="18" v-if="showCertificatephoteInfo">
        <div class="grid-content">
          <el-form label-width="100px">
            <el-tabs type="border-card">
              <el-tab-pane label="证件信息">
                <el-form-item>
                  <el-col :span="16">
                    证件类型选择是：{{ certificatephoteType.name }}
                  </el-col>
                </el-form-item>
                <el-form-item label="货主往来户id">
                  <el-col :span="10">
                    <el-input placeholder="请输入货主往来户id" v-model="clientsId" clearable></el-input>
                  </el-col>
                  <el-col :span="5">
                    <el-button @click="getClientTypeInfo('click')">查询</el-button>
                  </el-col>
                </el-form-item>
                <DIYtable templateName="证照信息模板" :pageSize="size" :currentPages="currentPage" :loaded="loading2" :viewType="type" :dataTable="tableDataInfo"></DIYtable>
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
                    layout="total, prev, pager, next, jumper"
                    :hide-on-single-page="true"
                    style="margin-top: 10px;">
                  </el-pagination>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
import { getLicenseType,getLicenseInfo,uploadCardImages } from '@/api/table' 
import DIYtable from '@/components/DIYtable/index.vue'
const res = {
  "currentPageIndex": 1,
        "totalPageNumber": 1,
        "currentPageSize": 1,
        "totalRecordNumber": 1,
        "data":[
            {
                "id": 1,
                "relatedId": "11111",
                "name": "迪迦",
                "cardTypeId": 1,
                "cardTypeName": "营业执照  ",
                "cardNumber": "ABCDEFG",
                "holderName": "M78星云",
                "expiryDate": null,
                "notes": ""
            },
            {
                "id": 2,
                "relatedId": "22222",
                "name": "盖亚",
                "cardTypeId": 1,
                "cardTypeName": "营业执照  ",
                "cardNumber": "GEFDCBA",
                "holderName": "M77星云",
                "expiryDate": "2036-10-16",
                "notes": ""
            }]
}




export default {
  name:'certificatephote',
  components:{
    DIYtable,
  },
  data() {
    return {
      dialogImageUrl: '',   //上传图片的地址
      dialogVisible: false, // 上传图片可视化
      uploadCard: false,
      tableData: [],
      tableDataInfo: [],
      loading2: false,    // 第二个表单（证照信息）的加载
      loadingDrawer:false,  // 抽屉的加载
      showCertificatephoteInfo:false,  // 显示证照信息栏
      certificatephoteType:{
        id:0,
        name:''
      },
      clientsId:'',  // 查询所用的来往户Id
      total:0,   // 数据总数
      currentPage:1,  // 当前页面
      size:10,//每页显示的条数
      pageCount:1,//总页数
      clientType:'',
      type:'clients_cards',
      options: [{
          value: 0,
          label: '全部'
        }, {
          value: 1,
          label: '客户'
        }],
      form: {
        ClientTypeId:'',
        ClientId:'',
        CardTypeId:'',
        File:[]
      },
      formLabelWidth: '130px',
      fileList: [],
      rules: {
        ClientTypeId: [
            { required: true, message: '请输入往来户类型ID', trigger: 'blur' }
          ],
        ClientId: [
            { required: true, message: '请输入往来户ID', trigger: 'blur' },
            {  max: 50, message: '往来户ID最长50', trigger: 'blur' }
          ],
        CardTypeId: [
          { required: true, message: '请输入类型 ID', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSizeChange(val){
      this.size = val
      this.getClientTypeInfo('click')
    },
    uploadFiles(item,fileList){  //添加文件列
      console.log(fileList)
      console.log(item)
      this.form.File.push(item.raw)
    },
    handleRemove(file,fileList) {   //移除图片
      console.log(file,fileList)
    },
    handlePictureCardPreview(file) {   //预览图片
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadCardSubmit(){   // 提交上传
      this.loadingDrawer = true
      if(this.submitFormat()){
        console.log(this.form)
        uploadCardImages(this.form)
        .then((res)=>{
          console.log(res)
          this.$message({
            showClose: true,
            message: '已提交!',
            type: 'success'
          })
          this.loadingDrawer = false
        })
        .catch((error)=>{
          console.log(error)
          this.loadingDrawer = false
          this.$message({
            showClose: true,
            message: '出错啦!',
            type: 'error'
          })
        })
      }else{
        this.loadingDrawer = false
      }
    },
    submitFormat(){  // 上传时格式处理和验证
      if(this.form.ClientTypeId===''||this.form.ClientId===''||this.form.CardTypeId===''||this.form.File.length===0){
        this.$message({
          showClose: true,
          message: '请填写完整信息!',
          type: 'error'
        })
        return false
      }else{
        this.form.CardTypeId = parseInt(this.form.CardTypeId)
        this.form.ClientTypeId = parseInt(this.form.ClientTypeId)
        return true
      }
    },
    handleClose(done) {
      done()
    },
    toAdd(){  // 跳转到添加页面
      this.$router.push({path:'/detail/infoDetail',query: {type: this.type+'_up',limit:20}})
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage;
      //console.log(this.currentPage);   //点击第几页
      this.getClientTypeInfo()
    },
    clientTypeSelect(){   // 下拉框选择后获取证照类型

      let restemp = [{
            "id": 1,
            "name": "营业执照  "
        },
        {
            "id": 2,
            "name": "药品生产企业许可证"
        },
        {
            "id": 3,
            "name": "GMP/GSP证书"
        },
        {
            "id": 5,
            "name": "质量保证协议"
        }]

      this.tableData = restemp
      // getLicenseType({clientTypeId:this.clientType})
      // .then((res)=>{
      //   this.tableData = res.data
      // })
      // .catch((error)=>{
      //   console.log(error)
      // })
    },
    getClientTypeInfo(type){   // 选择证照类型之后获取该类证照信息
      this.loading2 = true
      if(type==='click'){  //如果是通过点击查询按钮进行搜索的话，就初始化当前页码为第1页
        this.currentPage = 1
      }
      if(this.clientType===1||this.clientType===2){  //如果 clientTypeId 为1或者2就可以提交
        
        // getLicenseInfo({page:this.currentPage,size:this.size,clientType:this.clientType,cardTypeId:this.certificatephoteType.id,clientId:this.clientsId})
        // .then((res)=>{

          if(this.total!==res.data.totalRecordNumber&&type!=='click'){ //如果现在的 total 和 返回的 totalPageNumber 不同就是说明搜索的结果不对了,重新进查询
            this.$message({
              message: '操作出错,已重新查询',
              type: 'warning'
            })
            this.currentPage = 1
            this.getClientTypeInfo('click')
          }else{
            this.tableDataInfo = res.data
            this.pageCount = res.totalPageNumber
            this.total = res.totalRecordNumber
          }
          this.loading2 = false
        // })
        // .catch((error)=>{
        //   console.log(error)
        //   this.loading2 = false
        // })
      }else{
        this.$message({
          showClose: true,
          message: '不能使用全部类型查询!',
          type: 'error'
        })
        this.loading2 = false
      }
    },
    showItemDetail(cardInfo){ //点击证照类型之后获取该证照的查询信息
      this.showCertificatephoteInfo = true
      this.certificatephoteType = cardInfo
      this.tableDataInfo = []  //初始化 证照类型 查询信息
      this.total = 0 //同时也初始化分页模块
      this.getClientTypeInfo('click')
    },
  },
}
</script>
