<template>
    <div class="loan-work-queue">
        <div class="super-flow-demo1">
            <div class="node-container">
              <span
                  class="node-item"
                  v-for="(item, index) in nodeItemList"
                  :key="index"
                  @mousedown="evt => nodeItemMouseDown(evt, item.value)">
                {{ item.label }}
              </span>
              <el-button @click="styleDialog=true" style="margin-top: 50px;" type="">自定义链接样式</el-button>
              <el-button
                @click="saveFlow"
                type="primary"
                class="saveIcon">
                保存为图片
              </el-button>
            </div>
            <div
              class="flow-container"
              ref="flowContainer"
              @click="flowNodeClick">
              <super-flow
                @toJSON="toJSON"
                ref="superFlow"
                :graph-menu="graphMenu"
                :node-menu="nodeMenu"
                :link-menu="linkMenu"
                :link-base-style="linkBaseStyle"
                :link-style="linkStyle"
                :link-desc="linkDesc"
                :node-list="nodeList"
                :link-list="linkList">
                <template v-slot:node="{meta}">
                  <div
                    @mouseup="nodeMouseUp"
                    @click="nodeClick"
                    :class="meta.type? `flow-node-${meta.type}`: ''"
                    class="flow-node ellipsis">
                    <div class="node-content" :title="meta.name">{{ meta.name }}</div>
                  </div>
                </template>
              </super-flow>
            </div>
          </div>
          <el-dialog :visible.sync="styleDialog" title="链接样式自定义">
                <el-form
                    class="link-base-style-form"
                    ref="linkBaseStyle"
                    label-width="100px"
                    @submit.native.prevent
                    :model="linkBaseStyle">
                    <el-form-item label="背景颜色">
                        <el-color-picker
                            v-model="linkBaseStyle.color">
                        </el-color-picker>
                    </el-form-item>
                    <el-form-item label="悬浮颜色">
                        <el-color-picker
                            v-model="linkBaseStyle.hover">
                        </el-color-picker>
                    </el-form-item>
                    <el-form-item label="文字颜色">
                        <el-color-picker
                        v-model="linkBaseStyle.textColor">
                        </el-color-picker>
                    </el-form-item>
                    <el-form-item label="悬浮文字颜色">
                        <el-color-picker
                        v-model="linkBaseStyle.textHover">
                        </el-color-picker>
                    </el-form-item>
                    <el-form-item label="字体大小">
                        <el-select
                            size="medium"
                            v-model="linkBaseStyle.font">
                            <el-option
                                v-for="item in fontList"
                                :key="item"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="背景色">
                        <el-color-picker
                        v-model="linkBaseStyle.background">
                        </el-color-picker>
                    </el-form-item>
                    <el-form-item label="虚线">
                        <el-switch
                            v-model="linkBaseStyle.dotted"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="线条短划线">
                        <el-select
                            size="medium"
                            style="width: 80px"
                            v-model="linkBaseStyle.lineDash[0]">
                            <el-option
                                v-for="item in [1,2,3,4,5,6,7,8]"
                                :key="item"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                        <el-select
                            size="medium"
                            style="width: 80px"
                            v-model="linkBaseStyle.lineDash[1]">
                            <el-option
                                v-for="item in [1,2,3,4,5,6,7,8]"
                                :key="item"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog
                :title="drawerConf.title"
                :visible.sync="drawerConf.visible"
                :close-on-click-modal="false"
                width="500px">
                <el-form
                  @keyup.native.enter="settingSubmit"
                  @submit.native.prevent
                  v-show="drawerConf.type === drawerType.node"
                  ref="nodeSetting"
                  :model="nodeSetting">
                  <el-form-item
                    label="节点名称"
                    prop="name">
                    <el-input
                        v-model="nodeSetting.name"
                        placeholder="请输入节点名称"
                        maxlength="30">
                    </el-input>
                  </el-form-item>
                  <el-form-item
                    label="节点描述"
                    prop="desc">
                    <el-input
                      v-model="nodeSetting.desc"
                      placeholder="请输入一个节点描述"
                      maxlength="30">
                    </el-input>
                  </el-form-item>
                </el-form>
                <el-form
                    @keyup.native.enter="settingSubmit"
                    @submit.native.prevent
                    v-show="drawerConf.type === drawerType.link"
                    ref="linkSetting"
                    :model="linkSetting">
                    <el-form-item
                        label="链接描述"
                        prop="desc">
                        <el-input
                            v-model="linkSetting.desc"
                            placeholder="请输入一个链接描述">
                        </el-input>
                    </el-form-item>
                </el-form>
                <span
                    slot="footer"
                    class="dialog-footer">
                    <el-button
                        @click="drawerConf.cancel">
                        取消
                    </el-button>
                    <el-button
                        type="primary"
                        @click="settingSubmit">
                        确定
                    </el-button>
                </span>
            </el-dialog>
    </div>
</template>
<script>
import SuperFlow from 'vue-super-flow'
import 'vue-super-flow/lib/index.css' 
import html2canvas from 'html2canvas'
const drawerType = {
    node: 0,
    link: 1
} 
export default {
    components: {
      SuperFlow
    },
    data () {
      return {
        styleDialog: false,
        nodeList: [
          {
            id: 1,
            coordinate: [400, 120],
            width: 120,
            height: 40,
            meta: {
              label: '开始',
              name: '开始',
              type: 'start'
            }
          },
          {
            id: 2,
            coordinate: [360, 235],
            width: 200,
            height: 40,
            meta: {
              label: '过程',
              name: '过程',
              type: 'process'
            }
          },
          {
            id: 3,
            coordinate: [400, 360],
            width: 120,
            height: 40,
            meta: {
              label: '结束',
              name: '结束',
              type: 'end'
            }
          }
        ],
        linkList: [
          {
            id: 4,
            startAt: [60, 40],
            startId: 1,
            endAt: [100, 0],
            endId: 2,
            meta: null
          },
          {
            id: 5,
            startAt: [100, 40],
            startId: 2,
            endAt: [60, 0],
            endId: 3,
            meta: null
          }
        ],
        drawerType,
        drawerConf: {
          title: '',
          visible: false,
          type: null,
          info: null,
          open: (type, info) => {
            const conf = this.drawerConf
            conf.visible = true
            conf.type = type
            conf.info = info
            if (conf.type === drawerType.node) {
              conf.title = '节点'
              if (this.$refs.nodeSetting) this.$refs.nodeSetting.resetFields()
              this.$set(this.nodeSetting, 'name', info.meta.name)
              this.$set(this.nodeSetting, 'desc', info.meta.desc)
            } else {
              conf.title = '链接'
              if (this.$refs.linkSetting) this.$refs.linkSetting.resetFields()
              this.$set(this.linkSetting, 'desc', info.meta ? info.meta.desc : '')
            }
          },
          cancel: () => {
            this.drawerConf.visible = false
            if (this.drawerConf.type === drawerType.node) {
              this.$refs.nodeSetting.clearValidate()
            } else {
              this.$refs.linkSetting.clearValidate()
            }
          }
        },
        linkSetting: {
          desc: ''
        },
        nodeSetting: {
          name: '',
          desc: ''
        },
  
        dragConf: {
          isDown: false,
          isMove: false,
          offsetTop: 0,
          offsetLeft: 0,
          clientX: 0,
          clientY: 0,
          ele: null,
          info: null
        },
        nodeItemList: [
          {
            label: '开始',
            value: () => ({
              width: 120,
              height: 40,
              meta: {
                label: '开始',
                name: '开始',
                type: 'start'
              }
            })
          },
          {
            label: '过程',
            value: () => ({
              width: 200,
              height: 40,
              meta: {
                label: '过程',
                name: '过程',
                type: 'process'
              }
            })
          },
          {
            label: '条件',
            value: () => ({
              width: 168,
              height: 168,
              meta: {
                label: '条件',
                name: '条件',
                type: 'if'
              }
            })
          },
          {
            label: '结束',
            value: () => ({
              width: 120,
              height: 40,
              meta: {
                label: '结束',
                name: '结束',
                type: 'end'
              }
            })
          }
        ],
        graphMenu: [
          [
            {
              // 选项 label
              label: '开始',
              // 选项是否禁用
              disable (graph) {
                return !!graph.nodeList.find(node => node.meta.label === '1')
              },
              // 选项选中后回调函数
              selected (graph, coordinate) {
                graph.addNode({
                  width: 120,
                  height: 40,
                  coordinate,
                  meta: {
                    label: '开始',
                    name: '开始',
                    type: 'start'
                  }
                })
              }
            },
            {
              label: '过程',
              selected (graph, coordinate) {
                graph.addNode({
                  width: 200,
                  height: 40,
                  coordinate,
                  meta: {
                    label: '过程',
                    name: '过程',
                    type: 'process'
                  }
                })
              }
            },
            {
              label: '条件',
              selected (graph, coordinate) {
                graph.addNode({
                  width: 168,
                  height: 168,
                  coordinate,
                  meta: {
                    label: '条件',
                    name: '条件',
                    type: 'if'
                  }
                })
              }
            }
          ],
          [
            {
              label: '结束',
              selected (graph, coordinate) {
                graph.addNode({
                  width: 120,
                  height: 40,
                  coordinate,
                  meta: {
                    label: '结束',
                    name: '结束',
                    type: 'end'
                  }
                })
              }
            }
          ],
          [
            {
              label: '选择所有',
              selected: graph => {
                graph.selectAll()
              }
            }
          ]
        ],
        nodeMenu: [
          [
            {
              label: '删除',
              selected: node => {
                node.remove()
              }
            },
            {
              label: '编辑',
              selected: node => {
                this.drawerConf.open(drawerType.node, node)
              }
            }
          ]
        ],
        linkMenu: [
          [
            {
              label: '删除',
              selected: link => {
                link.remove()
              }
            },
            {
              label: '编辑',
              selected: link => {
                this.drawerConf.open(drawerType.link, link)
              }
            }
          ]
        ],
  
        linkBaseStyle: {
          color: '#666666', // line 颜色
          hover: '#FF0000', // line hover 的颜色
          textColor: '#666666', // line 描述文字颜色
          textHover: '#FF0000', // line 描述文字 hover 颜色
          font: '14px Arial', // line 描述文字 字体设置 参考 canvas font
          dotted: false, // 是否是虚线
          lineDash: [4, 4], // 虚线时生效，虚线长度和间隔长度
          background: 'rgba(255,255,255,0.6)' // 描述文字背景色
        },
        fontList: [
          '14px Arial',
          'italic small-caps bold 12px arial'
        ]
      }
    },
    mounted () {
      document.addEventListener('mousemove', this.docMousemove)
      document.addEventListener('mouseup', this.docMouseup)
      this.$once('hook:beforeDestroy', () => {
        document.removeEventListener('mousemove', this.docMousemove)
        document.removeEventListener('mouseup', this.docMouseup)
      })
    },
    methods: {
      flowNodeClick () {
        // console.log(this.$refs.superFlow.graph)
        // const data = this.$refs.superFlow.toJSON()
        // console.log(data)
      },
      toJSON (data) {
        // console.log(data)
      },
      saveFlow () {
        this.nodeList = this.$refs.superFlow.toJSON().nodeList
        this.linkList = this.$refs.superFlow.toJSON().linkList
        console.log(this.nodeList)
        console.log(this.linkList)
        // 手动创建一个 canvas 标签
        const canvas = document.createElement('canvas')
        // 获取父标签，意思是这个标签内的 DOM 元素生成图片
        // superFlow是给截图范围内的父级元素自定义的ref名称
        let canvasBox = this.$refs.flowContainer
        // 获取父级的宽高
        const width = parseInt(window.getComputedStyle(canvasBox).width)
        const height = parseInt(window.getComputedStyle(canvasBox).height)
        // 宽高 * 2 并放大 2 倍 是为了防止图片模糊
        canvas.width = width * 2
        canvas.height = height * 2
        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'
        const context = canvas.getContext('2d')
        context.scale(2, 2)
        const options = {
          backgroundColor: '#FFFFFF',//默认null是背景色透明，现在将他设定为白色背景色
          canvas: canvas,
          useCORS: true
        }
        html2canvas(canvasBox, options).then((canvas) => {
        // toDataURL 图片格式转成 base64
          let dataURL = canvas.toDataURL('image/png')
          //console.log(dataURL)
          this.downloadImage(dataURL)
        })
      },
      // 下载图片
      downloadImage (url) {
        // 如果是在网页中可以直接创建一个 a 标签直接下载
        let a = document.createElement('a')
        a.href = url
        a.download = '工作流图'
        a.click()
      },
      linkStyle (link) {
        if (link.meta && link.meta.desc === '1') {
          return {
            color: 'red',
            hover: '#FF00FF',
            dotted: true
          }
        } else {
          return {}
        }
      },
      linkDesc (link) {
        return link.meta ? link.meta.desc : ''
      },
      settingSubmit () {
        const conf = this.drawerConf
        if (this.drawerConf.type === drawerType.node) {
          if (!conf.info.meta) conf.info.meta = {}
          Object.keys(this.nodeSetting).forEach(key => {
            this.$set(conf.info.meta, key, this.nodeSetting[key])
          })
          this.$refs.nodeSetting.resetFields()
        } else {
          if (!conf.info.meta) conf.info.meta = {}
          Object.keys(this.linkSetting).forEach(key => {
            this.$set(conf.info.meta, key, this.linkSetting[key])
          })
          this.$refs.linkSetting.resetFields()
        }
        conf.visible = false
      },
      nodeMouseUp (evt) {
        evt.preventDefault()
      },
      nodeClick () {
        // console.log(arguments)
      },
      docMousemove ({ clientX, clientY }) {
        const conf = this.dragConf
        if (conf.isMove) {
          conf.ele.style.top = clientY - conf.offsetTop + 'px'
          conf.ele.style.left = clientX - conf.offsetLeft + 'px'
        } else if (conf.isDown) {
          // 鼠标移动量大于 5 时 移动状态生效
          conf.isMove = Math.abs(clientX - conf.clientX) > 5 || Math.abs(clientY - conf.clientY) > 5
        }
      },
      docMouseup ({ clientX, clientY }) {
        const conf = this.dragConf
        conf.isDown = false
  
        if (conf.isMove) {
          const {
            top,
            right,
            bottom,
            left
          } = this.$refs.flowContainer.getBoundingClientRect()
  
          // 判断鼠标是否进入 flow container
          if (
            clientX > left && clientX < right && clientY > top && clientY < bottom
          ) {
            // 获取拖动元素左上角相对 super flow 区域原点坐标
            const coordinate = this.$refs.superFlow.getMouseCoordinate(
              clientX - conf.offsetLeft,
              clientY - conf.offsetTop
            )
            // 添加节点
            this.$refs.superFlow.addNode({
              coordinate,
              ...conf.info
            })
          }
          conf.isMove = false
        }
        if (conf.ele) {
          conf.ele.remove()
          conf.ele = null
        }
      },
      nodeItemMouseDown (evt, infoFun) {
        const {
          clientX,
          clientY,
          currentTarget
        } = evt
  
        const {
          top,
          left
        } = evt.currentTarget.getBoundingClientRect()
  
        const conf = this.dragConf
        const ele = currentTarget.cloneNode(true)
  
        Object.assign(this.dragConf, {
          offsetLeft: clientX - left,
          offsetTop: clientY - top,
          clientX: clientX,
          clientY: clientY,
          info: infoFun(),
          ele,
          isDown: true
        })
  
        ele.style.position = 'fixed'
        ele.style.margin = '0'
        ele.style.top = clientY - conf.offsetTop + 'px'
        ele.style.left = clientX - conf.offsetLeft + 'px'
  
        this.$el.appendChild(this.dragConf.ele)
      }
    }
}
</script>
<style lang="scss" scoped>
.loan-work-queue {
    width: 100%;
    height: calc(100vh - 166px);
    box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
    margin: 10px;
    padding: 20px;
    background: #fff;
    overflow: hidden;
}
.style-title {
    margin-bottom: 20px;
}
  
.ellipsis {
    white-space   : nowrap;
    text-overflow : ellipsis;
    overflow      : hidden;
    word-wrap     : break-word;
}
.link-base-style-form {
    .el-form-item {
      margin-bottom : 12px;
    }
    padding-top : 30px;
    // border-bottom  : 1px solid #DCDCDC;
}
.super-flow-demo1 {
    margin-top       : 20px;
    width            : 100%;
    height           : 732px;
    background-color : #f5f5f5;
  
    > .node-container {
      width            : 200px;
      float            : left;
      height           : 100%;
      text-align       : center;
      background-color : #FFFFFF;
    }
    > .flow-container {
      width    : calc(100% - 200px);
      float    : left;
      height   : 100%;
      overflow : hidden;
      position: relative;
    }
    .saveIcon {
      margin-top: 30px;
    }
    .super-flow__node {
      .flow-node {
        box-sizing  : border-box;
        width       : 100%;
        height      : 100%;
        line-height : 40px;
        padding     : 0 6px;
        font-size   : 16px;
        color: #fff;
        font-weight: bold;
        .node-content {
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding-left: 3%;
        }
      }
    }
    /*开始节点样式*/
    .ellipsis.flow-node-start {
      // background: #55ABFC;
      background: #6bc76a;
      border-radius: 10px;
      border: 1px solid #b4b4b4;
    }
    /*流程节点样式*/
    .ellipsis.flow-node-process {
      position: relative;
      // background: #30B95C;
      background: #b6c6e7;
      border: 1px solid #b4b4b4;
    }
    /*条件节点样式*/
    .ellipsis.flow-node-if {
      width: 120px;
      height: 120px;
      position: relative;
      top: 24px;
      left: 24px;
      // background: #BC1D16;
      background: #b6e3e7;
      border: 1px solid #b4b4b4;
      transform: rotateZ(45deg); //倾斜
      .node-content {
        position: absolute;
        top: 50%;
        left: 20px;
        width: 100%;
        transform: rotateZ(-45deg) translateY(-75%);
      }
    }
    /*结束节点样式*/
    .ellipsis.flow-node-end {
      // background: #000;
      background: #299999;
      border-radius: 10px;
      border: 1px solid #b4b4b4;
    }
}
.node-item {
    font-size         : 14px;
    display           : inline-block;
    height            : 30px;
    width             : 120px;
    margin-top        : 20px;
    background-color  : #FFFFFF;
    line-height       : 30px;
    box-shadow        : 1px 1px 4px rgba(0, 0, 0, 0.3);
    cursor            : pointer;
    user-select       : none;
    text-align        : center;
    z-index           : 6;
    &:hover {
      box-shadow : 1px 1px 8px rgba(0, 0, 0, 0.4);
    }
}
</style>
<style>
.link-base-style-form .el-form-item__label {
    text-align: left;
    margin-left: 20px;
}
.link-base-style-form {
    border: none;
}
.super-flow-demo1 .super-flow__node {
    border: none;
    background: none;
    box-shadow: none;
}
</style>
  