<!-- 签名控件 -->
<template>
  <div>
    <el-form ref="form" label-width="120px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="笔画粗细">
            <el-input-number v-model="esignConfig.lineWidth" label="笔画粗细" size="mini"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="笔画颜色">
            <el-color-picker v-model="esignConfig.lineColor"></el-color-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="背景颜色">
            <el-color-picker v-model="esignConfig.bgColor"></el-color-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="重置清空背景色">
            <el-switch
              v-model="esignConfig.isClearBgColor"
              active-text="是"
              inactive-text="否">
            </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <vue-esign ref="esign" 
        :width="outWidth" 
        :height="esignConfig.height" 
        :lineWidth="esignConfig.lineWidth" 
        :lineColor="esignConfig.lineColor" 
        :bgColor.sync="esignConfig.bgColor"
        :isClearBgColor="esignConfig.isClearBgColor" />
      <el-button @click="handleReset">清空画板</el-button>
      <el-button @click="handleGenerate">生成图片</el-button>
  </div>
</template>
<script>
import vueEsign from 'vue-esign'
export default {
  name:'temp',
  components: { 
    vueEsign
  },
  data () {
    return {
        resultImg: '',
        esignConfig:{
          width: 800,
          height: 300,
          lineWidth: 4,
          lineColor: '#000000',
          bgColor:'',
          isClearBgColor:true
        }
    }
  },
  computed:{
    outWidth(){
      return this.width
    }
  },
  methods: {
    handleReset () {
      this.$refs.esign.reset()
    },
    handleGenerate () {//背景颜色默认是透明
      console.log(this.esignConfig)
      this.$refs.esign.generate(this.esignConfig)
      .then(res => {
        this.resultImg = res // 导出格式 base64图片
        this.downloadImage(this.resultImg)
      })
      .catch(err => {
        alert(err) // 画布没有签字时会执行这里 'Not Signned'
      })
    },
    downloadImage (url) {
      // 如果是在网页中可以直接创建一个 a 标签直接下载
      let a = document.createElement('a')
      a.href = url
      a.download = '电子签名'
      a.click()
    },
  }
}
</script>