<!-- 自定义表格，一个模板，具体的固定列需要额外增加 -->
<template>
  <div>

    <selectCondition
      :columList="tableColumList"
      :conditionList="conditionList"
      v-if="showQuery"
    />

    <tipsBar
     :hideToggleColum="hideToggleColum"
     :multipleSelection="multipleSelection"
     :tableColumList="tableColumList"
     :templateName="templateName"
     :dataTable="dataTable"
     :currentPages="currentPages"
     @refreshTable="refreshTableData"
     @toShowTrans="showTrans"
     :hideTipsBar="hideTips"
    />
    <el-dialog title="隐藏/显示列表" :visible.sync="dialogEditTableVisible" :before-close="handleCloseEdit" center>
      <el-transfer
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入查询关键字"
          v-model="transValue"
          :data="transData"
          :titles="['显示', '隐藏']"
          :button-texts="['显示', '隐藏']"
          @change="handleChange">
      </el-transfer>
    </el-dialog>
    <div class="draggable">
      <el-table
        :style="{'font-size': fontSize+'px'}"
        id="tableData"
        v-loading="loaded"
        :data="dataTable"
        style="width: 100%;"
        ref="multipleTable"
        stripe
        @selection-change="handleSelectionChange"
        row-key="id"
        empty-text="暂无数据"
        @row-contextmenu="onContextmenu">
        <el-table-column
          type="selection"
          :width="55 * fontSize / 14"
          v-if="hideToggle">
        </el-table-column>
        <el-table-column
          type="index"
          label="序号"
          :index="indexMethod"
          :width="60 * fontSize / 14">
        </el-table-column>
        <el-table-column draggable v-for="(item, index) in tableColumList"
          :align="item.columItemFontLocation===undefined?'left':item.columItemFontLocation"
          :key="index"
          :prop="item.columItemName"
          :label="item.columItemLable"
          :width="item.columItemWidth * fontSize / 14 "
          sortable
          show-overflow-tooltip
          class-name="allowDrag">
          <template slot-scope="scope">
            <div v-if="item.columItemType==='下拉框'">
              <el-select v-model="scope.row[item.columItemName]" clearable placeholder="请选择">
                <el-option
                  v-for="select in itemOption"
                  :key="select.wareId"
                  :label="select.wareName"
                  :value="select.wareName">
                </el-option>
              </el-select>
            </div>
            <div v-else-if="item.columItemType==='开关'">
              <el-switch 
                v-model="scope.row[item.columItemName]">
              </el-switch>
            </div>
            <div v-else-if="item.columItemType==='字符串'">
              {{ scope.row[item.columItemName] | formatItem(item.columItemFormat) }}
            </div>
            <div v-else-if="item.columItemType==='输入框'">
              <el-input
                placeholder="请输入内容"
                v-model="scope.row[item.columItemName]"
                clearable>
              </el-input>
            </div>
            <div v-else-if="item.columItemType==='计数器'">
              <el-input-number size="mini" v-model="scope.row[item.columItemName]"></el-input-number>
            </div>
            <div v-else-if="item.columItemType==='图片'">
              <el-image 
                style="width: 50px; height: 50px"
                :src="scope.row[item.columItemName]" 
                :preview-src-list="[scope.row[item.columItemName]]"
                fit="fill">
              </el-image>
            </div>
            <div v-else-if="item.columItemType==='日期'">
              <el-date-picker
                v-model="scope.row[item.columItemName]"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </div>
            <div v-else-if="item.columItemType.indexOf('标签')!==-1">
              <el-tag :type="item.columItemType.indexOf('-')!==-1?item.columItemType.slice(3):''">{{ scope.row[item.columItemName] }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="tableOption"
          fixed="right"
          label="操作"
          :width="optionColumWidth * fontSize / 14">
          <template slot-scope="scope">
            <el-button @click="showItemDetail(scope.row)" type="text" size="small" v-if="showLook">查看</el-button>
            <el-button @click="deleteItem(scope.row)" type="text" size="small" v-if="showDelete">移除</el-button>
            <el-button @click="DIYItemOption(scope.row,item)"
              v-for="item in DIYList"
              type="text" 
              size="small"
              v-if="showDIY">
              {{ item }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top: 20px" v-if="hideToggle">
      <el-button @click="toggleSelection()">取消选择</el-button>
      <el-button @click="toggleUpdate()">批量修改</el-button>
    </div>
  </div>
</template>
<script>
import { getDIYtable } from '@/api/table' 
import Sortable from 'sortablejs'
import { mapGetters } from 'vuex'
import tipsBar from './tipsBar.vue'
import selectCondition from './selectCondition.vue'
const res = [{
            "templateID": 5,
            "databaseSource": "bases_elusers_down",
            "editColumn": true,
            "menuClass": "[12]",
            "optionList": "[\u0022操作\u0022]",
            "sqlLanguage": "select * from Usersbases_elusers_down",
            "columList": "[{\u0022columItemWidth\u0022:100,\u0022columItemLable\u0022:\u0022用户ID\u0022,\u0022columItemName\u0022:\u0022id\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:120,\u0022columItemLable\u0022:\u0022用户名称\u0022,\u0022columItemName\u0022:\u0022userName\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:120,\u0022columItemLable\u0022:\u0022货主名称\u0022,\u0022columItemName\u0022:\u0022ownerName\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:100,\u0022columItemLable\u0022:\u0022头像\u0022,\u0022columItemName\u0022:\u0022avatar\u0022,\u0022columItemType\u0022:\u0022图片\u0022}]",
            "templateName": "人员设置模板",
            "useTips": ""
        },{
            "templateID": 2,
            "databaseSource": "products_down",
            "editColumn": true,
            "menuClass": "[9,10,12,14,22]",
            "optionList": "[\u0022查看\u0022,null]",
            "sqlLanguage": "select * from products_down",
            "columList": "[{\u0022columItemWidth\u0022:100,\u0022columItemLable\u0022:\u0022商品编码\u0022,\u0022columItemName\u0022:\u0022code\u0022,\u0022columItemType\u0022:\u0022字符串\u0022,\u0022columItemSelect\u0022:true},{\u0022columItemWidth\u0022:130,\u0022columItemLable\u0022:\u0022商品名称\u0022,\u0022columItemName\u0022:\u0022name\u0022,\u0022columItemType\u0022:\u0022字符串\u0022,\u0022columItemSelect\u0022:true},{\u0022columItemWidth\u0022:80,\u0022columItemLable\u0022:\u0022剂型\u0022,\u0022columItemName\u0022:\u0022unitType\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:120,\u0022columItemLable\u0022:\u0022批准文号\u0022,\u0022columItemName\u0022:\u0022alias\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:100,\u0022columItemLable\u0022:\u0022规格\u0022,\u0022columItemName\u0022:\u0022model\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:150,\u0022columItemLable\u0022:\u0022生产厂商\u0022,\u0022columItemName\u0022:\u0022fromPlace\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:150,\u0022columItemLable\u0022:\u0022上市许可持有人\u0022,\u0022columItemName\u0022:\u0022listingHolder\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:80,\u0022columItemLable\u0022:\u0022单位\u0022,\u0022columItemName\u0022:\u0022baseUnit\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:100,\u0022columItemLable\u0022:\u0022大包装\u0022,\u0022columItemName\u0022:\u0022unitRate\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:100,\u0022columItemLable\u0022:\u0022中包装\u0022,\u0022columItemName\u0022:\u0022midUnitRate\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:80,\u0022columItemLable\u0022:\u0022状态\u0022,\u0022columItemName\u0022:\u0022status\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:100,\u0022columItemLable\u0022:\u0022监管药品\u0022,\u0022columItemName\u0022:\u0022isSpecial\u0022,\u0022columItemType\u0022:\u0022字符串\u0022,\u0022columItemFormat\u0022:\u0022boolean\u0022},{\u0022columItemWidth\u0022:150,\u0022columItemLable\u0022:\u0022存储分类\u0022,\u0022columItemName\u0022:\u0022storage\u0022,\u0022columItemType\u0022:\u0022下拉框\u0022}]",
            "templateName": "商品设置模板",
            "useTips": ""
        },{
            "templateID": 12,
            "databaseSource": "clients_cards_down",
            "editColumn": false,
            "menuClass": "[9,12]",
            "optionList": "",
            "sqlLanguage": "数据来自接口 clients_cards_down",
            "columList": "[{\u0022columItemWidth\u0022:120,\u0022columItemLable\u0022:\u0022三方往来户ID\u0022,\u0022columItemName\u0022:\u0022id\u0022,\u0022columItemType\u0022:\u0022字符串\u0022,\u0022columItemFontLocation\u0022:\u0022center\u0022},{\u0022columItemWidth\u0022:120,\u0022columItemLable\u0022:\u0022货主往来户ID\u0022,\u0022columItemName\u0022:\u0022relatedId\u0022,\u0022columItemType\u0022:\u0022字符串\u0022,\u0022columItemFontLocation\u0022:\u0022center\u0022},{\u0022columItemWidth\u0022:150,\u0022columItemLable\u0022:\u0022往来户名称\u0022,\u0022columItemName\u0022:\u0022name\u0022,\u0022columItemType\u0022:\u0022字符串\u0022,\u0022columItemFontLocation\u0022:\u0022right\u0022},{\u0022columItemWidth\u0022:100,\u0022columItemLable\u0022:\u0022类型名称\u0022,\u0022columItemName\u0022:\u0022cardTypeName\u0022,\u0022columItemType\u0022:\u0022字符串\u0022,\u0022columItemFontLocation\u0022:\u0022right\u0022},{\u0022columItemWidth\u0022:130,\u0022columItemLable\u0022:\u0022证件号码\u0022,\u0022columItemName\u0022:\u0022cardNumber\u0022,\u0022columItemType\u0022:\u0022字符串\u0022,\u0022columItemFontLocation\u0022:\u0022right\u0022},{\u0022columItemWidth\u0022:160,\u0022columItemLable\u0022:\u0022发证机关名称\u0022,\u0022columItemName\u0022:\u0022holderName\u0022,\u0022columItemType\u0022:\u0022字符串\u0022,\u0022columItemFontLocation\u0022:\u0022center\u0022},{\u0022columItemWidth\u0022:150,\u0022columItemLable\u0022:\u0022证件有效期\u0022,\u0022columItemName\u0022:\u0022expiryDate\u0022,\u0022columItemType\u0022:\u0022字符串\u0022,\u0022columItemFontLocation\u0022:\u0022center\u0022},{\u0022columItemWidth\u0022:150,\u0022columItemLable\u0022:\u0022证件备注\u0022,\u0022columItemName\u0022:\u0022notes\u0022,\u0022columItemType\u0022:\u0022字符串\u0022,\u0022columItemFontLocation\u0022:\u0022center\u0022}]",
            "templateName": "证照信息模板",
            "useTips": ""
        },{
            "templateID": 14,
            "databaseSource": "purchases_down",
            "editColumn": false,
            "menuClass": "[9,10,14,22,24,26,47,59,60]",
            "optionList": "",
            "sqlLanguage": "数据来自接口 purchases_down",
            "columList": "[{\u0022columItemWidth\u0022:100,\u0022columItemLable\u0022:\u0022单据编号\u0022,\u0022columItemName\u0022:\u0022billCode\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:120,\u0022columItemLable\u0022:\u0022单据日期\u0022,\u0022columItemName\u0022:\u0022billDate\u0022,\u0022columItemType\u0022:\u0022字符串\u0022,\u0022columItemFormat\u0022:\u0022dateFormat\u0022},{\u0022columItemWidth\u0022:150,\u0022columItemLable\u0022:\u0022货主供应商名称\u0022,\u0022columItemName\u0022:\u0022supplierName\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:120,\u0022columItemLable\u0022:\u0022制单时间\u0022,\u0022columItemName\u0022:\u0022createTime\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:120,\u0022columItemLable\u0022:\u0022制单人姓名\u0022,\u0022columItemName\u0022:\u0022creator\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:120,\u0022columItemLable\u0022:\u0022承运方式\u0022,\u0022columItemName\u0022:\u0022transMethod\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:120,\u0022columItemLable\u0022:\u0022承运单位\u0022,\u0022columItemName\u0022:\u0022transClient\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:120,\u0022columItemLable\u0022:\u0022运输工具\u0022,\u0022columItemName\u0022:\u0022transFrom\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:120,\u0022columItemLable\u0022:\u0022起运日期\u0022,\u0022columItemName\u0022:\u0022leftForDate\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:120,\u0022columItemLable\u0022:\u0022在途时限(小时)\u0022,\u0022columItemName\u0022:\u0022transTime\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:120,\u0022columItemLable\u0022:\u0022起运温度\u0022,\u0022columItemName\u0022:\u0022leftForTemperature\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:120,\u0022columItemLable\u0022:\u0022商品名称\u0022,\u0022columItemName\u0022:\u0022pName\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:120,\u0022columItemLable\u0022:\u0022商品规格\u0022,\u0022columItemName\u0022:\u0022model\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:120,\u0022columItemLable\u0022:\u0022批准文号\u0022,\u0022columItemName\u0022:\u0022alias\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:120,\u0022columItemLable\u0022:\u0022商品批号\u0022,\u0022columItemName\u0022:\u0022batch\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:100,\u0022columItemLable\u0022:\u0022采购数量\u0022,\u0022columItemName\u0022:\u0022quantity\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:120,\u0022columItemLable\u0022:\u0022生产企业\u0022,\u0022columItemName\u0022:\u0022fromPlace\u0022,\u0022columItemType\u0022:\u0022字符串\u0022},{\u0022columItemWidth\u0022:120,\u0022columItemName\u0022:\u0022listingHolder\u0022,\u0022columItemType\u0022:\u0022字符串\u0022,\u0022columItemLable\u0022:\u0022上市许可持有人\u0022}]",
            "templateName": "采购记录模板",
            "useTips": ""
        }]
export default {
  name: 'DIYtable',
  components :{
    tipsBar,
    selectCondition
  },
  data() {
    return {
      // 从DIYtable表中获取的表格模板
      tableInfo: {},
      multipleSelection: [],
      tableOption: false,   // 表格是否需要操作列
      tableColumList:[],   // 表格中的列的列表
      tableColumOption:[],  // 如果需要操作列的话，操作列中有哪些操作
      showLook:false,
      showDIY:false,
      showDelete:false,
      DIYName: "自定义",
      optionColumWidth: 50,
      DIYList: [],

      options:[],

      hideToggle:false,
      firstTrans: true,

      transData: [],
      transValue: [],

      recordTransLength:0,//记录穿梭框右边length
      tempColum:[],//暂存表单列的数组
      
      dialogEditTableVisible: false, //穿梭框隐藏显示的设置

      conditionList:[], //条件列
    }
  },
  props: 
  {
    templateName:{
      type: String
    },
    itemOption:{
      type: Array
    },
    hideToggleColum:{
      type: Boolean,
      default: false
    },
    dataTable:{
      type: Array
    },
    loaded:{
      type: Boolean
    },
    viewType:{
      type: String
    },
    currentPages:{
      type: Number
    },
    pageSize:{
      type: Number
    },
    showQuery:{
      type: Boolean,
      default: false
    },
    isSortable:{
      type: Boolean,
      default: false
    },
    showIndex:{
      type: Boolean,
      default: false
    },
    hideTips:{
      type: Boolean,
      default: true
    }
  },
  //props: ['templateName','itemOption','hideToggleColum','dataTable','loaded','viewType','currentPages','pageSize','showQuery'],
  methods: {
    handleChange(){//处理隐藏显示表头
      if((this.transValue.length>this.recordTransLength)&&this.transValue.length!==0){//如果右边（隐藏）的数量变多了，那就进行splice
        for(let i = 0; i< this.tableColumList.length;i++){
          for(const element of this.transValue){
            if(this.tableColumList[i].columItemLable === element){//如果右边（隐藏）的数量变少了，就进行push
              this.tableColumList.splice(i,1)
            }
          }
        }
      }else if((this.transValue.length<this.recordTransLength)&&this.transValue.length!==0){//如果右边（隐藏）的数量变少了，就进行push
          for(const element of this.tempColum){
            if(!this.transValue.includes(element.columItemLable)){//不在右边那就是在左边了，左边的push上去
              this.tableColumList.push(element)
            }
        }
      }else if(this.transValue.length===0){//穿梭框右侧为空
        this.tableColumList = this.tempColum
      }
      //数组去重
      const newArr= this.tableColumList.filter(function(item,index,self){
        return self.indexOf(item) === index;
      })
      this.tableColumList = newArr
      this.recordTransLength = this.transValue.length
    },
    handleCloseEdit(done){
      done()
    },
    filterMethod(query, item) {   // 查询 
      return item.label.indexOf(query) > -1;
    },
    generateData(){//处理穿梭框数据
      let columData = []
      let columList = this.tableColumList
      columList.forEach((columListItem) => {
        columData.push({
          label: columListItem.columItemLable,
          key: columListItem.columItemLable,
        })
      })
      this.transData = columData
    },
    showTrans(show){ //打开穿梭框
      if(show){
        if(this.firstTrans){
        this.generateData()//只有第一次进入才进行初始化
        this.firstTrans = false
        this.tempColum = [...this.tableColumList]
      }
      this.dialogEditTableVisible = true
      }
    },
    refreshTableData(refresh){//刷新表格数据
      if(refresh){
        this.DIYList = []  //初始化DIY操作列
        this.transData = []  //初始化穿梭框（左侧）
        this.transValue = []  //初始化穿梭框(右侧)
        this.getDIYTemplate()
        this.firstTrans = true
        this.recordTransLength = 0
      }
    },
    banRightClick(){// 禁止右键
        document.oncontextmenu = new Function("event.returnValue=false");
    },
    restoreRightClick(){// 恢复右键
        document.oncontextmenu = new Function("event.returnValue=true");
    },
    onContextmenu(row, column, event) { //配置右击菜单
      this.banRightClick()
      this.$contextmenu({
        items: [
          {
            icon: "el-icon-copy-document",
            label: "复制该行信息",
            onClick: () => {
              this.$copyText(JSON.stringify(row)).then(
	              e=>{
                  this.$message({
                    type: 'success',
                    message: '已复制编号为 '+row.code+' 的信息'
                  })
	              },
	              e=>{
	                console.log('复制失败：', e);
	              }
              )
              this.restoreRightClick()
            }
          }
        ],
        event,
        customClass: "resource-context-menu",
        zIndex: 999,
        minWidth: 100
      });
      return false;
    },
    indexMethod(index) {  // 显示序号（显示的是按所有的查询结果的序号，而不是仅仅当前页的序号）
      if(!this.pageSize){
        return index + 1
      }else{
        return (this.currentPages-1) * this.pageSize + index + 1
      }
    },
    toggleUpdate(){  // 批量修改
      this.$router.push({path:'/infoDetail',query: {type: this.viewType+'_up',info: this.multipleSelection}})
    },
    toggleSelection(rows) {    //选择状态改变
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);  // 改变选中的行多选框状态
        });
      } else {
        this.$refs.multipleTable.clearSelection();  //如果为空就全部取消选择
      }
    },
    handleSelectionChange(val) {   // 多选添加
      this.multipleSelection = val
    },
    showItemDetail(row){
      //点击查看某行
      //console.log("show")
      //console.log(row)
      this.$router.push({path:'/detail/showDetail', query: {type: this.viewType+'_down',info: row}})
    },
    deleteItem(row){
      // 点击删除某行
      //console.log("delete")
      //console.log(row)
      //执行删除语句
      this.$emit("deleteItemInfo",row)
    },
    DIYItemOption(row,typeName){   //typeName是操作按钮的名称，根据不同的操作内容进行方法的实现
      // 自定义控件操作
      //console.log("diy")
      //console.log(row)
      //console.log(typeName)
      if(typeName==='操作'){
        this.$emit("optionInfo",row)
      }
    },
    getDIYTemplate(){ //获取DIY模板


      ////下午修改加入  人员模板，证照模板，商品模板，采购记录模板
      // getDIYtable({name:this.templateName})
      // .then((res)=>{

        for(let i =0;i<res.length;i++){
          if(this.templateName===res[i].templateName){
            this.tableInfo = res[i]

            this.tableColumList = JSON.parse(this.tableInfo.columList) // 操作列的字符串数据转换成json,并反转

            if(this.showQuery){//需要显示动态查询
              for(const element of this.tableColumList){
                if(element.columItemSelect){//如果列中有columItemSelect这个成为查询字段的条件，就开始拿出来
                  this.conditionList.push(element.columItemLable)
                }
              }
            }

            this.tableOption = this.tableInfo.editColumn   // 判断是否需要显示操作列
            if(this.tableOption){  //如果需要，则转化
              this.tableColumOption = JSON.parse(this.tableInfo.optionList)
              
              for(let k=0;k<this.tableColumOption.length;k++){  // 循环一下操作列中有什么操作需要显示的
                if(this.tableColumOption[k]==="查看"){
                  this.showLook = true
                }else if(this.tableColumOption[k]==="删除"){
                  this.showDelete = true
                }else if(this.tableColumOption[k]===null){//如果  当前的元素是null，删除数组中这个 元素 
                  this.tableColumOption.splice(k,1)
                }else{
                  this.showDIY = true
                  this.DIYList.push(this.tableColumOption[k])
                }
              }
              this.optionColumWidth = this.tableColumOption.length * 50  // 设置操作列的宽度，每多一个字段宽度多50
            }
          }
        }
      // })
      // .catch((err)=>{
      //   console.log(err)
      // })
    },
    // 列拖拽
    columnDrop() {
        let subHeader = 1
        if(this.hideToggle&&this.showIndex){  // 如果显示 多选 和 序号，减去的头列就为2（序号列，多选列），否则就是1（序号列）
          subHeader = 2
        }else if(!this.hideToggle&&!this.showIndex){//如果 多选 和 序号 都不显示 
          subHeader = 0
        }
        const wrapperTr = document.querySelector('.draggable .el-table__header-wrapper tr');
        this.sortable = Sortable.create(wrapperTr, {
          animation: 180,
          delay: 0,
          handle: ".allowDrag",
          onEnd: evt => {
          // 接下来做索引的交换
          let tempHableHeader = this.tableColumList // 先存一份临时变量表头数据
          let temp // 临时变量用于交换
          temp = tempHableHeader[evt.oldIndex-subHeader]  // -subHeader 是因为当subHeader=1是前面有 序号列（默认），当subHeader=2时前面有 序号列 和 多选列 ，在拖拽的时候需要去掉这两种情况

          // 插入
          tempHableHeader.splice(evt.oldIndex-subHeader, 1) // -1是因为前面有
          tempHableHeader.splice(evt.newIndex-subHeader, 0, temp)

          // 交换
          // tempHableHeader[evt.oldIndex] = tempHableHeader[evt.newIndex]
          // tempHableHeader[evt.newIndex] = temp
 
          // 重要的事情说三遍！！！
          // 这里一定要先把表头数据清空，然后再下一轮中去赋值，否则会渲染错误
          // 这里一定要先把表头数据清空，然后再下一轮中去赋值，否则会渲染错误
          // 这里一定要先把表头数据清空，然后再下一轮中去赋值，否则会渲染错误
          this.tableColumList = [] // 大家可以注掉试试哦
          this.$nextTick(() => {
            this.tableColumList = tempHableHeader
          })
        }
      })
    }
  },
  filters: {
    formatItem(value,formatType){//对表单内容进行格式化
      if(formatType==='dateFormat'){   // 日期格式化
        return value.split(' ')[0]
      }else if(formatType==='boolean'){  //布尔值格式化
        return value?'是':'否'
      }else{
        return value
      }
    }
  },
  computed:{
    ...mapGetters([
      'fontSize'
    ])
  },
  mounted(){
    // if(this.hideToggleColum!==undefined){  //如果不传hideToggle，那就默认是隐藏多选列
    //   this.hideToggle = this.hideToggleColum
    // }
    this.getDIYTemplate()
    this.columnDrop()   //拖拽的方法
  }
}
</script>
