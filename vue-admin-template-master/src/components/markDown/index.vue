<!-- markdown控件 -->
<template>
  <div>
    <mavon-editor v-model="markdown" :ishljs="true" 
      @imgAdd="imgAdd"></mavon-editor>
  </div>
</template>

<script>
export default {
  name:'markDown',
  data() {
    return {
      markdown: "## 🌐 地址 \n## Hello World\n\nThis is a **Markdown** renderer."
    }
  },
  methods:{
    imgAdd(pos,$file){
            const formData = new FormData() // 实例表单对象
            formData.append('file',$file) // 将获取的文件对象加入到表单对象中
            // axios({
            //     url:'http://localhost:8080/file/upload',
            //     method:'POST',
            //     data:formData,
            //     headers: {'Content-Type': 'multipart/form-data'},
            // }).then(res=>{
            //     this.$refs.md.$img2Url(pos, res.data) //上传成功后，将编辑器中文件url重新赋值
            // })
        },
  }
};
</script>
