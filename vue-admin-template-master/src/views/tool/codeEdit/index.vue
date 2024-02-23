<template>
    <div>
      <codeEdit
            ref="html"
            width="500px"
            height="290px"
            language="html" />
        <el-button @click="runCode">运行</el-button>
        <p>实现结果：</p>
        <iframe class="view-panel" id="preview" frameborder="0"></iframe>
    </div>
</template>
<script>
import codeEdit from '@/components/codeEdit/index.vue'
export default {
  components:{
    codeEdit
  },
  methods:{
    runCode() {
        var html = this.$refs.html.monacoEditor.getValue();
        // var css = this.$refs.css.monacoEditor.getValue();
        // var js = this.$refs.js.monacoEditor.getValue();
        let code = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Editor</title>
        </head>
        <body>${html}</body>

        </html>
       `;
        console.log(code);
        const preview = document.querySelector("#preview");
        preview.setAttribute("srcdoc", code);
      }
  }
}
</script>