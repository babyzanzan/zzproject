<!-- 这是交流页面小窗模式的控件 -->
<template>
    <div class="wrap" v-drag>
      <div class="title">
        <div>
          <van-icon
            name="arrow-left"
            size="20"
            style="margin-left: 10px"
            @click="onClickLeft"
          />
        </div>
        <div >{{ userName }}</div>
        <div>
          <van-icon
            name="ellipsis"
            size="22"
            style="margin-right: 10px"
            @click="onClickRight"
          />
        </div>
      </div>
      <div class="content_box" id="box" ref="scrollBox">
        <div class="timer">2022-08-02 11:08:07</div>
        <div
          :class="item.position == 'left' ?  'userbox2' : 'userbox'"
          v-for="(item, index) in chatList"
          :key="index"
        >
          <div :class="item.position == 'left' ? 'nameInfo2' : 'nameInfo'">
            <div style="font-size: 14px">{{ item.username }}</div>
            <div
              :class="item.position == 'left' ? 'contentText2' : 'contentText'"
            >
              {{ item.content }}
            </div>
          </div>
          <div>
            <van-image round width="50px" height="50px" :src="item.url" />
          </div>
        </div>
      </div>
      <div class="bottom">
        <van-field
          v-model="inputValue"
          center
          type="textarea"
          :autosize="{ maxHeight: 100, minHeight: 25 }"
          placeholder="请输入内容"
          rows="1"
        >
          <template #button>
            <van-button size="small" type="primary" @click="sendOut">发送</van-button>
          </template>
        </van-field>
      </div>
    </div>
</template>
<script>
export default {
    name:'chatRoomHover',
    data() {
      return {
        //聊天数据
        chatList: [
          {
            url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
            username: "张三",
            content: "模拟数据123模拟数据123模拟数据123模拟数据123",
            position: "left",
          },
          {
            url: "https://img01.yzcdn.cn/vant/cat.jpeg",
            username: "李四",
            content: "模拟数据123模拟数据123模拟数据123模拟数据123模拟数据123",
            position: "right",
          },
          {
            url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
            username: "张三",
            content: "模拟数据123",
            position: "left",
          },
          {
            url: "https://img01.yzcdn.cn/vant/cat.jpeg",
            username: "李四",
            content: "模拟数据123模拟数据",
            position: "right",
          },
          {
            url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
            username: "张三",
            content: "模拟数据123",
            position: "left",
          },
          {
            url: "https://img01.yzcdn.cn/vant/cat.jpeg",
            username: "李四",
            content: "模拟数据123模拟数据",
            position: "right",
          },
          {
            url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
            username: "张三",
            content: "模拟数据123",
            position: "left",
          },
          {
            url: "https://img01.yzcdn.cn/vant/cat.jpeg",
            username: "李四",
            content: "模拟数据123模拟数据",
            position: "right",
          },
          {
            url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
            username: "张三",
            content: "模拟数据123",
            position: "left",
          },
          {
            url: "https://img01.yzcdn.cn/vant/cat.jpeg",
            username: "李四",
            content: "模拟数据123模拟数据",
            position: "right",
          },
          {
            url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
            username: "张三",
            content: "模拟数据123",
            position: "left",
          },
          {
            url: "https://img01.yzcdn.cn/vant/cat.jpeg",
            username: "李四",
            content: "模拟数据123模拟数据",
            position: "right",
          },
          {
            url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
            username: "张三",
            content: "模拟数据123",
            position: "left",
          },
          {
            url: "https://img01.yzcdn.cn/vant/cat.jpeg",
            username: "李四",
            content: "模拟数据123模拟数据",
            position: "right",
          },
        ],
        //用户名
        userName: "张三",
        //输入内容
        inputValue: "",
        //滚动条距离顶部距离
        scrollTop:0
      };
    },
    // 自定义指令 —— 拖动div
    directives: {
        drag(el) {
            let oDiv = el // 当前元素
            // let self = this // 上下文
            // 禁止选择网页上的文字
            document.onselectstart = function () {
                return false
            }
            oDiv.onmousedown = function (e) {
                // 鼠标按下，计算当前元素距离可视区的距离
                let disX = e.clientX - oDiv.offsetLeft
                let disY = e.clientY - oDiv.offsetTop
                document.onmousemove = function (e) {
                    // 通过事件委托，计算移动的距离
                    let l = e.clientX - disX
                    let t = e.clientY - disY
                    // 移动当前元素
                    oDiv.style.left = l + 'px'
                    oDiv.style.top = t + 'px'
                }
                document.onmouseup = function (e) {
                    document.onmousemove = null
                    document.onmouseup = null
                }
                // return false不加的话可能导致黏连，就是拖到一个地方时div粘在鼠标上不下来，相当于onmouseup失效
                return false
            }
        }
    },
    mounted(){
      this.setPageScrollTo()
      //创建监听内容部分滚动条滚动
      this.$refs.scrollBox.addEventListener('scroll',this.srTop)
    },
    methods: {
      //返回
      onClickLeft() {
        console.log("返回");
        this.$router.push({path:'/toChat/chatRoom'})
      },
      //更多
      onClickRight() {
        console.log("按钮");
        this.$store.commit('settings/changeShowChatHover',{showChatHover:false})
      },
      //滚动条默认滚动到最底部
      setPageScrollTo(s, c) {
        //获取中间内容盒子的可见区域高度
        this.scrollTop = document.querySelector("#box").offsetHeight;
        setTimeout((res) => {
          //加个定时器，防止上面高度没获取到，再获取一遍。
          if (this.scrollTop != this.$refs.scrollBox.offsetHeight) {
            this.scrollTop = document.querySelector("#box").offsetHeight;
          }
        }, 100);
        //scrollTop：滚动条距离顶部的距离。
        //把上面获取到的高度座位距离，把滚动条顶到最底部
        this.$refs.scrollBox.scrollTop = this.scrollTop;
      },
      //滚动条到达顶部
      srTop(){
        //判断：当滚动条距离顶部为0时代表滚动到顶部了
        if(this.$refs.scrollBox.scrollTop==0){
          //逻辑简介：
          //到顶部后请求后端的方法，获取第二页的聊天记录，然后插入到现在的聊天数据前面。
          //如何插入前面：可以先把获取的数据保存在 A 变量内，然后 this.chatList=A.concat(this.chatList)把数组合并进来就可以了
  
          //拿聊天记录逻辑:
          //第一次调用一个请求拉历史聊天记录，发请求时参数带上页数 1 传过去，拿到的就是第一页的聊天记录，比如一次拿20条。你显示出来
          //然后向上滚动到顶部时，触发新的请求，在请求中把分页数先 +1 然后再请求，这就拿到了第二页数据，然后通过concat合并数组插入进前面，依次类推，功能完成！
          console.log('到顶了，滚动条位置 :',this.$refs.scrollBox.scrollTop);
        }
      },
      sendOut(){
        console.log('发送成功');
      }
  },
};
</script>
<style scoped>
.wrap {
    border-radius: 10px;
    height: 600px;
    width: 350px;
    position: fixed;
    z-index: 9999;
    right: 10px;
    top: 120px;
    box-shadow: 10px 10px 10px rgba(0,0,0,.5);
    /*考虑浏览器兼容性*/
    -moz-box-shadow: 10px 10px 10px rgba(0,0,0,.5);
    -webkit-box-shadow: 10px 10px 10px rgba(0,0,0,.5);
    background-color: white;
}
.title {
    height: 40px;
    width: 100%;
    background-color: #eaeaea;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.bottom {
    min-height: 50px;
    width: 100%;
    border-top: 1px solid #eaeaea;
}
.content_box {
    /* 
    中间栏计算高度，110是包含了上下固定的两个元素高度90
    这里padding：10px造成的上下够加了10，把盒子撑大了，所以一共是20要减掉
    然后不知道是边框还是组件的原因，导致多出了一些，这里再减去5px刚好。不然会出现滚动条到顶或者底部的时候再滚动的话就会报一个错，或者出现滚动条变长一下的bug
    */
    height: calc(100% - 115px);
    overflow: auto;
    padding: 10px;
    background-color: white;
}
.timer {
    text-align: center;
    color: #c2c2c2;
}
  
  /* 发送的信息样式 */
  /* 
  右边消息思路解释：首先大盒子userbox内放两个盒子，一个放头像，一个放用户名和发送的内容，我们先用flex让他横向排列。
  然后把写文字的大盒子设置flex：1。这个属性的意思就是让这个元素撑满父盒子剩余位置。然后我们再把文字盒子设置flex，并把他对齐方式设置为尾部对齐就完成了基本的结构，然后微调一下就可以了
  */
.userbox {
    width: 100%;
    display: flex;
    margin-bottom: 10px;
}
.nameInfo {
    /* 用flex：1把盒子撑开 */
    flex: 1;
    margin-right: 10px;
    /* 用align-items把元素靠右对齐 */
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}
.contentText {
    background-color: #9eea6a;
    /* 把内容部分改为行内块元素，因为盒子flex：1把盒子撑大了，所以用行内块元素让内容宽度不根据父盒子来 */
    display: inline-block;
    /* 这四句是圆角 */
    border-top-left-radius: 10px;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    /* 最大宽度限定内容输入到百分61换行 */
    max-width: 61%;
    padding: 5px 10px;
    /* 忽略多余的空白，只保留一个空白 */
    white-space: normal;
    /* 换行显示全部字符 */
    word-break: break-all;
    margin-top: 3px;
    font-size: 14px;
}
  
  /* 接收的信息样式 */
  /* 
  左边消息思路解释：跟上面一样，就是换一下位置，首先通过把最外层大盒子的排列方式通过flex-direction: row-reverse;属性翻转，也就是头像和文字盒子换位置
  然后删除掉尾部对齐方式，因为不写这个默认是左对齐的。我们写的左边就没必要再写了。
  */
.userbox2 {
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    margin-bottom: 10px;
}
.nameInfo2 {
    /* 用flex：1把盒子撑开 */
    flex: 1;
    margin-left: 10px;
}
.contentText2 {
    background-color: #9eea6a;
    /* 把内容部分改为行内块元素，因为盒子flex：1把盒子撑大了，所以用行内块元素让内容宽度不根据父盒子来 */
    display: inline-block;
    /* 这四句是圆角 */
    border-top-left-radius: 0px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    /* 最大宽度限定内容输入到百分61换行 */
    max-width: 61%;
    padding: 5px 10px;
    /* 忽略多余的空白，只保留一个空白 */
    white-space: normal;
    /* 换行显示全部字符 */
    word-break: break-all;
    margin-top: 3px;
    font-size: 14px;
}
</style>
  