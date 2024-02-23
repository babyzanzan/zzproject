<!-- 个人中心页面 -->
<template>
    <div>
        <el-row :gutter="22" style="margin-top: 20px;margin-left: 20px;">
            <el-col :span="8">
                <el-card class="box-card" style="text-align: center;" shadow="hover">
                    <div slot="header" class="clearfix" style="text-align: left;">
                        <span>头像</span>
                    </div>
                    <div style="display: flex;justify-content: center;">
                        <uploadAvatar :originImgUrl="avatar" />
                    </div>
                </el-card>
            </el-col>
            <el-col :span="15">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>基本信息</span>
                    </div>
                    <el-form :model="userInfo" class="demo-form-inline" label-width="120px" style="margin-top: 10px;">
                        <el-form-item label="用户名id">
                            <el-input v-model="userInfo.userId" placeholder="用户名id" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="用户名">
                            <el-input v-model="userInfo.userName" placeholder="用户名" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="warning" @click="doShowUpdate">修改密码</el-button>
                        </el-form-item>
                        <div v-if="showUpdate">
                            <el-form-item label="原密码">
                                <el-input :type="passwordType" v-model="userInfo.oldPassword" placeholder="请输入旧密码" ></el-input>
                            </el-form-item>
                            <el-form-item label="新密码">
                                <el-input :type="passwordType" v-model="userInfo.password" placeholder="请输入新密码" ></el-input>
                            </el-form-item>
                            <el-form-item label="确认密码">
                                <el-input :type="passwordType" v-model="userInfo.surePassword" placeholder="请再次输入新密码" ></el-input>
                            </el-form-item>
                            <el-form-item label="">
                                <el-button type="primary" @click="updatePsw" :loading="loading">确认</el-button>
                                <el-button type="success" :icon="iconType" @click="showPwd()">{{ passwordTypeFlag?'隐藏':'显示' }}密码</el-button>
                            </el-form-item>
                        </div>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import uploadAvatar from '@/components/uploadAvatar'
export default {
  name:'personCenter',
  components:{
    uploadAvatar
  },
  data() {
    return {
        userInfo:{
            userId: '',
            userName: '',
            oldPassword: '',
            password: '',
            surePassword: ''
        },
        showUpdate:false,
        passwordTypeFlag: false,
        iconType:'el-icon-view',
        loading:false,
        passwordType: 'password',
    }
  },
  methods:{
    doShowUpdate(){//能否修改密码
        this.showUpdate = !this.showUpdate
    },
    updatePsw(){//修改密码
        this.loading = true
        this.$confirm('您确定要修改密码吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            if(this.checkPassword()){
                this.$store.dispatch('user/updatePassword', {
                    userId:this.userInfo.userId,
                    oldPassword:this.userInfo.oldPassword,
                    password:this.userInfo.password
                }).then((res) => {
                    if(typeof(res.data)!=="object"){
                        this.$message({
                            showClose: true,
                            message: res.data,
                            type: 'error'
                        });
                        this.loading = false
                    }else{
                        this.$message({
                            showClose: true,
                            message: '密码修改成功,请重新登录!',
                            type: 'success'
                        })
                        this.loading = false
                        setTimeout(async () => {
                            //需要定时执行的代码
                            await this.$store.dispatch('user/logout')
                            this.$router.push(`/login?redirect=${this.$route.fullPath}`)
                        }, 1000)
                    }
                })
            }
        }).catch(() => {
          this.loading = false       
        })
    },
    checkPassword(){//验证密码完整性
        if(this.userInfo.password===''||this.userInfo.surePassword===''||this.userInfo.oldPassword===''){
            this.$message({
                type: 'error',
                message: '信息填写不完整!'
            })
            this.loading = false
            return false
        } else if(this.userInfo.password===this.userInfo.surePassword){
            return true
        } else if(this.userInfo.password.length<6){
            this.$message({
                type: 'error',
                message: '密码长度不能小于6位!'
            })
            this.loading = false
            return false
        } else {
            this.$message({
                type: 'error',
                message: '两次输入的密码不一致!'
            })
            this.loading = false
            return false
        }
    },
    showPwd() {
        if(!this.passwordTypeFlag){  //显示密码
            this.passwordType = ''
            this.iconType= 'el-icon-remove'
            this.passwordTypeFlag = !this.passwordTypeFlag
        }else{  // 隐藏密码
            this.passwordType = 'password'
            this.iconType= 'el-icon-view'
            this.passwordTypeFlag = !this.passwordTypeFlag
        }
    },
  },
  mounted(){
    this.userInfo.userId = this.userId
    this.userInfo.userName = this.name
    this.userInfo.avatar = this.avatar
  },
  computed: {
    ...mapGetters([
      'avatar',
      'name',
      'userId'
    ]),
  },
}
</script>
<style scoped>
img {
  display: block;

  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
</style>