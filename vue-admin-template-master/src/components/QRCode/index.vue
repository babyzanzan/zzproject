<template>
    <div>
        <el-input v-model="QRCodeInfo" placeholder="请输入二维码内容"></el-input>
        <el-button type="primary" @click="showQRCode">生成二维码</el-button>
        <div id="qrCode" ref="qrCodeDiv"></div>
    </div>
</template>
<script>
import QRCode from 'qrcodejs2'
export default {
    name:'QRCode',
    data() {
        return {
            QRCodeInfo: '',
        }
    },
    methods:{
        createdQRCode(){
            this.$nextTick(()=>{
                this.$refs.qrCodeDiv.innerHTML = '';//二维码初始化
                new QRCode(this.$refs.qrCodeDiv, {
                    text: this.QRCodeInfo,//二维码链接，参数是否添加看需求
                    width: 200,//二维码宽度
                    height: 200,//二维码高度
                    colorDark: "#333333", //二维码颜色
                    colorLight: "#ffffff", //二维码背景色
                    correctLevel: QRCode.CorrectLevel.L //容错率，L/M/H
                });
            })
        },
        showQRCode(){
            this.createdQRCode()
        },
    }
}
</script>