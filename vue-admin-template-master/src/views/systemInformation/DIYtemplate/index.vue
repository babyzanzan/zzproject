<!-- 自定义报表设置 -->
<template>
  <div class="app-container">
    <div style="margin-left: auto;">
      <el-select filterable v-model="templateValue"  v-loading.fullscreen.lock="fullscreenLoading" placeholder="请选择模板" style="width: 300px" @click.native="templateInfo" @change="DIYitemInfo">
        <el-option
            v-for="item in templateList"
            :key="item.templateID"
            :label="item.templateName"
            :value="item.templateName">
        </el-option>
      </el-select>
      <!-- select选择模板之后可以删除模板，可以编辑模板 -->
      <el-button type="warning" style="margin-left: 10px;" @click="createNewTemplate">新建模板</el-button>
      <el-button type="success" style="margin-left: 10px;" @click="updateTemplate" :disabled="!canEdit">编辑模板</el-button>
      <el-button type="danger" style="margin-left: 10px;" @click="deleteTemplate" :disabled="!canEdit">删除模板</el-button>
      <el-button type="primary" style="float: right;" @click="submitInfo" v-if="!isEdit">提交</el-button>
    </div>
  <el-form :model="DIYInfo" status-icon :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
    <el-tabs :tab-position="tabPosition" style="height: 100%;margin-top: 20px;">
      <el-tab-pane label="总体设置">     
        <el-form-item label="菜单分类" prop="menuClass">
          <el-button type="primary" @click="drawer = true">显示<i class="el-icon-caret-right el-icon--right"></i></el-button>
          <span style="color: red;margin-left: 20px">{{ showMenuClassError }}</span>
          <el-drawer
            v-drawerDrag
            title="分类选择"
            :visible.sync="drawer"
            :direction="direction"
            :before-close="handleClose">
            <el-tree 
              ref="tree"
              :props='props' 
              show-checkbox 
              :data='treeData' 
              @check-change='handleCheckChange'
              node-key="id"
              :default-checked-keys="menuClassList">
            </el-tree>
            <el-button type="primary" style="margin-left: 40%;margin-top: 20px;" @click="getCheckedNodes">确定</el-button>
          </el-drawer>
        </el-form-item>
        <el-form-item label="模板ID">
          <el-col :span="12">
            <el-input v-model="DIYInfo.templateID" :disabled="true" placeholder="模板ID将在创建模板后自动生成"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="模板名称" prop="templateName" >
          <el-col :span="12">
            <el-input v-model="DIYInfo.templateName" :disabled="canEdit"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="数据源(数据接口)" prop="dataBaseSourceCheck">
          <el-select v-model="dataBaseValue" placeholder="请选择模板" style="width: 300px" @change="changeSelected" :disabled="canEdit">
            <el-option
              v-for="item in DIYTableKey"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据接口" prop="sql">
          <el-col :span="12">
            <el-input type="textarea"  resize="none" rows="3" v-model="DIYInfo.sqlLanguage" :disabled="canEdit"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="使用说明">
          <el-col :span="12">
            <el-input type="textarea"  resize="none" rows="3" v-model="DIYInfo.useTips" :disabled="canEdit"></el-input>
          </el-col>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="选项设置">
        <div class="draggable" style="padding: 10px">
          <tableColum v-for="(item,index) in tableColumList"
                    :key="index"
                    :index="index"
                    :item="item"
                    @deleteIndex="deleteTableColum(index,'tableColum')"
                    :canEdit="canEdit">
          </tableColum>
        </div>
        <el-row>
          <el-col :span="4">
            <el-button type="primary" icon="el-icon-circle-plus" style="margin-top: 18px;" @click="addColum('tableColum')" :disabled="canEdit">添加字段</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px;margin-left: 50px;">
          <el-col :span="6">
            <el-switch
              style="margin-top: 25px;"
              v-model="DIYInfo.editColumn"
              active-text="需要操作列"
              @change="needOption(DIYInfo.editColumn)" :disabled="canEdit">
            </el-switch>
          </el-col>
          <el-col :span="14" v-if="DIYInfo.editColumn">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" :disabled="canEdit">全选</el-checkbox>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="checkedOption" @change="handleCheckedCitiesChange" :disabled="canEdit">
                <el-checkbox v-for="select in select" :label="select" :key="select">{{select}}</el-checkbox>
                <el-button size="small" style="margin-left: 20px;" @click="showDIY=!showDIY" :disabled="canEdit">自定义</el-button>
              </el-checkbox-group>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px;" v-if="showDIY&&DIYInfo.editColumn">
          <optionColum
                    v-for="(item,index) in optionColumList"
                    :key="index"
                    :index="index"
                    :item="item"
                    @deleteIndex="deleteTableColum(index,'optionColum')"
                    :canEdit="canEdit">
          </optionColum>
          <el-form-item>
            <el-col :span="5">
              <el-button type="primary" :disabled="canEdit" @click="addColum('optionColum')" icon="el-icon-circle-plus" style="margin-left: 10px;" circle size="mini"></el-button>
            </el-col>
          </el-form-item> 
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="帮助" style="padding-left: 10px;padding-top: 20px;font-size: larger;">
        自定义报表功能如下：
        <el-timeline style="margin-top: 20px;">
          <el-timeline-item icon="el-icon-more" type="primary" timestamp="新建报表模板" placement="top">
            <el-card>
              <h4>需完善填写模板信息（其中使用说明为选填，操作列选项如不需要可不填，模板ID自动生成）</h4>
            </el-card>
          </el-timeline-item>
          <el-timeline-item icon="el-icon-more" type="primary" timestamp="说明" placement="top">
            <el-card>
              <h4>列名，列宽度，数据表列名和列类型不能为空，且数据表列名是需要在创建时选择了数据接口才会显示，字体靠边默认是左边（可不选）。</h4>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="说明2" placement="top" icon="el-icon-more" type="primary">
            <el-card>
              <h4>拖动列名序列可以移动表格列名列表，进行重新排序。格式化→ 按钮，当表格列 中有格式化的时候 格式化按钮→ 会显示红色。</h4>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="编辑报表模板" placement="top" icon="el-icon-more" type="primary">
            <el-card>
              <h4>编辑报表模板，无法修改templateID，且只能在选择了某个报表模板之后才能执行该操作</h4>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="删除报表模板" placement="top" icon="el-icon-more" type="primary">
            <el-card>
              <h4>删除报表模板，只能在选择了报表模板之后才能执行该操作</h4>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="注：" placement="top" icon="el-icon-warning-outline" type="danger">
            <el-card>
              <h4>该功能主要是通过建立报表模板，后续在编写报表页面的时候可以进行复用，从而简化页面的编排工作。如有问题请及时反馈！</h4>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-tab-pane>
    </el-tabs>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import tableColum from './tableColum.vue'
import optionColum from './optionColum.vue'
import { updateDIYtable,getDIYtable,deleteTemplateOne } from '@/api/table' 
import Sortable from 'sortablejs'
const selectOptions = ['查看', '删除'];
const ress = [{
        "templateID": 5,
        "databaseSource": "bases_elusers_down",
        "editColumn": true,
        "menuClass": "[12]",
        "optionList": `["操作"]`,
        "sqlLanguage": "select * from Usersbases_elusers_down",
        "columList": `[{"columItemWidth":100,"columItemLable":"用户ID","columItemName":"id","columItemType":"字符串"},{"columItemWidth":120,"columItemLable":"用户名称","columItemName":"userName","columItemType":"字符串"},{"columItemWidth":120,"columItemLable":"货主名称","columItemName":"ownerName","columItemType":"字符串"},{"columItemWidth":100,"columItemLable":"头像","columItemName":"avatar","columItemType":"图片"}]`,
        "templateName": "人员设置模板",
        "useTips": ""
      },{
        "templateID": 2,
        "databaseSource": "products_down",
        "editColumn": true,
        "menuClass": "[9,10,12,14,22]",
        "optionList": `["查看",null]`,
        "sqlLanguage": "select * from products_down",
        "columList": `[{"columItemWidth":100,"columItemLable":"商品编码","columItemName":"code","columItemType":"字符串","columItemSelect":true},{"columItemWidth":130,"columItemLable":"商品名称","columItemName":"name","columItemType":"字符串","columItemSelect":true},{"columItemWidth":80,"columItemLable":"剂型","columItemName":"unitType","columItemType":"字符串"},{"columItemWidth":120,"columItemLable":"批准文号","columItemName":"alias","columItemType":"字符串"},{"columItemWidth":100,"columItemLable":"规格","columItemName":"model","columItemType":"字符串"},{"columItemWidth":150,"columItemLable":"生产厂商","columItemName":"fromPlace","columItemType":"字符串"},{"columItemWidth":150,"columItemLable":"上市许可持有人","columItemName":"listingHolder","columItemType":"字符串"},{"columItemWidth":80,"columItemLable":"单位","columItemName":"baseUnit","columItemType":"字符串"},{"columItemWidth":100,"columItemLable":"大包装","columItemName":"unitRate","columItemType":"字符串"},{"columItemWidth":100,"columItemLable":"中包装","columItemName":"midUnitRate","columItemType":"字符串"},{"columItemWidth":80,"columItemLable":"状态","columItemName":"status","columItemType":"字符串"},{"columItemWidth":100,"columItemLable":"监管药品","columItemName":"isSpecial","columItemType":"字符串","columItemFormat":"boolean"},{"columItemWidth":150,"columItemLable":"存储分类","columItemName":"storage","columItemType":"下拉框"}]`,
        "templateName": "商品设置模板",
        "useTips": ""
      }]
export default {
    name: 'diyReport',
    components: {
      tableColum,
      optionColum
    },
    data() {
      let checksqlLanguage = (rule, value, callback) => {
        if(this.DIYInfo.sqlLanguage===''){
          callback(new Error('数据接口来源不能为空'));
        }else{
          callback()
        }
      }
      return {
        fullscreenLoading: false,  //全屏加载
        DIYTableKey: [],  //DIY表单的类型
        tabPosition: 'left',
        props: {
          label: 'label',
          children: 'children'
        },
        templateList: [],
        DIYInfo: {
          menuClass: [],   //菜单分类
          templateID: 0,  // 模板ID
          templateName: '', //模板名称
          databaseSource: '', //数据库接口
          sqlLanguage: '数据来自接口 ', // sql语句
          useTips: '', // 使用说明
          columList: [], // 表格列表
          editColumn: false, // 是否需要操作列
          optionList: [],  // 操作列方法列表
        },
        treeData: [],
        drawer: true,
        direction: 'rtl',
        checkAll: false,
        select: selectOptions,
        isIndeterminate: true,
        showDIY: false,
        templateValue: '',
        dataBaseValue: '',
        showMenuClassError: '未选择菜单分类',
        checkedOption: [],   // 操作列 
        optionColumList: [{}],  //操作列方法列表
        tableColumList: [{}],  // 表格列表
        menuClassList: [],// 菜单分类列表
        isEdit: false,
        canEdit: false,
        rules:{
          menuClass: [
            { required: true, message: '菜单分类不能为空', trigger: 'blur'}
          ],
          templateName: [
            { required: true, message: '模板名称不能为空', trigger: 'blur' },
            { max: 8,  message: '长度需要小于9个字符', trigger: 'blur'}
          ],
          dataBaseSourceCheck:[
            { required: true, message: '数据源不能为空', trigger: 'blur'}
          ],
          sql: [
            { required: true, validator: checksqlLanguage, trigger: 'blur'}
          ]
        },
      }
    },
    methods: {
      // upTableColum(index){   // 列表上移
      //   this.tableColumList.splice(index-1,0,this.tableColumList[index])  // 元素往上移一格
      //   this.tableColumList.splice(index+1,1)     // 删除原来的元素
      //   this.columActive = index-1
      // },
      // downTableColum(index){    // 列表下移
      //   this.tableColumList.splice(index+2,0,this.tableColumList[index])  // 元素往下移一格
      //   this.tableColumList.splice(index,1)     // 删除原来的元素
      //   console.log(index)
      //   console.log(this.tableColumList.length-1)
      //   if((index)!==this.tableColumList.length-1){  // 如果下移的时候 该index 已经是 表格列的列表 最底下了，则初始化，否则就传index+1
      //     this.columActive = index+1
      //   }else{
      //     this.columActive = ''
      //   }
      // },
      deleteTemplate(){  // 删除模板
        this.$confirm('此操作将删除模板: '+this.templateValue+' , 是否继续?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteTemplateOne([{id:this.DIYInfo.templateID}])  // 删除模板请求
          .then((res)=>{
            if(res.data[0].deleted){
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.canEdit = false
            }else{
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }

          })
          .catch((err) => {
            console.log(err)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });    
        });
      },
      updateTemplate(){   // 编辑模板
        this.canEdit = false
        this.isEdit = false
      },
      createNewTemplate(){   // 新建模板, 显示 提交按钮 并且 清空所有值
        
        this.isEdit = false
        this.canEdit = false
        // 重置表单 
        this.templateValue = ''
        this.DIYInfo.menuClass = []       
        this.$refs.tree.setCheckedKeys([])
        this.DIYInfo.templateID = 0
        this.DIYInfo.templateName = ''
        this.dataBaseValue = ''
        this.DIYInfo.columList = []
        this.DIYInfo.optionList = []
        this.DIYInfo.sqlLanguage = '数据来自接口 '
        this.DIYInfo.useTips = ''
        this.DIYInfo.editColumn = false
        this.optionColumList = [{}]
        this.tableColumList = [{}]   
        this.menuClassList = []
        
        this.showMenuClassError = "未选择菜单分类"
      },
      DIYitemInfo(){   // 下拉框选中模板之后获取 该模板的信息, 并自动显示
        
        // getDIYtable({name: this.templateValue})
        // .then((res)=>{

          for(let i = 0 ;i<ress.length;i++){
            if(this.templateValue===ress[i].templateName){
              this.DIYInfo = ress[i]

          this.canEdit = true
          this.dataBaseValue = this.DIYInfo.databaseSource  // 赋值给数据库源的显示

          // 并将选择的模板的数据库名提交给vuex
          this.$store.commit('settings/setSelectTableName', {selectedTableName: this.dataBaseValue})

          this.menuClassList = JSON.parse(this.DIYInfo.menuClass) // 将菜单分类列表从字符转成对象,并赋值给列表

          this.isEdit = true   // 不显示提交按钮
          this.showMenuClassError = ""  // 因为保存好的模板必定菜单不为空，所以错误提示给隐藏掉

          this.tableColumList = JSON.parse(this.DIYInfo.columList)   // 将表格的列表转成json赋值
          if(this.DIYInfo.editColumn === true){   // 如果有操作列的话，则把操作列转成json再赋值
            let optinColumTemp = JSON.parse(this.DIYInfo.optionList)
            let optionColumUse = [...optinColumTemp] //复制一份用来修改
            
            for(const element of optinColumTemp){   // 操作列表中去除 查看和删除 ，剩下的就是自定义
              if(element==="查看"||element==="删除"){
                optionColumUse.splice(optionColumUse.indexOf(element), 1)
                this.checkedOption.push(element)
              }
            }
           if(optionColumUse.length>0&&optionColumUse[0]!==null){   // 如果移除查看和删除之后还有操作属性，那就是有自定义列
              this.showDIY = true
              for(let i = 0;i<optionColumUse.length;i++){
                optionColumUse[i] = { optionFuncName: optionColumUse[i]}
              }
              this.optionColumList = optionColumUse
            } 
          }
            }
          }
          
        // })
        // .catch((err)=>{
        //   console.log(err)
        // })
      },
      templateInfo(){   // 从数据库中获取模板列表并显示
        this.fullscreenLoading = true
        // getDIYtable({})
        // .then((res)=>{
          this.templateList =  ress

          this.fullscreenLoading = false
        // })
        // .catch((err)=>{
        //   console.log(err)
        //   this.fullscreenLoading = false
        // })
      },
      submitInfo(){   // 提交信息 ，并将 meanuClass,tableColumList, optionColumList 进行深拷贝
        this.isEdit = true
        this.menuClassList = []   // 初始化菜单分类
        for(const element of this.$refs.tree.getCheckedNodes()){  // 把选中的树节点id全部添加到数组
          this.menuClassList.push(element.id)
        }
        this.DIYInfo.menuClass = [...this.menuClassList]
        this.DIYInfo.databaseSource = this.dataBaseValue
        this.DIYInfo.columList = [...this.tableColumList]  // 深拷贝，不影响页面
        if(this.DIYInfo.editColumn===false){    // 如果是关闭了的需要操作列，则操作列清空
          this.DIYInfo.optionList = []
        }else{   // 否则的话就合并操作列选项并提交
          this.DIYInfo.optionList = [...this.checkedOption]   // 深拷贝
          for(const element of this.optionColumList){  // 如果操作列是有值的，把操作列的数值合并到一起
            if(element!=undefined||element!=null){
              this.DIYInfo.optionList.push(element.optionFuncName) 
            }
          }
        } 
        if(!this.checkDIYInfo()){
          this.$message({
            showClose: true,
            message: '提交失败，信息填写不完整！',
            type: 'error'
          });
          this.isEdit = false
        }else{  
          updateDIYtable(this.DIYInfo)   // 如果templateID为0，则 新建模板,否则更新 
            .then((res)=>{
              this.$message({
                showClose: true,
                message: '提交成功！',
                type: 'success'
              })
              this.createNewTemplate() //提交完之后初始化
              this.isEdit = false
            })
            .catch((err) => {
              this.$message({
                showClose: true,
                message: '出错啦!'+err,
                type: 'error'
              })
              console.log(err)
              this.isEdit = false
            })
        }
      },
      addColum(type){     //动态添加字段
        if(type==='tableColum'){
          this.tableColumList.push({})
        }else if(type==='optionColum'){
          this.optionColumList.push({})
        }
      },
      deleteTableColum(index,type){    // 实现移除功能
        if(type==="optionColum"){
          this.optionColumList.splice(index, 1)
        }else if(type==="tableColum"){
          if (index !== 0) {
            this.tableColumList.splice(index, 1)
          }
        }
      },
      changeSelected(){   // 选中事件触发的操作
        this.DIYInfo.sqlLanguage = this.DIYInfo.sqlLanguage + this.dataBaseValue   // sql语句自动填写表名
        // 将选中的表名传给store中的全局变量
        this.$store.commit('settings/setSelectTableName', {selectedTableName: this.dataBaseValue})
      },
      handleCheckAllChange(val) {
        this.checkedOption = val ? selectOptions : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.select.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.select.length;
      },
      needOption(state){   //需要操作列的操作，如果原来是关闭的，打开之后需要进行初始化操作列的工做
        if(!state){//状态是false，不显示操作列详细信息
          this.showDIY = false
        }else{//状态是true  是true需要进行初始化操作列的工作
          this.optionColumList = [] //初始化diy操作列
          this.checkedOption = [] //初始化默认操作列
        }
      },
      handleClose(done) {   // 关闭抽屉
        done()
        if(this.$refs.tree.getCheckedNodes().length===0){
          this.showMenuClassError = "未选择菜单分类"
        }else{
          this.showMenuClassError = ""
        }
      },
      handleCheckChange(data, checked, indeterminate) {   // 树的选择
        //console.log(data)
      },
      getCheckedNodes() {   //获取子节点
        this.$message({
          showClose: true,
          message: '已提交!',
          type: 'success'
        })
        //console.log(this.$refs.tree.getCheckedNodes());
      },
      checkDIYInfo(){   // 对DIY表单的信息完整性进行核对
        let completed = true
        if(this.DIYInfo.menuClass.length===0||this.DIYInfo.templateName===''||this.DIYInfo.sqlLanguage===''||this.DIYInfo.dataBaseSource===''||(this.DIYInfo.editColumn&&this.DIYInfo.optionList.length===0)){
          completed = false
        }else{
          for(const element of this.tableColumList){
            if(element.columItemName===undefined||element.columItemWidth===undefined||element.columItemLable===undefined||element.columItemType===undefined){
              completed = false
            }
          }
        }
        return completed
      },
      columnDrop() {
        const wrapperTr = document.querySelector('.draggable');
        this.sortable = Sortable.create(wrapperTr, {
          animation: 180,
          delay: 0,
          onEnd: evt => {

          // 接下来做索引的交换
          let tempHableHeader = this.tableColumList // 先存一份临时变量表头数据
          let temp // 临时变量用于交换
          temp = tempHableHeader[evt.oldIndex]  // 需要插入的东西

          // 插入
          tempHableHeader.splice(evt.oldIndex, 1);
          tempHableHeader.splice(evt.newIndex, 0, temp)

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
    computed: {
      ...mapState(['settings','table'])
    },
    mounted(){
      this.treeData = this.settings.permissionConfiguration_detail
      this.drawer = false
      this.DIYTableKey = Object.keys(this.table.DIYTableKey_down)
      this.columnDrop()
    },
  }
</script>