<template>
  <div class="login-container" style="width: 100%; height: 100vh" ref="vantaRef">
    <div class="isShowDynamicBack">
      <el-button type="warning" @click="changeDynamic">{{ isDynamic?'动态壁纸':'静态壁纸'}}</el-button>
    </div>
    <div class="container" id="container">
      <div class="form-container sign-in-container">
        <!-- 登录表单 -->
        <el-form ref="loginForm" :model="loginForm" v-if="loginShow" class="login-form" auto-complete="on" label-position="left">
          <h1>赞赞管理系统</h1>
          <span class="formspan">登录</span>
          <span class="formspan">注：暂未接入后端 账号密码<span style="color:orange">随意填写</span>，<br><span style="color:orange">管理员登录</span>可看到更多功能</span>
          <el-form-item>
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
                ref="username"
                v-model="loginForm.userName"
                placeholder="请输入账号"
                name="username"
                type="text"
                auto-complete="on"
            />
          </el-form-item>
          <el-form-item>
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="请输入密码"
                name="password"
                auto-complete="on"
            />
            <span class="show-pwd" @click="showPwd('password')">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
          <el-form-item>
            <span class="svg-container">
              <svg-icon icon-class="codepen" />
            </span>
            <el-input
              @keyup.enter.native="handleLogin"
              v-model="loginForm.verifycode"
              placeholder="输入验证码(点击切换)">
            </el-input>
          </el-form-item>
          <el-form-item>
            <div class="identifybox">
              <div @click="refreshCode">
                <s-identify :identifyCode="identifyCode"></s-identify>
              </div>
            </div>
          </el-form-item>
          <div class="tips">
            <span style="margin-right:20px;">当前登录类型：{{ loginForm.admin ? '管理员':'客户' }}</span>
          </div>
          <el-button :loading="loading" type="primary" :class="!loginForm.admin?'login-button-reg':'login-button'" @click.native.prevent="handleLogin">登录</el-button>
          <br>
          <el-button v-if="!loginForm.admin" type="primary" class="register-button" @click.native.prevent="toRegister">注册</el-button>
        </el-form>

        
        <!-- 注册表单 -->
        
        <el-form ref="loginForm" :model="registerForm" v-if="registerShow" class="login-form" auto-complete="on" label-position="left">
          <span class="formspan">注册</span>
          <el-form-item>
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
                ref="loginId"
                v-model="registerForm.loginId"
                placeholder="请输入用户登录账号"
                name="loginId"
                type="text"
                auto-complete="on"
            />
          </el-form-item>
          <el-form-item>
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
                ref="userName"
                v-model="registerForm.userName"
                placeholder="请输入用户名"
                name="userName"
                type="text"
                auto-complete="on"
            />
          </el-form-item>
          <el-form-item>
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
                :key="passwordType"
                ref="password"
                v-model="registerForm.password"
                :type="passwordType"
                placeholder="请输入密码"
                name="password"
                auto-complete="on"
            />
            <span class="show-pwd" @click="showPwd('password')">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
          <el-form-item>
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
                :key="surePasswordType"
                ref="password"
                v-model="surePassword"
                :type="surePasswordType"
                placeholder="请确认密码"
                name="surePassword"
                auto-complete="on"
            />
            <span class="show-pwd" @click="showPwd('surePassword')">
              <svg-icon :icon-class="surePasswordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
          <el-popover placement="left" width="180" trigger="click" v-model="showAvatar">
            <el-row>
              <el-col :span="8" v-for="(o, index) in avatarSelectList" :key="index" style="margin-top: 10px;">
                <el-avatar :src="o" @click.native="selectAvatar(o)"></el-avatar>
              </el-col>
            </el-row>
          </el-popover>
          <el-form-item>
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="avatar"
              v-model="registerForm.avatar"
              placeholder="请输入头像(选填)"
              name="avatar"
              type="text"
              auto-complete="on"
              @click.native="doShowAvatar"
              @blur="focusOnOther"
            />
          </el-form-item>
          <el-form-item style="width: 86%;">
            <el-switch
              v-model="registerForm.enabled"
              active-text="激活"
              inactive-text="不激活">
            </el-switch>
          </el-form-item>
          <el-button :loading="loadingReg" type="primary" class="login-button-reg" @click.native.prevent="handleRegister">注册</el-button>
          <br>
          <el-button type="primary" class="register-button" @click.native.prevent="toLogin">返回</el-button>
        </el-form>
      </div>
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-right">
            <img class="logo" src="../../assets/logo.jpg" alt="" />
            <el-button plain style="margin-top: 20px;" @click.native="loginType('admin')" v-if="!loginForm.admin&&loginShow">切换到管理员登录</el-button>
            <el-button plain style="margin-top: 20px;" @click.native="loginType('client')" v-if="loginForm.admin&&loginShow">切换到客户登录</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SIdentify from './identify/index.vue'
import { mapState } from 'vuex'
import * as THREE from 'three' //导入样式
import CLOUDS from 'vanta/src/vanta.clouds'  //导入动态样式逻辑
export default {
  name: 'Login',
  components:{
    SIdentify
  },
  data() {
    return {
      loginForm: {//登录表单
        userName: '',
        password: '',
        verifycode: '',
        admin:false
      },
      registerForm:{//注册表单
        loginId:'',
        userName:'',
        password:'',
        avatar:'',
        enabled:true
      },
      surePassword:'',
      loading: false,
      loadingReg: false,
      passwordType: 'password',
      surePasswordType: 'password',
      loginShow: true,
      registerShow: false,
      flagPassword: 0,
      flagSurePassword: 0,
      showAvatar:false,
      avatarSelectList:[],
      isDynamic: false,
      //验证码相关
      identifyCodes: '1234567890abcdefghijklmnopqrstuvwxyz',
      identifyCode: '',
    }
  },
  computed:{
    ...mapState(['settings'])
  },
  methods: {
    changeDynamic(){//切换动态壁纸
      this.isDynamic = !this.isDynamic
      if(this.isDynamic){//显示动态壁纸
        this.vantaEffect = CLOUDS({
          el: this.$refs.vantaRef,
          THREE: THREE
        })
      }else{//不显示动态壁纸
        if (this.vantaEffect) {
          this.vantaEffect.destroy()
        }
      }
    },
    focusOnOther(){  // 选择头像 失去焦点  
      this.showAvatar = false
    },
    selectAvatar(avatarUrl){  //点击 选择头像
      this.registerForm.avatar = avatarUrl
      this.showAvatar = false
    },
    doShowAvatar(){   //显示头像选择
      this.avatarSelectList = this.settings.avatarList
      this.showAvatar = true
    },
    checkPasswordAndInfo(){   //检查信息和密码是否正确和完整性
      if(this.registerForm.loginId===''||this.registerForm.userName===''||this.registerForm.password===''){
        this.$message({
          showClose: true,
          message: '信息填写不完整!',
          type: 'error'
        })
        return false
      }else if(this.registerForm.password!==this.surePassword){
        this.$message({
          showClose: true,
          message: '两次密码不一致!',
          type: 'error'
        })
        return false
      }else if(this.registerForm.password.length<6){
        this.$message({
          showClose: true,
          message: '用户名密码长度不能小于6位!',
          type: 'error'
        })
        return false
      }else{
        return true
      }
    },
    handleRegister(){
      this.loadingReg = true
      if(this.checkPasswordAndInfo()){
        if(this.registerForm.avatar === ''){  // 如果不选头像，默认是第一个头像
          this.registerForm.avatar = this.settings.avatarList[0]
        }
        this.$store.dispatch('user/register', this.registerForm).then((res) => {
          // if(typeof(res.data)!=="object"){
          //   this.$message({
          //     showClose: true,
          //     message: res.data,
          //     type: 'error'
          //   });
          // }else{
            if(res){
              this.$message({
              showClose: true,
              message: '注册成功!将在1秒后自动登录',
              type: 'success'
            })
            // 注册成功后 过1秒自动登录
            setTimeout(() => {
              //需要定时执行的代码
              this.loginForm.userName = this.registerForm.loginId
              this.loginForm.password = this.registerForm.password
              this.loginForm.verifycode= this.identifyCode
              this.handleLogin()
            }, 1000)
            this.loadingReg = false
            }else{
              this.loadingReg = false
            }
      
          //}
          
        })
      }else{
        this.loadingReg = false
      }
    },
    toLogin(){ // 注册表单返回 登录表单
      this.loginShow = true
      this.registerShow = false
    },
    toRegister(){  // 货主 注册
      this.loginShow = false
      this.registerShow = true
    },
    showPwd(type) {  //显示密码
      if (type === 'password') {
        if(this.flagPassword===0){
          this.passwordType = ''
          this.flagPassword++
        }else{
          this.passwordType = 'password'
          this.flagPassword = 0
        }
      } else if(type === 'surePassword'){
        if(this.flagSurePassword===0){
          this.surePasswordType = ''
          this.flagSurePassword++
        }else{
          this.surePasswordType = 'password'
          this.flagSurePassword = 0
        }
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {   //登录
      this.loading = true
      if(this.loginForm.verifycode===this.identifyCode){//验证码输入正确
        console.log(this.loginForm)
        this.$store.dispatch('user/login', this.loginForm).then((res) => {
          // if(typeof(res.data)!=="object"){  //返回值中如果不是对象类型，则显示错误的字段
          //   this.$message({
          //     showClose: true,
          //     message: res.data,
          //     type: 'error'
          //   });
          // }else{   //正常登录
          //   this.$message({
          //     showClose: true,
          //     message: '登录成功!',
          //     type: 'success'
          //   });  
          //   this.$store.commit('settings/initTag') // 初始化tag标签
          //   this.$router.push({ path: this.redirect || '/' })
          // }
            
            this.$store.commit('settings/initTag') // 初始化tag标签
            this.$router.push({ path: this.redirect || '/' })
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }else{
        this.$message({
          showClose: true,
          message: '验证码输入错误!',
          type: 'error'
        }); 
        this.loading = false
      }  
    },
    loginType(type){ // 切换登录界面样式
      if(type==='admin'){
        this.loginForm.admin = true
        this.$notify.info({
          title: '消息',
          message: '已切换到 管理员 登录!',
          duration: 2000
        })
      }else{
        this.loginForm.admin = false
        this.$notify.info({
          title: '消息',
          message: '已切换到 客户 登录!',
          duration: 2000
        })
      }
    },
    randomNum(min, max) {//产生随机数
      return Math.floor(Math.random() * (max - min) + min)
    },
    refreshCode() {// 切换验证码   
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    makeCode(o, l) {//生成验证码
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
        this.randomNum(0, this.identifyCodes.length)]
      }
   }
  },
  mounted(){
    this.identifyCode=''
    this.makeCode(this.identifyCodes,4)
  },
  beforeDestroy(){
    if (this.vantaEffect) {
      this.vantaEffect.destroy()
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  font-family: "Montserrat", sans-serif;
  background: #f6f5f7;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* margin: -20px 0 50px; */
  background-image: url('../../assets/bg.jpg');
  background-size: cover;
  
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 65px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #fffdfd;
  }
}
.container {
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: absolute;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
  opacity: 0.8;
}
.form-container form {
  background: rgba(45, 52, 54, 1);
  display: flex;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.form-container form h1{
  font-weight: bold;
  margin: 0;
  color: beige;
}

.formspan{
  margin-top: 5px;
  font-size: 12px;
  color: beige;
  margin-bottom: 25px;
}

.sign-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
}

.login-button-reg{
  border-radius: 20px;
  border: 1px solid #1BBFB4;
  background: #1BBFB4;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  width:80%;
  margin-top: 40px;
}

.login-button{
  border-radius: 20px;
  border: 1px solid #1BBFB4;
  background: #1BBFB4;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  width:80%;
  margin-top: 40px;
  margin-bottom:66px;
}


.register-button{
  border-radius: 20px;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  width:80%;
  margin-bottom:20px;
  margin-top: 8px;
}

.login-button:hover{
  background: #f588bb;
  border: 1px solid #f588bb;
}

.register-button:hover{
  background: #f588bb;
  border: 1px solid #f588bb;
}

.login-button-reg:hover{
  background: #f588bb;
  border: 1px solid #f588bb;
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.overlay {
  background: transparent;
  background: linear-gradient(to right, #ff4b2b, #ff416c) no repeat 0 0 / cover;
  color: #fff;
  position: absolute;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}
.overlay-panel {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 40px;
  height: 100%;
  width: 50%;
  text-align: center;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-right {
  right: 0;
  transform: translateX(0);
}

.logo {
  width: 300px;
  height: auto;
}

.isShowDynamicBack{
  position:absolute;
  z-index:999;
  left:10px;
  top:10px;
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.identifybox {
  height: 60px;
}

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 50px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
