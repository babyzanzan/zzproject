<!-- 新手引导 -->
<template>
    <div>
        <div id="step1">
            <div>这里边是你第一步需要指引所框选的内容</div>
        </div>
        <div id="step2">
            <div>这里边是你第二步需要指引所框选的内容</div>
        </div>
        <div id="step3">
            <div>这里边是你第三步需要指引所框选的内容</div>
        </div>
        <div class="new-tips" @click="viewIntro()">新人教程</div>
    </div>
</template>
<script>
export default {
  name: 'guidStep',
  data(){
    return{
         introOption: { // 参数对象
            prevLabel: '上一步',
            nextLabel: '下一步',
            skipLabel: '跳过',
            doneLabel: '完成',
            tooltipClass: 'intro-tooltip', /* 引导说明文本框的样式 */
            // highlightClass: 'intro-highlight', /* 说明高亮区域的样式 */
            exitOnEsc: true, /* 是否使用键盘Esc退出 */
            exitOnOverlayClick: false, /* 是否允许点击空白处退出 */
            keyboardNavigation: true, /* 是否允许键盘来操作 */
            showBullets: false, /* 是否使用点显示进度 */
            showProgress: false, /* 是否显示进度条 */
            scrollToElement: true, /* 是否滑动到高亮的区域 */
            overlayOpacity: 0.5, // 遮罩层的透明度 0-1之间
            positionPrecedence: ['bottom', 'top', 'right', 'left'], /* 当位置选择自动的时候，位置排列的优先级 */
            disableInteraction: false, /* 是否禁止与元素的相互关联 */
            hidePrev: true, /* 是否在第一步隐藏上一步 */
            // hideNext: true, /* 是否在最后一步隐藏下一步 */
            steps: [], /* steps步骤，可以写个工具类保存起来 */
          },
          tipsImg1: require('./img/avatar4.jpeg'), // 新手引导的提示图片
          tipsImg2: require('./img/avatar3.jpeg') // 新手引导的提示图片
    }
  },
  methods: {
    // 重新查看引导
    viewIntro(){
        this.initGuide()
    },
    initGuide() {
            // 绑定标签元素的选择器数组
            this.introOption.steps = [
                { title: '系统使用指导', element: '#step1', intro: `鼠标悬浮在各个功能模块上，可快速查找系统对应操作SOP以及运维人员。<img src="` + this.tipsImg1 + `" alt="" style="width: 200px;margin-top: 15px;"/>`},
                { title: '个人信息', element: '#step2', intro: `点击个人头像/下拉图标，选择个人信息，初始密码为******，建议修改为个人账号密码。<img src="` + this.tipsImg2 + `" alt="" style="width: 125px;margin-top: 15px;"/>`, },
                { title: '重新引导', element: '#step3', intro: '点击此处可重新查看引导流程。', },
            ]
            this.$intro()
                .setOptions(this.introOption)
                // 点击结束按钮后执行的事件
                .oncomplete(() => {
                    console.log('点击结束按钮后执行的事件')
                })
                // 点击跳过按钮后执行的事件
                .onexit(() => {
                    console.log('点击跳过按钮后执行的事件')
                })
                // 确认完毕之后执行的事件
                .onbeforeexit(() => {
                    console.log('确认完毕之后执行的事件')
                })
                .start()
        },
  },
  mounted () {
    this.$nextTick(() => {
      if (localStorage.getItem('isFirst') === null || localStorage.getItem('isFirst') !== '1') {
        this.$intro().start()
        localStorage.setItem('isFirst', 1)
      }
    })
  },
}
</script>
<style lang="scss">
.introjs-helperLayer{
    box-shadow: rgba(33, 33, 33, 0.8) 0px 0px 1px 0px, rgba(33, 33, 33, 0.5) 0px 0px 0px 5000px!important;
    border: 3px dashed #409eff;
}
.new-tips{
    color: #409eff;
    line-height: 80px;
    cursor: pointer;
}
.introjs-tooltip-title{
    font-size: 16px;
    width: 80%;
    padding-top: 10px;
}
.warper {
  width: 200px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 1px solid saddlebrown;
}
/* 重置引导组件样式(类似element-ui个人使用) */
.intro-tooltip {
  color: #ffff;
  background: #2c3e50;
}
/* 引导提示框的位置 */
.introjs-bottom-left-aligned {
  left: 45% !important;
}
.introjs-right,
.introjs-left {
  top: 30%;
}
.intro-highlight {
  background: rgba(255,255,255,0.5);
}
.introjs-arrow.left {
  border-right-color: #2c3e50;
}
.introjs-arrow.top {
  border-bottom-color: #2c3e50;
}
.introjs-arrow.right {
  border-left-color: #2c3e50;
}
.introjs-arrow.bottom {
  border-top-color: #2c3e50;
}
/* 提示框头部区域 */
.introjs-tooltip-header {
  padding-right: 0 !important;
  padding-top: 0 !important;
}
.introjs-skipbutton {
  color: #409eff !important;
  font-size: 14px !important;
  font-weight: normal !important;
//   padding: 8px 10px !important ;
}
.introjs-tooltipbuttons {
  border: none !important;
}
.introjs-tooltiptext {
  font-size: 14px !important;
  padding: 15px !important;
}
/* 提示框按钮 */
.introjs-tooltipbuttons {
  display: flex;
  align-items: center;
  justify-content: center;
}
.introjs-button {
  width: 50px !important;
  text-align: center;
  padding: 4px !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  border-radius: 3px !important;
  border: none !important;
}
.introjs-button:last-child {
  margin-left: 10px;
}
.introjs-prevbutton {
  color: #606266 !important;
  background: #fff !important;
  border: 1px solid #dcdfe6 !important;
}
.introjs-nextbutton {
  color: #fff !important;
  background-color: #409eff !important;
  border-color: #409eff !important;
}
.introjs-disabled {
  color: #9e9e9e !important;
  border-color: #bdbdbd !important;
  background-color: #f4f4f4 !important;
}
</style>