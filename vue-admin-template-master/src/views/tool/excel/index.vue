<template>
    <div>
        <input
            ref="excel-upload-input"
            class="excel-upload-input"
            type="file"
            accept=".xlsx, .xls"
            @change="handleClick"
          />
          <div
            class="drop"
            @drop="handleDrop"
            @dragover="handleDragover"
            @dragenter="handleDragover"
          >
            <el-button
              :loading="loading"
              class="eidt"
              size="mini"
              type="primary"
              @click="handleUpload">
              导入
            </el-button>
          </div>
 
       <el-table
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
        </el-table> 

        <el-input v-for="item of tableData" :key="Math.random()" v-model="item['商品名称']" placeholder="来自excel的数据"></el-input>
        
        {{ dotostring }}
        
    </div>
</template>
<script>
import Layout from '@/layout'
import * as XLSX from "xlsx";
export default {
  name:'excel',
  data() {
    return {
     dotostring: {},
     tableData: [],
     loading: false,
     tableHeader: [],
     formData: [],
    }
  },
  methods:{
    // 点击导入
    handleDrop(e) {
      e.stopPropagation();
      e.preventDefault();
      if (this.loading) return;
      const files = e.dataTransfer.files;
      if (files.length !== 1) {
        this.$message.error("仅支持单个上传一个文件");
        return;
      }
      const rawFile = files[0]; // 获取文件信息
      if (!this.isExcel(rawFile)) {
        //是不是excel文件
        this.$message.error(
          "Only supports upload .xlsx, .xls, .csv suffix files"
        );
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
      // console.log(e);
      const files = e.target.files;
      const rawFile = files[0]; // only use files[0]
      if (!rawFile) return;
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
      this.$message({
        message: "请不要上传大于1M的文件",
        type: "warning",
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
          console.log(data);
          const workbook = XLSX.read(data, { type: "array" });
          console.log("workbook", workbook);
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
          console.log(this.tableData)
          this.tableHeader = header;
          this.loading = false;
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
  },
  created(){    // 通过diytable中的 databaseSource 获取该表的信息
    let obj = 
    [
      {
        path: 'accountManagement',
        name: 'AccountManagement',
        component: '/systemInformation/accountManagement/index',
        meta: { title: '账号管理', icon: 'el-icon-s-custom' }
      },
      {
        path: 'formGenerator',
        name: 'FormGenerator',
        component: '/systemInformation/formGenerator/index',
        meta: { title: '表单生成工具', icon: 'el-icon-coffee-cup' }
      },
      {
        path: 'DIYtemplate',
        name: 'DIYtemplate',
        component: '/systemInformation/DIYtemplate/index',
        meta: { title: '自定义模板', icon: 'el-icon-brush' }
      },
      {
        path: 'wordSpeak',
        name: 'WordSpeak',
        component: '/systemInformation/wordSpeak/index',
        meta: { title: '文字语音播报', icon: 'el-icon-chat-dot-round' }
      },
      {
        path: 'workFlow',
        name: 'WorkFlow',
        component: '/systemInformation/workFlow/index',
        meta: { title: '工作流', icon: 'el-icon-s-marketing' }
      },  
      {
        path: 'javaCodeGenerator',
        name: 'JavaCodeGenerator',
        component: '/systemInformation/javaCodeGenerator/index',
        meta: { title: 'java代码生成器', icon: 'el-icon-thumb' }
      },
      {
        path: 'permissionDescription',
        name: 'PermissionDescription',
        component: '/systemInformation/permissionDescription/index',
        meta: { title: '权限说明', icon: 'el-icon-message-solid' }
      },
    ]
  
    this.dotostring=JSON.stringify(obj)
    console.log(JSON.parse(this.dotostring))
  }
}
</script>