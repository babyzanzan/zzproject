<!-- 代码编辑器控件 -->
<template>
  <div id="monacoEditorContainer" style="width: 100%; height: 300px">
  </div>
</template>
  
<script>
import * as monaco from "monaco-editor";
export default {
    data() {
      return {
        standaloneEditorConstructionOptions: {
          value: '', // 编辑器的值
          language: 'javascript', //语言
          theme: 'vs-dark', // 编辑器主题：vs, hc-black, or vs-dark
          autoIndent: true, // 自动缩进
          readOnly: false, // 是否只读
        }
      };
    },
    mounted() {
      this.createMonacoEditor();
    },
    methods: {
      createMonacoEditor() {
        // 使用 - 创建 monacoEditor 对象
        const container = document.querySelector('#monacoEditorContainer')
        this.monacoEditor = monaco.editor.create(container, this.standaloneEditorConstructionOptions)
      },
    },
}
</script>
  