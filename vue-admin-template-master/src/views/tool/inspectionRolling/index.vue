<!-- 视察滚动 -->
<template>
    <div class="home">
        <div class="bgTest" id="bgTest" :style="{'background-position-y':positionY1+'px'}"></div>
        <p v-for="item in 10" :key="item+10">这是一个视差滚动</p>
        <div class="bgTest2" id="bgTest2" :style="{'background-position-y':positionY2+'px'}"></div>
        <p v-for="item in 10" :key="item+20">这是一个视差滚动</p>
        <div class="bgTest3" id="bgTest3" :style="{'background-position-y':positionY3+'px'}"></div>
        <p v-for="item in 10" :key="item+30">这是一个视差滚动</p>
    </div>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                positionY1: 0, //背景Y轴偏移量
                Y1: 0,
                ratio: 0.5, //视差偏移率

                positionY2: 0, //背景Y轴偏移量
                Y2: 0,

                positionY3: 0, //背景Y轴偏移量
                Y3: 0,
            }
        },
        /**
         *
         * */
        mounted() {
            window.addEventListener("scroll", this.handleScroll); //创建滚动监听，页面滚动回调handleScroll方法
                let bgTest = document.getElementById("bgTest");
                this.Y1 = bgTest.offsetTop * this.ratio

                let bgTest2 = document.getElementById("bgTest2");
                this.Y2 = bgTest2.offsetTop * this.ratio

                let bgTest3 = document.getElementById("bgTest3");
                this.Y3 = bgTest3.offsetTop * this.ratio

        },
        methods: {
            /**
             * 背景视差偏移计算
             * */
            handleScroll: function() {
                let scrollTop =
                    window.pageYOffset ||
                    document.documentElement.scrollTop ||
                    document.body.scrollTop;
                this.positionY1 = this.Y1 - scrollTop * this.ratio; //原始高度-滚动距离*视差系数
               
            }
        },
        components: {}
    };
</script>
<style>
    .bgTest {
        height: 500px;
        background: url('../../../assets/inspectRolling/1.jpg') no-repeat;
        background-attachment: fixed;
        background-size: 100% 100%;
        font-size: 20px;
    }
    .bgTest2 {
        height: 500px;
        background: url('../../../assets/inspectRolling/2.jpg') no-repeat;
        background-attachment: fixed;
        background-size: 100% 100%;
        font-size: 20px;
    }
    .bgTest3 {
        height: 500px;
        background: url('../../../assets/inspectRolling/3.jpg') no-repeat;
        background-attachment: fixed;
        background-size: 100% 100%;
        font-size: 20px;
    }
</style>