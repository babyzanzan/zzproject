<!-- 账号管理页面 -->
<template>
  <div class="app-container">
    <el-row style="margin-top: 10px;" :gutter="20">
      <el-col :span="8">
        <el-tabs type="border-card">
          <el-tab-pane label="搜索">
            <div class="grid-content">
              <el-row>
                <el-col :span="15">
                  <el-input style="margin-top: 10px;"
                    placeholder="请输入人员姓名"
                    prefix-icon="el-icon-search"
                    v-model="selectInfo.keyWord"
                    clearable>
                  </el-input>
                </el-col>
                <el-col :span="5">
                  <el-button type="primary" style="margin-top: 10px;margin-left: 10px;" @click="queryInfo">搜索</el-button>
                </el-col>
              </el-row>
              <DIYtable templateName="人员设置模板" :currentPages="1" @optionInfo="doPersonOption" :loaded="loading" :viewType="type" :dataTable="tableData"></DIYtable>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="16" v-if="showUserInfo">
        <el-tabs type="border-card">
          <el-tab-pane label="浏览">
            <div class="grid-content">
              <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="用户ID">
                  <el-col :span="12">
                    <el-input v-model="form.id" :disabled="true"></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="用户登录账号">
                  <el-col :span="12">
                    <el-input v-model="form.loginId"></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="用户名称">
                  <el-col :span="12">
                    <el-input v-model="form.userName"></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="用户头像">
                  <el-col :span="12">
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="form.avatar"
                      fit="fit">
                    </el-image>
                    <el-input v-model="form.avatar"></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="货主ID">
                  <el-col :span="12">
                    <el-input v-model="form.ownerId"></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="货主名称">
                  <el-col :span="12">
                    <el-input v-model="form.ownerName"></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item>
                  <el-col>
                    <el-switch
                      v-model="form.enabled"
                      active-text="已激活">
                    </el-switch>
                  </el-col>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="配置权限">
            <label style="margin-left: 10px;">默认角色权限</label>
            <el-radio-group v-model="rolePermission" @input="rolePermissionSelect" style="margin-left: 20px;">
              <el-radio-button label="管理员"></el-radio-button>
              <el-radio-button label="内部人员"></el-radio-button>
              <el-radio-button label="客户"></el-radio-button>
              <el-radio-button label="自定义"></el-radio-button>
            </el-radio-group>
            <el-tree
              ref="tree"
              style="margin-top: 10px;;margin-bottom: 10px;"
              :props="props"
              show-checkbox
              :data="treeData"
              @check="handleCheck"
              node-key="id"
              :default-checked-keys="rightSelect">
            </el-tree>
            <el-button type="primary" style="margin-top: 10px;width: 200px" :loading="submitLoading" @click="submitPersonnal">提交</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
import { getPersonInfo,uploadUserRight } from '@/api/table' 
import { fetchUserMenuList } from '@/api/user'
import DIYtable from '@/components/DIYtable/index.vue'
import { mapState } from 'vuex';
const res = [
        {
            "id": 1,
            "loginId": "2222",
            "userName": "赞赞管理员",
            "avatar": "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
            "enabled": true,
            "ownerId": 1,
            "ownerName": "陆赞赞"
        },
        {
            "id": 8,
            "loginId": "luzanzan",
            "userName": "陆赞赞",
            "avatar": "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
            "enabled": true,
            "ownerId": 1,
            "ownerName": "陆赞赞"
        },
        {
            "id": 13,
            "loginId": "lzz",
            "userName": "陆啦啦啦",
            "avatar": "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
            "enabled": true,
            "ownerId": 1,
            "ownerName": "陆赞赞"
        }]
export default {
  name:'personnel',
  components: {
    DIYtable,
  },
  data() {
    return {
      type: 'personnel',
      loading: false,
      submitLoading: false,
      showUserInfo: false,
      tableData: [],
      selectInfo: {
        keyWord: '',
      },
      form: {
        id: '',
        loginId: '',
        userName: '',
        enabled: true,
        ownerName: '',
        avatar: '',
        ownerId: ''
      },
      treeData: [], // 配置权限
      props: {
        label: 'label',
        children: 'children'
      },
      rightSelect:[], // 选择的权限列表
      submitRight:[],
      rolePermission: '自定义',

    }
  },
  computed: {
    ...mapState(['settings']),
  },
  mounted(){
    this.treeData = this.settings.permissionConfiguration
    this.queryInfo()
  },
  methods: {
    jugementRole(){
      if(this.rightSelect.length===7){
        this.rolePermission='管理员'
      }else if(!this.rightSelect.includes(1)&&this.rightSelect.length===6){
        this.rolePermission='内部人员'
      }else if(this.rightSelect.includes(6)&&this.rightSelect.includes(7)&&this.rightSelect.includes(9)&&this.rightSelect.length===3){
        this.rolePermission='客户'
      }else{
        this.rolePermission='自定义'
      }
    },
    rolePermissionSelect(data){//默认角色权限选择
      this.rightSelect = []  //选择列表初始化
      this.resetChecked()//重置选中状态
      if(data==="管理员"){
        this.rightSelect = [1,3,6,7,9,12,13]
      }else if(data==="内部人员"){
        this.rightSelect = [3,6,7,9,12,13]
      }else if(data==="客户"){
        this.rightSelect = [6,7,9]
      }
    },
    resetChecked() {//重置选中状态
      this.$refs.tree.setCheckedKeys([]);
    },
    handleCheck(data, checked) {//处理选中
      this.rightSelect=checked.checkedKeys
      this.jugementRole()
    },
    queryInfo(){ //按条件搜索
      this.loading = true
      this.tableData = res
      this.loading = false
      // getPersonInfo({name:this.selectInfo.keyWord})
      // .then((res)=>{
      //   this.tableData = res.data
      //   this.loading = false
      // })
      // .catch((error)=>{
      //   console.log(error)
      //   this.loading = false
      // })
    },
    async doPersonOption(row,type){  //点击操作之后,显示 人员信息 和 人员的权限
      this.showUserInfo = false
      this.rightSelect = []  // 初始化默认选择列表
      if(type!=='init'){
        this.form = row
      }
      await fetchUserMenuList({userId:this.form.id})
      .then((res)=>{
         for(const element of res.data){
          this.rightSelect.push(element.id)
        }
        this.jugementRole()
      })
      .catch((error)=>{
        console.log(error)
      })
      this.showUserInfo = true
    },
    async submitPersonnal(){   //提交权限信息
      this.submitRight = []  // 初始化提交权限信息列表
      this.submitLoading = true
      for(const element of this.rightSelect){
        this.submitRight.push({userId:this.form.id,menuId:element})
      }
      // console.log(this.submitRight)
      // this.submitLoading = false

      await uploadUserRight(this.submitRight)
        .then((res)=>{
          this.$message({
            showClose: true,
            message: '权限设置成功!',
            type: 'success'
          })
          this.submitLoading = false
          this.doPersonOption('','init')
        })
        .catch((error)=>{
          console.log(error)
          this.$message({
            showClose: true,
            message: '权限设置失败!',
            type: 'error'
          })
          this.submitLoading = false
        })
    }
  }
}
</script>