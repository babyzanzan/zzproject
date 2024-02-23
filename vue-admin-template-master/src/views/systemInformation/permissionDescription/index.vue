<template>
    <div>
      <el-divider content-position="left">
        注意：当前用户所拥有的权限列表只针对有 系统信息管理权限的用户 开放
      </el-divider>

      <el-button style="margin-left: 10px;margin-bottom: 10px;" type="primary" plain size="mini" @click="toggleRowExpansion" icon="el-icon-sort">
        全部{{ isExpansion ? "收缩" : "展开" }}
      </el-button>

      <el-button style="margin-left: 10px;margin-bottom: 10px;" type="primary" size="mini" @click="toAddNewRouter" icon="el-icon-s-promotion">
        新增路由
      </el-button>

      <el-dialog title="新增路由设置(暂只支持二级)" :visible.sync="addNewRouter" >
        <el-form style="padding-right: 20px;" :rules="rules" ref="routerForm" :model="newRouterSet">
          <el-form-item label="路径" :label-width="labelWidthParent" prop="path">
            <el-input placeholder="请输入路径" v-model="newRouterSet.path" @input="checkParentRouter">
              <template slot="prepend">/</template>
            </el-input>
          </el-form-item>
          <el-form-item label="路由名" :label-width="labelWidthParent" prop="name">
            <el-input placeholder="请输入路由名(非中文,首字母大写)" v-model="newRouterSet.name" @input="checkParentRouter">
            </el-input>
          </el-form-item>
          <el-form-item label="标题" :label-width="labelWidthParent">
            <el-input placeholder="请输入路由标题" v-model="newRouterSet.meta.title" @input="checkParentRouter">
            </el-input>
          </el-form-item>
          <el-form-item label="图标" :label-width="labelWidthParent">
            <el-input placeholder="请输入路由图标(点击右侧图标查找)" v-model="newRouterSet.meta.icon" @input="checkParentRouter">
              <i
                class="el-icon-link el-input__icon"
                slot="suffix"
                @click="toLinkIcon">
              </i>
            </el-input>
          </el-form-item>
          <el-form-item label="隐藏路由" :label-width="labelWidthParent">
            <el-switch
              v-model="newRouterSet.hidden"
              active-text="隐藏"
              inactive-text="显示">
            </el-switch>
          </el-form-item>
          <el-form-item label="子路由" :label-width="labelWidthParent">
            <el-button type="primary" @click="childrenRouterSet=true" :disabled="canSetChildRouter">设置子路由</el-button>
              <el-dialog
                width="45%"
                title="子路由设置"
                :visible.sync="childrenRouterSet"
                append-to-body>
                <childrenRouter 
                  :style="{'margin-top':index!==0?'10px':'0px'}"
                  v-for="(item,index) in newRouterSet.children"
                  :key="index"
                  :item="item"
                  :index="index"
                  @deleteIndex="deleteChildrenRouter"
                  >
                </childrenRouter>
                <el-button type="primary" @click="addChildren" icon="el-icon-circle-plus" style="margin-left: 10px;margin-top: 10px;" circle size="mini"></el-button>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="childrenRouterSet = false">取 消</el-button>
                  <el-button type="primary" @click="sureAddChildren">确 定</el-button>
              </div>
            </el-dialog>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addNewRouter = false">取 消</el-button>
          <el-button type="primary" @click="sureAddRouter" :loading="loading">确 定</el-button>
        </div>
      </el-dialog>
      <el-table
        :style="{'font-size': fontSize + 'px'}"
        :data="tableData"
        style="width: 100%;margin-left: 10px;"
        row-key="path"
        border
        default-expand-all
        ref="dataTreeList"
        stripe
        :tree-props="{children: 'children'}">
        <el-table-column
          prop="name"
          label="菜单名称"
          :width="280 * fontSize / 14">
        </el-table-column>
        <el-table-column
          align="center"
          prop="path"
          label="菜单路径"
          sortable
          :width="220 * fontSize / 14">
        </el-table-column>
        <el-table-column
          align="center"
          prop="meta.title"
          label="菜单标题"
          :width="150 * fontSize / 14">
        </el-table-column>
        <el-table-column
          align="center"
          label="菜单图标"
          prop="meta.icon"
          :width="100 * fontSize / 14">
          <template slot-scope="scope">
              <i :class="scope.row.meta?scope.row.meta.icon:''"></i>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="hidden"
          label="是否隐藏"
          :width="100 * fontSize / 14">
          <template slot-scope="scope">
            <span :style="{'color':scope.row.hidden?'red':'green'}">{{ scope.row.hidden?'是':'否' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <div v-if="scope.row.name&&scope.row.path.charAt(0)==='/'">
              <el-button type="text" size="small" @click="editRouter(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="deleteRouter(scope.row.path)">删除</el-button>
            </div>
            <div v-else-if="scope.row.name&&scope.row.name!=='Dashboard'&&scope.row.name!=='PersonCenter'&&scope.row.name!=='InfoDetail'&&scope.row.name!=='ShowDetail'">
              <span>-</span>
            </div>
            <div v-else>
              <span style="color: red;">系统路由不可修改</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-backtop></el-backtop>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import childrenRouter from './childrenRouter/index.vue'
export default {
    name:'permissionDescription',
    components: {
      childrenRouter
    },
    data() {
      const checkName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入父路由名'))
        }else{
          if(!(/[a-zA-Z]+/.test(value))){
            callback(new Error('只能输入英文'))
          }else{
            callback()
          }
        }
      }
      return {
            tableData: [],
            isExpansion: true,
            addNewRouter: false,
            childrenRouterSet: false,
            loading: false,
            labelWidthParent: '100px',
            newRouterSet: {
              path:'',
              component:`{"name":"Layout","components":{"Navbar":{"components":{"Breadcrumb":{"watch":{},"computed":{},"methods":{},"staticRenderFns":[],"_compiled":true,"_scopeId":"data-v-b50ef614","beforeCreate":[null],"beforeDestroy":[null],"__file":"src/components/Breadcrumb/index.vue","_Ctor":{}},"Hamburger":{"name":"Hamburger","props":{"isActive":{"default":false}},"methods":{},"staticRenderFns":[],"_compiled":true,"_scopeId":"data-v-4e6f274c","beforeCreate":[null],"beforeDestroy":[null],"__file":"src/components/Hamburger/index.vue","_Ctor":{}}},"computed":{},"methods":{},"staticRenderFns":[],"_compiled":true,"_scopeId":"data-v-d16d6306","beforeCreate":[null],"beforeDestroy":[null],"__file":"src/layout/components/Navbar.vue","_Ctor":{}},"Sidebar":{"components":{"SidebarItem":{"name":"SidebarItem","components":{"Item":{"name":"MenuItem","functional":true,"props":{"icon":{"default":""},"title":{"default":""}},"_scopeId":"data-v-31ea41b3","__file":"src/layout/components/Sidebar/Item.vue","_Ctor":{}},"AppLink":{"props":{"to":{"required":true}},"computed":{},"methods":{},"staticRenderFns":[],"_compiled":true,"beforeCreate":[null],"beforeDestroy":[null],"__file":"src/layout/components/Sidebar/Link.vue","_Ctor":{}}},"mixins":[{"computed":{},"methods":{}}],"props":{"item":{"required":true},"isNest":{"default":false},"basePath":{"default":""}},"methods":{},"staticRenderFns":[],"_compiled":true,"beforeCreate":[null],"beforeDestroy":[null],"__file":"src/layout/components/Sidebar/SidebarItem.vue","_Ctor":{}},"Logo":{"name":"SidebarLogo","props":{"collapse":{"required":true}},"staticRenderFns":[],"_compiled":true,"_scopeId":"data-v-6494804b","beforeCreate":[null],"beforeDestroy":[null],"__file":"src/layout/components/Sidebar/Logo.vue"}},"computed":{},"staticRenderFns":[],"_compiled":true,"beforeCreate":[null],"beforeDestroy":[null],"__file":"src/layout/components/Sidebar/index.vue","_Ctor":{}},"AppMain":{"name":"AppMain","computed":{},"staticRenderFns":[],"_compiled":true,"_scopeId":"data-v-078753dd","beforeCreate":[null],"beforeDestroy":[null],"__file":"src/layout/components/AppMain.vue","_Ctor":{}}},"mixins":[{"watch":{},"methods":{}}],"computed":{},"methods":{},"staticRenderFns":[],"_compiled":true,"_scopeId":"data-v-13877386","beforeCreate":[null],"beforeDestroy":[null],"__file":"src/layout/index.vue","_Ctor":{}}`,
              redirect: '',
              name: '',
              meta: {
                title: '',
                icon: ''
              },
              hidden: false,
              children:[{}]
            },
            canSetChildRouter: true,
            rules: {
              path: [
                { required: true, message: '请输入父路由路径', trigger: 'blur' },
              ],
              name: [
                { required: true, validator: checkName, trigger: 'blur' }
              ]
            }
      }
    },
    computed: {
        ...mapGetters([
          'menusRoutes',
          'fontSize'
        ]),
    },
    mounted(){
        this.tableData = this.menusRoutes
    },
    methods: {
      initRouterSet(){//初始化路由设置
        this.newRouterSet={
          path:'',
          component:`{"name":"Layout","components":{"Navbar":{"components":{"Breadcrumb":{"watch":{},"computed":{},"methods":{},"staticRenderFns":[],"_compiled":true,"_scopeId":"data-v-b50ef614","beforeCreate":[null],"beforeDestroy":[null],"__file":"src/components/Breadcrumb/index.vue","_Ctor":{}},"Hamburger":{"name":"Hamburger","props":{"isActive":{"default":false}},"methods":{},"staticRenderFns":[],"_compiled":true,"_scopeId":"data-v-4e6f274c","beforeCreate":[null],"beforeDestroy":[null],"__file":"src/components/Hamburger/index.vue","_Ctor":{}}},"computed":{},"methods":{},"staticRenderFns":[],"_compiled":true,"_scopeId":"data-v-d16d6306","beforeCreate":[null],"beforeDestroy":[null],"__file":"src/layout/components/Navbar.vue","_Ctor":{}},"Sidebar":{"components":{"SidebarItem":{"name":"SidebarItem","components":{"Item":{"name":"MenuItem","functional":true,"props":{"icon":{"default":""},"title":{"default":""}},"_scopeId":"data-v-31ea41b3","__file":"src/layout/components/Sidebar/Item.vue","_Ctor":{}},"AppLink":{"props":{"to":{"required":true}},"computed":{},"methods":{},"staticRenderFns":[],"_compiled":true,"beforeCreate":[null],"beforeDestroy":[null],"__file":"src/layout/components/Sidebar/Link.vue","_Ctor":{}}},"mixins":[{"computed":{},"methods":{}}],"props":{"item":{"required":true},"isNest":{"default":false},"basePath":{"default":""}},"methods":{},"staticRenderFns":[],"_compiled":true,"beforeCreate":[null],"beforeDestroy":[null],"__file":"src/layout/components/Sidebar/SidebarItem.vue","_Ctor":{}},"Logo":{"name":"SidebarLogo","props":{"collapse":{"required":true}},"staticRenderFns":[],"_compiled":true,"_scopeId":"data-v-6494804b","beforeCreate":[null],"beforeDestroy":[null],"__file":"src/layout/components/Sidebar/Logo.vue"}},"computed":{},"staticRenderFns":[],"_compiled":true,"beforeCreate":[null],"beforeDestroy":[null],"__file":"src/layout/components/Sidebar/index.vue","_Ctor":{}},"AppMain":{"name":"AppMain","computed":{},"staticRenderFns":[],"_compiled":true,"_scopeId":"data-v-078753dd","beforeCreate":[null],"beforeDestroy":[null],"__file":"src/layout/components/AppMain.vue","_Ctor":{}}},"mixins":[{"watch":{},"methods":{}}],"computed":{},"methods":{},"staticRenderFns":[],"_compiled":true,"_scopeId":"data-v-13877386","beforeCreate":[null],"beforeDestroy":[null],"__file":"src/layout/index.vue","_Ctor":{}}`,
          redirect: '',
          name: '',
          meta: {
            title: '',
            icon: ''
          },
          hidden: false,
          children:[{}]
        }
      },
      sureEditRouter(){//提交编辑路由
        console.log(this.addNewRouter)
      },
      editRouter(row){//编辑路由
        this.addNewRouter = true
        console.log(row)
        this.newRouterSet = JSON.parse(JSON.stringify(row)) //深拷贝

        this.canSetChildRouter = false
      },
      deleteRouter(path){//删除路由
        this.$confirm('确定要删除路由 '+path+' ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //执行删除操作


          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      },
      toLinkIcon(){//跳转至icon选择页面
        this.$router.push({path:'/outLink/iframe',query:{linkUrl:'https://element.eleme.cn/#/zh-CN/component/icon'}})
      },
      checkParentRouter(){//验证父级路由是否完整
        if(this.newRouterSet.path!==''&&this.newRouterSet.name!==''&&/[a-zA-Z]+/.test(this.newRouterSet.name)&&this.newRouterSet.meta.title!==''&&this.newRouterSet.meta.icon!==''){
          this.canSetChildRouter = false
        }else{
          this.canSetChildRouter = true
        }
      },
      checkChilidRouter(child){//验证孩子路由是否完整
        if(child.path&&child.name&&child.name!==''&&child.path!==''){//如果path,name有值 且path,name是不为空
          if(child.meta&&child.meta.title!==''&&child.meta.icon!==''&&child.meta.title&&child.meta.icon){//meta是否存在且不为空
            return true
          }else if(child.title!==''&&child.icon!==''&&child.title&&child.icon){//title和icon有值且不为空
            return true
          }else{
            return false
          }
        }else{//如果没有值
          return false
        }
      },
      deleteChildrenRouter(index){//删除子路由
        this.newRouterSet.children.splice(index, 1)
      },
      toAddNewRouter(){//新增
        this.initRouterSet()
        this.canSetChildRouter = true
        this.addNewRouter = true
      },
      addChildren(){//添加子路由表单
        this.newRouterSet.children.push({})
      },
      sureAddChildren(){//添加子路由(提交子路由)
        console.log(this.newRouterSet.children)
        this.childrenRouterSet = false
      },
      sureAddRouter(){//添加路由(提交信息)
        this.loading = true

        let isValid = true
        for(const element of this.newRouterSet.children){//处理子路由
          if(this.checkChilidRouter(element)){//如果子路由都有值的
            element.meta = {
              title:element.title,
              icon:element.icon
            }
            
            element.component = (this.newRouterSet.path.charAt(0)==='/'? '':'/') + this.newRouterSet.path + '/'+ element.path +'/index'
            element.name = element.name.charAt(0).toUpperCase() + element.name.slice(1)//首字母转成大写
            delete element.title
            delete element.icon
          }else{//否则子路由没值就提示,并且不进行下一步操作
            this.$message({
              message: '提交失败,请检查子路由是否填写完整',
              type: 'error'
            })
            isValid = false
            break
          }
        }
        console.log(isValid)
        if(isValid){//如果判定内容没有空的
          this.newRouterSet.path.charAt(0)!=='/'?this.newRouterSet.path = '/' + this.newRouterSet.path:this.newRouterSet.path //第一个符号是否为/如果是就不作为，如果不是就在最前面加一个/
          this.newRouterSet.redirect = this.newRouterSet.path + '/' + this.newRouterSet.children[0].path //重定向默认为子理由第一个
          this.newRouterSet.name = this.newRouterSet.name.charAt(0).toUpperCase() + this.newRouterSet.name.slice(1)//首字母转成大写
          this.newRouterSet.meta = JSON.stringify(this.newRouterSet.meta)
          this.newRouterSet.children = JSON.stringify(this.newRouterSet.children)
          this.newRouterSet.component = typeof(this.newRouterSet.component)==='string'?this.newRouterSet.component:JSON.stringify(this.newRouterSet.component)//如果不是string类型，就把他转换成string类型

          console.log(this.newRouterSet)

          //处理提交  编辑路由


        }

        this.initRouterSet()   //初始化
        this.canSetChildRouter = true
        this.addNewRouter = false
        this.loading = false
      },
        // 切换数据表格树形展开
      toggleRowExpansion() {
        this.isExpansion = !this.isExpansion;
        this.toggleRowExpansionAll(this.tableData, this.isExpansion);
      },
      toggleRowExpansionAll(data, isExpansion) {
        data.forEach((item) => {
          this.$refs.dataTreeList.toggleRowExpansion(item, isExpansion);
          if (item.children !== undefined && item.children !== null) {
            this.toggleRowExpansionAll(item.children, isExpansion);
          }
        });
      },
    },
}
</script>