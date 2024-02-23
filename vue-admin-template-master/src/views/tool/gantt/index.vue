<!-- 甘特图 -->
<template>
    <el-scrollbar ref="gantt_scrollbar" class="gantt-box">
      <div ref="gantt" class="gantt-container"></div>
    </el-scrollbar>
  </template>
  
  <script>
  import { gantt } from 'dhtmlx-gantt';
  import "dhtmlx-gantt/codebase/dhtmlxgantt.css"
  export default {
      name: "gantt",
      props: {
          ganttTasks: {
              type: Array,
              default () {
                  return []
              }
          }
      },
      data() {
          return {
              ganttData: []
          }
      },
      mounted() {
          this.initGantt() // gantt初始化配置
          this.getGanttData() // 数据format以及gantt reload
      },
      methods: {
          initGantt() {
              let _this = this
              // 在初始化前设置配置项

              // gantt只读
	          //gantt.config.readonly = true;

              // 初始化gantt
              gantt.init(this.$refs.gantt);
              // 绑定数据
              gantt.parse({
                  data: [], // 时间轴上横条的数据
                  link: [] // 连接线的数据
              });

              //甘特图的row是否可以选中
              //gantt.config.select_task  = false;
              //表格列宽自适应
              gantt.config.autofit = false;
              //设置日期格式
              gantt.config.xml_date = "%Y/%m/%d";

              gantt.config.scale_unit = "day";


              //中文
              gantt.i18n.setLocale("cn");


          },
          reload() {
              gantt.clearAll();// 从甘特图中删除所有任务和其他元素（包括标记）
              gantt.parse({
                  data: this.ganttData,
                  link: []
              }); // 数据解析
              gantt.render(); // 呈现整个甘特图
          },
          getGanttData() {
              let ganttData = [
                {
                    id: 1, text: "Project #2", start_date: "02-04-2018", duration: 60, order: 10,
                    progress: 0.4, open: true
                },
                {
                    id: 2, text: "Task #1", start_date: "02-04-2018", duration: 8, order: 10,
                    progress: 0.6, parent: 1
                },
                {
                    id: 3, text: "Task #2", start_date: "11-04-2018", duration: 8, order: 20,
                    progress: 0.6, parent: 1
                }
              ]
              // toDo
              // formatGanttData()
              this.ganttData = ganttData
              this.reload()
          }
      }
  }
  </script>
  
  <style scoped>
      /*@import "dhtmlx-gantt/codebase/dhtmlxgantt.css"*/
      .gantt-container {
          width: 10000px;
          height: 400px;
      }
  
  .gantt-box {
      width: calc(100% - 10px);
      overflow-y: scroll;
      overflow-x: scroll;
      height: 400px;
  }
  </style>