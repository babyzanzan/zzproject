<template>
    <el-row class="demo-autocomplete" :gutter="10" style="margin-top: 20px">
          <el-col :span="4">
            <div class="sub-title">列名</div>
              <el-input v-model="item.columItemLable" :disabled="canEdit"></el-input>
          </el-col>
          <el-col :span="6.5">
            <div class="sub-title">列宽度</div>
              <el-input-number v-model="item.columItemWidth" :min="50" :max="300" :step="10" :disabled="canEdit"></el-input-number>
          </el-col>
          <el-col :span="4">
            <div class="sub-title">数据表的列名</div>
            <el-select filterable v-model="item.columItemName" style="width: 100%;" placeholder="请选择" @click.native="selectColumItemName" :disabled="canEdit">
              <el-option
                v-for="nameItem in columnName"
                :key="nameItem"
                :label="nameItem"
                :value="nameItem">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <div class="sub-title">列的类型</div>
            <el-select v-model="item.columItemType" style="width: 100%;" placeholder="请选择" :disabled="canEdit">
              <el-option
                v-for="typeItem in columnType"
                :key="typeItem.value"
                :label="typeItem.label"
                :value="typeItem.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <div class="sub-title">字体靠边</div>
            <el-select v-model="item.columItemFontLocation" style="width: 100%;" placeholder="请选择" :disabled="canEdit">
              <el-option
                v-for="locationItem in fontLocation"
                :key="locationItem.value"
                :label="locationItem.label"
                :value="locationItem.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" v-if="index!=0" style="margin-top: 18px;" @click="deleteColum" :disabled="canEdit">删除</el-button>
          </el-col>
          <div>
            <el-col :span="0.5">
              <el-tooltip class="item" effect="dark" content="字段格式化" placement="bottom">
                <el-button :type="item.columItemFormat?'danger':'primary'" @click="dialogFomatVisible = true" style="margin-top: 20px;" circle size="mini" icon="el-icon-caret-right" :disabled="canEdit"></el-button>
              </el-tooltip>
            </el-col>
            <el-col :span="0.5">
              <el-tooltip class="item" effect="dark" content="添加查询条件" placement="bottom">
                <el-button :type="item.columItemSelect?'danger':'success'" @click="dialogConditionVisible = true" style="margin-top: 20px;" circle size="mini" icon="el-icon-magic-stick" :disabled="canEdit"></el-button>
              </el-tooltip>
            </el-col>
            <el-dialog title="数据格式化选择" :visible.sync="dialogFomatVisible" style="text-align: center;">
                <el-select v-model="item.columItemFormat" placeholder="请选择" @change="tipsChangeFormat">
                  <el-option
                    v-for="itemFormat in formats"
                    :key="itemFormat.value"
                    :label="itemFormat.label"
                    :value="itemFormat.value">
                  </el-option>
                </el-select>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="cancelFormat">取消格式化</el-button>
                </div>
            </el-dialog>

            <el-dialog
              title="添加为查询条件"
              :visible.sync="dialogConditionVisible">
              <span>确认要将该字段设为查询条件吗?</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogConditionVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCondition">确 定</el-button>
              </span>
            </el-dialog>

          </div>
    </el-row>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'tableColum',
    props:['index','item','canEdit'],
    data() {
      return {
        columnName: [],
        columnType: [{
          value: '字符串',
          label: '字符串'
        },{
          value: '下拉框',
          label: '下拉框'
        },{
          value: '开关',
          label: '开关'
        },{
          value: '输入框',
          label: '输入框'
        },{
          value: '计数器',
          label: '计数器'
        },{
          value: '图片',
          label: '图片'
        },{
          value: '标签',
          label: '标签'
        },{
          value: '标签-success',
          label: '标签-success'
        },{
          value: '标签-danger',
          label: '标签-danger'
        },{
          value: '标签-warning',
          label: '标签-warning'
        },{
          value: '日期',
          label: '日期'
        }],
        fontLocation: [{
          value: 'left',
          label: '左边'
        },{
          value: 'center',
          label: '中间'
        },{
          value: 'right',
          label: '右边'
        }],
        dialogFomatVisible: false,
        dialogConditionVisible: false,
        formats:[{
          value: 'dateFormat',
          label: '日期格式化'
        },{
          value: 'boolean',
          label: '布尔值格式化'
        },{
          value: 'waiting',
          label: '未完待续'
        }],
      }
    },
    methods:{
      cancelFormat(){
        delete this.item.columItemFormat     // 移除对象中的 columItemFormat
        this.$message({
          showClose: true,
          message: '已移除格式化',
          type: 'success'
        })
        this.dialogFomatVisible = false
      },
      tipsChangeFormat(){
        this.$message({
          showClose: true,
          message: '已成功选择',
          type: 'success'
        })
        this.dialogFomatVisible = false
      },
      addCondition(){
        this.item.columItemSelect = true
        this.dialogConditionVisible = false
      },
      deleteColum(){
        this.$emit("deleteIndex",this.index)
      },
      selectColumItemName(){  // 点击下拉框之后给列表 按选择的表格 进行赋值表格的列名
        if(this.settings.selectedTableName!==''){
          this.columnName = Object.keys(this.table.DIYTableKey_down[this.settings.selectedTableName])
        }else{
          this.$message({
            showClose: true,
            message: '需要选择数据接口',
            type: 'error'
          })
        }
      },
    },
    computed: {
      ...mapState(['settings','table'])
    },
}
</script>