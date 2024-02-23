<template>
    <div v-if="hideTipsBar">
      <el-tooltip v-if="hideTip" class="item" effect="dark" content="收起工具栏" placement="top">
        <el-button  icon="el-icon-arrow-right" style="float: right;margin-top: 5px;margin-left: 5px;" circle size="mini" @click="hideTips"></el-button>
      </el-tooltip>
      <el-tooltip v-if="!hideTip" class="item" effect="dark" content="打开工具栏" placement="top">
        <el-button icon="el-icon-arrow-left" style="float: right;margin-top: 5px;margin-left: 5px;" circle size="mini" @click="hideTips"></el-button>
      </el-tooltip>
      <div v-if="hideTip" id="tipsButton">
        <el-tooltip class="item" effect="dark" content="导出为excel" placement="top">
          <el-button icon="el-icon-document" style="float: right;margin-top: 5px;margin-left: 5px;" circle size="mini" @click="outputExcel"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="打印表格" placement="top">
          <el-button icon="el-icon-printer" style="float: right;margin-top: 5px;margin-left: 5px;" circle size="mini" @click="billPrintClick"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="显示/隐藏表格列" placement="top">
          <el-button icon="el-icon-edit" style="float: right;margin-top: 5px;margin-left: 5px;" circle size="mini" @click="showTrans"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="刷新表格" placement="top">
          <el-button icon="el-icon-refresh" style="float: right;margin-top: 5px;" circle size="mini" @click="refreshTable"></el-button>
        </el-tooltip>
      </div>
      <el-dialog title="打印设置" :visible.sync="dialogPrint" >
        <el-form style="padding-right: 20px;">
          <el-form-item label="缩放比例" label-width="100px">
            <el-slider v-model="printSet.zoom" :step="10" :min="50" :max="100" show-input show-stops></el-slider>
          </el-form-item>
          <el-form-item label="横向纵向" label-width="100px">
            <el-radio-group v-model="printSet.vertical">
              <el-radio-button label="横向"></el-radio-button>
              <el-radio-button label="纵向"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="水印类型" label-width="100px">
            <el-radio-group v-model="printSet.waterMarkType">
              <el-radio-button label="单一"></el-radio-button>
              <el-radio-button label="循环"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="序列号显示" label-width="100px">
            <el-switch
              v-model="printSet.serial"
              active-text="显示"
              inactive-text="不显示">
            </el-switch>
          </el-form-item>
          <el-form-item label="需要水印" label-width="100px">
            <el-switch
              v-model="printSet.waterMark"
              active-text="显示"
              inactive-text="不显示">
            </el-switch>
          </el-form-item>
          <el-form-item label="纸张类型" label-width="100px">
            <el-select v-model="printSet.paperType" placeholder="请选择">
              <el-option
                v-for="item in paperTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="注意事项: " label-width="100px">
            <span style="color: red;">水印类型中 循环水印 对机器配置要求较高请谨慎使用！</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogPrint = false">取 消</el-button>
          <el-button type="primary" @click="surePrint">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { mapGetters } from 'vuex'
export default {
  name: 'tipsBar',
  props:['hideToggleColum','multipleSelection','tableColumList','templateName','dataTable','currentPages','hideTipsBar'],
  data() {
    return {
      firstTrans: true,
      hideTip: true, //表单工具按钮的显示和隐藏

      dialogPrint: false, //打印设置弹窗的显示

      printSet:{//打印设置
        zoom: 100,
        vertical: '横向',
        serial: true,
        waterMark: true,
        paperType: 'A4',
        waterMarkType: '单一'
      },
      paperTypes:[//打印纸格式
        {
          value: 'A4',
          label: 'A4'
        }
      ],
    }
  },
  methods:{
    doExportExcel(){//执行表格 导出为excel文件
      let wb = ''
      if(this.hideToggleColum&&this.multipleSelection.length>0){//如果有多选框并且选择的条数大于0，则进行自定义导出
        //使用json直接导出
        // let handleData = []
        // //自定义打印
        // //处理多选 内容，将显示的字段打印出来
        // for(let i = 0 ;i< this.multipleSelection.length;i++){
        //   let thisRowData = {}
        //   thisRowData["序号"]=i+1
        //   for(const element of this.tableColumList){
        //     if(typeof(this.multipleSelection[i][element.columItemName])==='boolean'){//如果是布尔类型，替换成是否
        //       thisRowData[element.columItemLable] = this.multipleSelection[i][element.columItemName]?'是':'否'
        //     }else{
        //       thisRowData[element.columItemLable] = this.multipleSelection[i][element.columItemName]
        //     }
        //   }
        //   handleData.push(thisRowData)
        // }
        //let ws = XLSX.utils.json_to_sheet(handleData)//数据放上去


        //利用array转换之后导出
        let dataArray = []
        //自定义表头内容
        let diyHeader = [this.templateName.slice(0, -2)+"-第"+this.currentPages+"页的内容信息"]
        dataArray.unshift(diyHeader)

        let headerList = []//表头
        headerList.push('序号')
        for(const element of this.tableColumList){//表头数据
          headerList.push(element.columItemLable)
        }
        dataArray.push(headerList)

        for(let i = 0 ; i < this.multipleSelection.length; i++){//表内容每行
          let thisRow = []
          thisRow.push(i+1)
          for(const element of this.tableColumList){
            if(typeof(this.multipleSelection[i][element.columItemName])==='boolean'){
              this.multipleSelection[i][element.columItemName]?thisRow.push('是'):thisRow.push('否')
            }else{
              thisRow.push(this.multipleSelection[i][element.columItemName])
            }
          }
          dataArray.push(thisRow)
        }
        let ws = XLSX.utils.aoa_to_sheet(dataArray)

        wb = XLSX.utils.book_new()
        
        XLSX.utils.book_append_sheet(wb, ws, this.templateName.slice(0, -2)+"-第"+this.currentPages+"页")

        //合并单元格
        ws["!merges"] = [{ s: { c: 0, r: 0 }, e: { c: headerList.length-1, r: 0 } }]
        //行高
        ws["!rows"] = [{ hpx: 50 }] //设置第1行行高为50像素
        //列宽
        // wb.Sheets[this.templateName.slice(0, -2)+"-第"+this.currentPages+"页"]['!cols'] = [
        //   { wpx: 200 }, //设置第1列列宽为200像素
        //   { wch: 50 },  //设置第2列列宽为50字符
        // ]

        //居中  xlsx插件免费版没办法修改样式，能修改样式的专业版要七百多刀
        // ws['A1'].s={
        //   alignment:{
        //     horizontal:"center",
        //     vertical:'center',
        //   },
        //   font: { bold: true },
        // }
      }else if(!this.hideToggleColum){
        //默认打印（全部打印）  根据表格内容来
        let xlsxParam = { raw: true };
        let fix = document.querySelector(".el-table__fixed-right")
        if (fix) {  //为了防止固定列 重复导出的bug出现， 如果  固定列存在  直接删掉固定列，后面在加上
          wb = XLSX.utils.table_to_book(
            document.querySelector("#tableData").removeChild(fix),
            xlsxParam
          );
          document.querySelector("#tableData").appendChild(fix);
        } else {
          wb = XLSX.utils.table_to_book(document.querySelector("#tableData"),xlsxParam);
        }
      }else{
        this.$message({
          type: 'warning',
          message: '请确认是否勾选了数据!'
        })
      }

      /* 获取二进制字符串作为输出 */
      let wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          //Blob 对象表示一个不可变、原始数据的类文件对象。
          //Blob 表示的不一定是JavaScript原生格式的数据。
          //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          new Blob([wbout], { type: "application/octet-stream" }),
          //设置导出文件名称
          this.templateName.slice(0, -2)+"-第"+this.currentPages+"页.xlsx"
        );
        this.$message({
          type: 'success',
          message: '已成功导出!'
        })
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    outputExcel(){//导出为excel
      this.$confirm('您需要将该页面导出为excel文件吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((res) => {
          this.doExportExcel()
        }).catch((err)=>{
          this.$message({
            type: 'info',
            message: '操作已取消!'
          })
        })
    },
    showTrans(){//显示穿梭框
      this.$emit("toShowTrans",true)
    },
    refreshTable(){//刷新表格
      this.$emit("refreshTable",true)
    },
    hideTips(){//隐藏/显示 表单工具按钮
      if(this.hideTip){//判断是否已经隐藏了
        tipsButton.classList.add('rightGo')//给id="tipsButton"的元素，添加右移动画
        setTimeout(() => {//0.5秒后进行隐藏
          this.hideTip=!this.hideTip
        }, 500)
      }else{
        this.hideTip=!this.hideTip
      }
    },
    surePrint(){//确认打印
      this.printJson({
        title: this.templateName.slice(0, -2)+"-第"+this.currentPages+"页",  // 打印出来的标题
        data: JSON.parse(JSON.stringify(this.dataTable)),  // 需要打印的数据,深拷贝
        serial: this.printSet.serial,  // 是否需要打印序列号
        fields: this.tableColumList,  // 需要打印的字段
        currentPages:this.currentPages, //当前页
        pageSize:this.pageSize,//每页多少条目
        waterMark: this.printSet.waterMark,//是否启用水印
        waterMarkContent: '赞赞 '+this.name,  //水印内容
        zoom:this.printSet.zoom,//缩放比例
        vertical:this.printSet.vertical,//横向纵向
        paperType:this.printSet.paperType,//纸张类型
        waterMarkType:this.printSet.waterMarkType//水印类型
        // properties: [ // 需要打印的字段对应的表头名
        //   {
        //     field: "name",
        //     displayName: "姓名",
        //   },
        // ],
      })
      this.dialogPrint = false
    },
    billPrintClick(){//打印相关设置
      this.dialogPrint = true
    },
  },
  computed:{
    ...mapGetters([
      'name',
      'userId'
    ])
  },
}
</script>
<style scoped>
/* 动画设置0.5秒 */
#tipsButton{
  transition:all 0.5s;
}
/* 动画右移按X轴，130px */
#tipsButton.rightGo{
  transform:translateX(130px);
}
</style>