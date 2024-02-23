<!-- 修改（新增）页面 -->
<template>
    <div style="padding: 20px 30px 20px 10px;">
        <el-page-header @back="goBack" title="返回" content="修改(新增)页面" style="margin-bottom: 20px;">
        </el-page-header>

        <el-divider content-position="left">
            注意：文件导入（可拖拽）生成表单的方式（只能拖入单个文件）中，表头内容必须和表单的标签说明一致才能够显示正确，当前暂不支持连同明细的导入
        </el-divider>
        
        <el-button
            type="primary"
            @click="goExcel"
            style="margin: 20px 50px 20px 20px">
            导入excel表格
        </el-button>
        <el-dialog title="导入excel表格,只支持xlsx/xls/csv格式，单个文件,小于1M" :visible="isShow" @close="closeShow">
            <div class="upload-excel">
                <div class="btn-upload">
                    <el-button
                        :loading="loading"
                        size="mini"
                        type="primary"
                        @click="handleUpload">
                        点击上传
                    </el-button>
                </div>
                <input
                    ref="excel-upload-input"
                    class="excel-upload-input"
                    type="file"
                    accept=".xlsx, .xls .csv"
                    @change="handleClick"/>
                <div
                    class="drop"
                    @drop="handleDrop"
                    @dragover="handleDragover"
                    @dragenter="handleDragover">
                    <i class="el-icon-upload" />
                    <span>将文件拖到此处</span>
                </div>
            </div>
        </el-dialog>

        <!-- <el-row :gutter="24" style="margin-bottom: 10px">
            <el-col :span="14"><span style="color: red;">导入操作</span></el-col>
            <el-col :span="6">
                <input
                    ref="excel-upload-input"
                    class="excel-upload-input"
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    @change="handleClick"
                />
            </el-col>
            <el-col :span="4">
                <div
                    class="drop"
                    @drop="handleDrop"
                    @dragover="handleDragover"
                    @dragenter="handleDragover">
                <el-button
                    :loading="loading2"
                    class="eidt"
                    size="mini"
                    type="primary"
                    @click="handleUpload">拖入</el-button>
                </div>
            </el-col>
        </el-row> -->
    


       <!-- <el-table
          id="tableId"
          :data="tableData"
          border
          highlight-current-row
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column
            v-for="item of tableHeader"
            :key="item"
            :prop="item"
            :label="item"
          />
        </el-table> -->
        <el-card class="box-card" v-for="(form, index) in dynamicValidateForm" shadow="hover" :style="index===0?'':{'margin-top':'20px'}">
            <div slot="header" class="clearfix">
                <span>新增详情: {{ index+1 }}</span>
            </div>
            <el-form label-width="180px" class="demo-dynamic" :selfUpdate="true">
                <el-form-item
                    v-for="(item,paramIndex) in getInterfaceParamObject"
                    :label="item"
                    :key="paramIndex"
                    style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis">
                    <el-row>
                        <el-col :span="16">
                            <el-input v-if="getItemInfo(dynamicValidateForm[index].interfaceParamList[0][paramIndex])===0" :placeholder="'请输入'+item" v-model.lazy="dynamicValidateForm[index].interfaceParamList[0][paramIndex]"></el-input>
                            <el-switch
                                v-else-if="getItemInfo(dynamicValidateForm[index].interfaceParamList[0][paramIndex])===1"
                                v-model="dynamicValidateForm[index].interfaceParamList[0][paramIndex]"
                                active-text="是"
                                inactive-text="否">
                            </el-switch>
                            <el-input-number v-else-if="getItemInfo(dynamicValidateForm[index].interfaceParamList[0][paramIndex])===3" v-model="dynamicValidateForm[index].interfaceParamList[0][paramIndex]" controls-position="right" ></el-input-number>
                            <el-input v-else-if="getItemInfo(dynamicValidateForm[index].interfaceParamList[0][paramIndex])===2" text="明细" :disabled="true"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-collapse v-if="showDetails">
                    <el-collapse-item title="细节显示(注意: 商品详细信息字段为可选传入,如传入会单独在单据中单独保存一份商品信息数据)">
                        <el-card class="box-card" v-for="(detailsList,detailsListIndex) in dynamicValidateForm[index].interfaceParamList[0].details" :style="detailsListIndex===0?'':{'margin-top':'20px'}">
                            <div slot="header" class="clearfix">
                                <span>细节详情 {{ detailsListIndex+1 }} </span>
                            </div>
                            <el-form-item v-for="(detail,detailIndex) in getDetailsObject" :key="detailIndex" :label="detail">
                                <el-row>
                                    <el-col :span="16">
                                        <el-input v-if="getItemInfo(dynamicValidateForm[index].interfaceParamList[0].details[detailsListIndex][detailIndex])===0" :placeholder="'请输入'+detail" v-model.lazy="dynamicValidateForm[index].interfaceParamList[0].details[detailsListIndex][detailIndex]"></el-input>
                                        <el-switch
                                            v-else-if="getItemInfo(dynamicValidateForm[index].interfaceParamList[0].details[detailsListIndex][detailIndex])===1"
                                            v-model="dynamicValidateForm[index].interfaceParamList[0].details[detailsListIndex][detailIndex]"
                                            active-text="是"
                                            inactive-text="否">
                                        </el-switch>
                                        <el-input-number v-else="getItemInfo(dynamicValidateForm[index].interfaceParamList[0].details[detailsListIndex][detailIndex])" v-model="dynamicValidateForm[index].interfaceParamList[0].details[detailsListIndex][detailIndex]" controls-position="right" ></el-input-number>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click.prevent="removeFormDetails(index,detailsListIndex)" v-if="creatInfo" type="danger">删除明细</el-button>
                            </el-form-item>
                        </el-card>
                        <el-button @click="addFormDetails(index)" v-if="creatInfo" style="margin-top: 20px;">新增明细</el-button>
                    </el-collapse-item>
                </el-collapse>
                <el-form-item>
                    <el-button @click.prevent="removeForm(index)" v-if="index!=0&&creatInfo" type="danger">删除</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <div style="margin-top: 20px;">
            <el-button @click="addForm" v-if="creatInfo">新增表单</el-button>
            <el-button type="primary" @click="submitForm" :loading="loading">提交所有</el-button>
        </div>
        <el-backtop></el-backtop>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { updateInfo } from '@/api/table'
import * as XLSX from "xlsx";
export default {
    name:'infoDetail',
    data(){
        return{
            detailInfo:[],   // 详细信息
            updateDetailInfo: {},  // 用于更新的详细信息
            dynamicValidateForm: [],      // 所需要提交的表单列表         
            getInterfaceParamObject:{},     // 获取 参数对象 
            interfaceParamObj:{},   // 参数对象
            creatInfo: true,  // 是否新增，如果时新增，就有新增按钮，否则就是直接将这些数据列出来
            loading: false,
            limit: 20,

            showDetails: false,  // 显示细节下拉框
            detailsObjInfo:[],  // 细节对象信息
            getDetailsObject:{},  // 细节对象
            newDetaislInfo: {},  // 用于更新的细节详细信息

            submitInfo:[],  // 格式化后的上传信息

            tableData: [],
            loading2: false,
            tableHeader: [],
            formData: [],

            isShow:false
        }
    },
    methods: {
        goExcel(){//打开EXCEL文件导入弹框
            this.isShow = true
        },
        closeShow() {//关闭excel文件导入弹窗
            this.isShow = false;
        },
        doTableData(){//处理表格数据放入表单中,放入之前要把第一个dynamicValidateForm表单给取消，因为新增默认是会显示第一个空表单的
            this.dynamicValidateForm.splice(0,1)
            for(const dataItem of this.tableData){
                let dataObj = {}
                for(let i =0 ;i< Object.values(this.getInterfaceParamObject).length;i++){
                    let objKey = Object.keys(this.getInterfaceParamObject)[i]
                    let objValue = dataItem[Object.values(this.getInterfaceParamObject)[i]]
                    objValue==='[]'?objValue=JSON.parse(objValue):objValue//如果表单的数据是'{}'，则他是details，把它的值变为object对象
                    dataObj[objKey]=objValue
                }
                this.dynamicValidateForm.push({    // 所需要提交的表单列表
                    interfaceParamList:[dataObj]   // 接口所需要提交的参数的列表
                })
            }
        },
        // 点击导入
        handleDrop(e) {
            e.stopPropagation();
            e.preventDefault();
            if (this.loading) return;
            const files = e.dataTransfer.files;
            if (files.length !== 1) {
                this.$notify.error({
                    title: '错误',
                    message: '仅支持单个上传一个文件',
                    duration: 1000
                });
                return;
            }
            const rawFile = files[0]; // 获取文件信息
            if (!this.isExcel(rawFile)) {
            //是不是excel文件
                this.$notify.error({
                    title: '错误',
                    message: '仅支持 .xlsx, .xls, .csv 文件格式上传',
                    duration: 1000
                });
                return false;
            }
            this.upload(rawFile);
            e.stopPropagation();
            e.preventDefault();  
        },
        handleDragover(e) {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
        },
        handleUpload() {
            this.$refs["excel-upload-input"].click(); //触发表单上传事件，跳出选择文件框
        },
        handleClick(e) {
            const files = e.target.files;
            const rawFile = files[0]; // only use files[0]
            if (!rawFile){
                this.$notify.error({
                    title: '错误',
                    message: '无法读取该文件',
                    duration: 1000
                });
                return
            }else if(!this.isExcel(rawFile)){
                this.$notify.error({
                    title: '错误',
                    message: '仅支持 .xlsx, .xls, .csv 文件格式上传',
                    duration: 1000
                });
                return
            }
            this.upload(rawFile);
        },
        upload(rawFile) {
            this.$refs["excel-upload-input"].value = null; // fix can't select the same excel
            if (!this.beforeUpload) {
                this.readerData(rawFile);
                return;
            }
            const before = this.beforeUpload(rawFile); //判断文件上传大小
            if (before) {
                this.readerData(rawFile); //把excel转化成数组
            }
        },
        beforeUpload(file) {
            const isLt1M = file.size / 1024 / 1024 < 1;
            if (isLt1M) {
                return true;
            }
            this.$notify.error({
                title: '错误',
                message: '请不要上传大于1M的文件',
                duration: 1000
            });
            return false;
        },
        readerData(rawFile) {
            this.loading = true;
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsArrayBuffer(rawFile);
                //参数可以是 Blob 或者 File 对象异步结果将在onload 事件中体现
                reader.onload = (e) => {
                    const data = e.target.result;
                    //console.log(data);
                    const workbook = XLSX.read(data, { type: "array" });
                    //console.log("workbook", workbook);
                    //看下图
                    const firstSheetName = workbook.SheetNames[0];
                    // console.log("firstSheetName",firstSheetName);// "SheetJS" 取出工作表名称
                    const worksheet = workbook.Sheets[firstSheetName]; //取出工作表名称对应的表格数据
                    const header = this.getHeaderRow(worksheet); //表头名
                    // console.log("header",header);
                    const results = XLSX.utils.sheet_to_json(worksheet); //输出数据，除去表头
                    //{timestamp: "2017-01-01 07:37:20",title: "Mtiwxlj Cqcdg Hvbjijr Vgmeey Wwznq Ljjnkvbz",
                    //type: "US",importance: 2,status: "draft"} results的其中一列数据
                    this.tableData = results;
                    this.tableHeader = header;
                    this.loading = false;
                    this.doTableData()
                    this.$notify.success({
                        title: '成功',
                        message: '已经成功导入excel文档数据',
                        duration: 1500
                    });
                    this.isShow=false
                    resolve();
                };
            });
        },
        getHeaderRow(sheet) {
            const headers = [];
            const range = XLSX.utils.decode_range(sheet["!ref"]); //!ref: "A1:E21"
            // console.log(range);
            // s: {c: 0, r: 0} 开始为A1
            // e: {c: 4, r: 20} 结束为 E21
            let C;
            const R = range.s.r;
            /* start in the first row */
            for (C = range.s.c; C <= range.e.c; ++C) {
            /* walk every column in the range */
                const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
                // console.log(cell); A1的对象的值
                /* find the cell in the first row */
                let hdr = "UNKNOWN " + C; // <-- replace with your desired default
                if (cell && cell.t){//不为空才push表头
                    hdr = XLSX.utils.format_cell(cell);
                    headers.push(hdr);
                }
            }
            return headers;
        },
        isExcel(file) {
            return /\.(xlsx|xls|csv)$/.test(file.name);
        },
        judgeParamsType(parmasObj,showObj){   // 判断参数类型:parmasObj 是 参数的对象，showObj是页面上要显示的对象
            for(const element of Object.keys(parmasObj)){   // 获取参数列表中的键，去生成一个参数对象
                let cutIndex  = parmasObj[element].lastIndexOf("_")  // 获取 _ 为分割标志的 下标 
                let paramsType = ''
                if(cutIndex!==-1){   // 如果没有找到，则 该类型是string类型
                 // 找到了，截取参数类型和参数名称
                    paramsType = parmasObj[element].slice(cutIndex+1)   // 获取 参数类型 
                }
                if(paramsType==="布尔"){  // 如果 参数 是 bool
                    showObj[element]=false
                }else if(paramsType==="整数"||paramsType==="小数"){  // 如果参数是 int（整数） 或 decimal（小数） ，js中整数和小数都是number类型
                    showObj[element]=0
                }else if(element==="details"&&this.showDetails!==true){   // 如果 有 details ，则进行细节列表的显示  details 是个列表不止一个元素
                    this.showDetails = true
                    this.getDetailsObject = this.table.DIYTableKey_up[this.$route.query.type+'_details']   // 获取接口类型的细节
                    showObj[element] = this.detailsObjInfo
                }else{
                    showObj[element]=""
                }
            }
        },
        goBack(){   // 返回上一页，并关闭tag标签
            this.$router.back()
            let tag = {
                type: "dark",
                title: "新增(修改)详情页",
                path: "/detail/infoDetail"
            }
            this.$store.dispatch('settings/closeTags', tag)
            .then(res=>{})
        },
        getItemInfo(item){  //获取数据类型，从而判断该显示什么
            if(typeof(item)==="boolean"){//如果值是boolean类型，布尔类型显示swich开关
                return 1
            }else if(typeof(item)==="object"&&item!==null){//如果值是对象类型且不为空,那就是明细呀
                return 2
            }else if(typeof(item)==="number"){//如果值是数字类型，那就显示数字框
                return 3
            }else{//其他的就是普通文本框
                return 0
            }
        },
        submitForm(){
            this.loading = true
            this.submitInfo = [] // 每次进来初始化提交信息列表
            //console.log(this.dynamicValidateForm)
            // 提交的格式修改
            for(const element of this.dynamicValidateForm){
                this.submitInfo.push(element.interfaceParamList[0])
            }
            console.log(this.submitInfo)
            this.loading = false
            this.$message.success("该信息已提交")

            // updateInfo(this.submitInfo,this.$route.query.type)
            // .then((res)=>{
            //     console.log(res)    
            //     this.loading = false
            // })
            // .catch((error)=>{
            //     console.log(error)
            //     this.loading = false
            // })
        },
        removeForm(index) {
            this.dynamicValidateForm.splice(index, 1)
        },
        removeFormDetails(index,detailsListIndex) {
            this.dynamicValidateForm[index].interfaceParamList[0].details.splice(detailsListIndex, 1)
        },
        addFormDetails(index){
            this.dynamicValidateForm[index].interfaceParamList[0].details.push(JSON.parse(JSON.stringify(this.newDetaislInfo)))
        },
        addForm() {  // 添加数据表单，但是一次性最多只能提交20条数据
            if(this.dynamicValidateForm.length>this.limit-1){
                this.$message({
                    showClose: true,
                    message: '一次性添加最多只能提交'+this.limit+'条数据',
                    type: 'error'
                })
            }else{
                this.dynamicValidateForm.push({    // 所需要提交的表单列表
                    interfaceParamList:[JSON.parse(JSON.stringify(this.interfaceParamObj))]   // 接口所需要提交的参数的列表，每一个列表都是独立的所以需要深拷贝
                })
                if(this.showDetails){
                    this.dynamicValidateForm[this.dynamicValidateForm.length-1].interfaceParamList[0].details.push(JSON.parse(JSON.stringify(this.newDetaislInfo))) //初始化之后插入到细节信息列表
                }
            }
        },
        doInit(info){
            if(info===undefined){   //如果获取到的信息是空的，那就是 新增，否则就是 更改信息
                console.log("我是新增")
                this.creatInfo = true
                if(this.showDetails){
                    this.judgeParamsType(this.getDetailsObject,this.newDetaislInfo)
                }
            }else{
                console.log("我是更新")
                //console.log(info)
                this.creatInfo = false
                if(typeof(info)==="string"||typeof(info[0])==="string"){  //如果获取到的不是object对象类型，则返回上一页
                    this.$message({
                        showClose: true,
                        message: '数据出错啦，将返回上一页',
                        type: 'error'
                    })
                    this.goBack()
                }else{
                    if(info.length===undefined){   //如果传过来的信息长度不存在，就是 单个的更新 ，否则就是 批量更新
                        let updateDetailInfo = {}
                        for(const element of Object.keys(this.interfaceParamObj)){ 
                            updateDetailInfo[element] = info[element]
                        }
                        this.detailInfo.push(updateDetailInfo)
                        this.dynamicValidateForm[0].interfaceParamList = this.detailInfo
                    }else{
                        for(let i=0;i<info.length;i++){
                            let updateDetailInfo = {}
                            for(const element of Object.keys(this.interfaceParamObj)){
                                updateDetailInfo[element] = info[i][element]
                            }
                            this.detailInfo.push(updateDetailInfo)
                        }
                        this.dynamicValidateForm[0].interfaceParamList[0] = this.detailInfo[0]
                        for(let i = 1;i<this.detailInfo.length;i++){
                            this.dynamicValidateForm.push({
                                interfaceParamList:[this.detailInfo[i]]
                            })
                        }
                    } 
                }
            }   
        }
    },
    mounted(){
        if(this.$route.query.type===undefined){  // 前面穿过来的type字段是必有的，如果前面传过来没有type这个字段，则保存并返回上一页
            this.$message({
                showClose: true,
                message: '数据出错啦，将返回上一页',
                type: 'error'
            })
            this.goBack()
        }
        this.getInterfaceParamObject = this.table.DIYTableKey_up[this.$route.query.type]  // 根据获取的参数类型去获取接口参数列表
        if(this.$route.query.limit!==undefined){  // limit 不是前一个页面必传过来的值，如果没有这个值，就不获取，直接使用默认的
            this.limit = this.$route.query.limit   // 获取条数限制
        } 
        this.judgeParamsType(this.getInterfaceParamObject,this.interfaceParamObj)
        this.dynamicValidateForm.push({    // 给第一个表单赋值 所需要提交的表单列表
            interfaceParamList:[JSON.parse(JSON.stringify(this.interfaceParamObj))]   // 接口所需要提交的参数的列表，每一个列表都是独立的所以需要深拷贝
        })
        this.doInit(this.$route.query.info)
        console.log(this.getInterfaceParamObject)
    },
    computed: {
        ...mapState(['table']),
    },
}
</script>
<style scoped lang="scss">
.upload-excel {
  display: flex;
  justify-content: center;
  // margin-top: 100px;
  .excel-upload-input {
    display: none;
    z-index: -9999;
  }
  .btn-upload,
  .drop {
    border: 1px dashed #bbb;
    width: 350px;
    height: 160px;
    text-align: center;
    line-height: 160px;
  }
  .drop {
    line-height: 80px;
    color: #bbb;
    i {
      font-size: 60px;
      display: block;
    }
  }
}
</style>
