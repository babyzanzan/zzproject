<!-- 字典管理 -->
<template>
    <div>
      <el-row :gutter="20" style="margin-left: 1%;margin-top: 2%;">
        <el-col :span="6">
          <div class="grid-content bg-purple-left">
            <el-button type="primary" icon="el-icon-plus" style="width: 100%;">添加数据库表</el-button>
            <el-input v-model="tableName" placeholder="请输入表名" class="tableSelect" clearable></el-input>
            <div class="custom-tree-container">
              <div class="block">
                <el-tree
                  :data="data"
                  node-key="id"
                  default-expand-all
                  :expand-on-click-node="false"
                  :render-content="renderContent">
                </el-tree>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content bg-purple-right">
            <el-button type="primary" icon="el-icon-circle-plus-outline">添加字段</el-button>
            <DIYtable templateName="供应商设置模板" :pageSize="size" :currentPages="currentPage" :loaded="loading" :viewType="type" :dataTable="tableData"></DIYtable>
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
        </el-col>
      </el-row>
    </div>
</template>
<script>
import { getSuppliersInfo } from '@/api/table' 
import { mapGetters } from 'vuex'
import DIYtable from '@/components/DIYtable/index.vue'

export default {
  name:'dictionaryManagement',
  components: {
    DIYtable,
  },
  data() {
    const data = [{
        id: 1,
        label: '数据库1',
        children: [{
          id: 4,
          label: '表aa'
        }]
      }, {
        id: 2,
        label: '数据库2',
        children: [{
          id: 5,
          label: '表bb'
        }, {
          id: 6,
          label: '表cc'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }]
    return {
      tableName: '',//字典所在表名
      // 从DIYtable对应的数据库表格中获取的表格数据
      tableData: [],
      loading: false,
      selectInfo: {
        keyWord: '',
        owner: ''
      },
      total:0,   // 数据总数
      currentPage:1,  // 当前页面
      size:10,//每页显示的条数
      pageCount:1,//总页数

      type:'clients_suppliers',


      data: JSON.parse(JSON.stringify(data)),
    }
  },
  computed:{
    ...mapGetters([
      'selectCondition'
    ])
  },
  methods: {
    append(data) {
        const newChild = { id: id++, label: 'testtest', children: [] };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },

      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },

      renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>删除</el-button>
            </span>
          </span>);
      },


    handleSizeChange(val){
      this.size = val
      this.queryInfo('click')
    },
    toAdd(){  // 跳转到添加页面
      this.$router.push({path:'/detail/infoDetail',query: {type: this.type+'_up'}})
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
      //查询接口
      this.loading = false
    },
  },
  mounted(){
    this.queryInfo('click')
  },
}
</script>
<style>
.el-col {
  border-radius: 4px;
}
.bg-purple-left {
  border-style:solid;
  border-width:1px;
  border-color:rgb(196, 210, 214);
  padding-left: 15px;
  padding-top: 15px;
  padding-right: 15px;
  padding-bottom: 15px;
}
.bg-purple-right {
  border-style:solid;
  border-width:1px;
  border-color:rgb(146, 223, 247);
  padding-left: 15px;
  padding-top: 15px;
  padding-right: 15px;
  padding-bottom: 15px;
}
.tableSelect {
  margin-top: 10px;
  margin-bottom: 10px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>