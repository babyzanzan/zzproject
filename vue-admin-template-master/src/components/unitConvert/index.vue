<!-- 单位转换控件 -->
<template>
    <div>
        <el-radio-group v-model="unitType">
            <el-radio-button label="金额转大写"></el-radio-button>
            <el-radio-button label="长度"></el-radio-button>
        </el-radio-group>
        <div style="margin: 20px;"></div>
        <el-form label-position="top">
            <el-row>
                <el-col :span="12">
                    <el-form-item :label="'请输入转换前的单位'">
                        <el-input v-model="inputUnit" clearable placeholder="请输入需要转换的单位"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            
            <el-form-item label="操作">
                <el-button type="primary" icon="el-icon-refresh" @click="toConvert">转换</el-button>
            </el-form-item>
            <el-form-item label="转换结果">
                <span style="font-size: 30px;" :style="{'color':resultError?'red':''}">{{ resultError?'请输入正确的单位':convertResult }}</span>
            </el-form-item>
            <el-form-item v-if="convertResult!==''">
                <el-button  size="mini" type="primary" icon="el-icon-search" @click="copyResult">复制转换结果</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
  name: 'unitConvert',
  data() {
    return {
        unitType: '金额转大写',
        inputUnit: '',
        convertResult:'',
        resultError: false
    }
  },
  methods:{
    toConvert(){//进行转换
        this.convertResult = '' //初始化一下转换结果
        this.resultError = false  //初始化一下是否出错
        if(this.unitType==='金额转大写'){//金额转换成大写
            let isNumber = !isNaN(Number(this.inputUnit,10)) //如果是纯数字
            if(isNumber){
                this.convertResult = this.number2bigChinese(this.inputUnit)
            }else{
                this.resultError = true
            }
        }
    },
    copyResult(){//复制转换结果
        this.$copyText(this.convertResult).then(
	      e=>{
          this.$message({
            type: 'success',
            message: '已复制转换结果'
          })
	      },
	      e=>{
	        console.log('复制失败：', e);
	      }
      )
    },
      // 阿拉伯数字转换大写
    number2bigChinese(money) {
        //汉字的数字
        let cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
        //基本单位
        let cnIntRadice = ['', '拾', '佰', '仟'];
        //对应整数部分扩展单位
        let cnIntUnits = ['', '万', '亿', '兆'];
        //对应小数部分单位
        let cnDecUnits = ['角', '分', '毫', '厘'];
        //整数金额时后面跟的字符
        let cnInteger = '整';
        //整型完以后的单位
        let cnIntLast = '圆';
        //最大处理的数字
        let maxNum = 999999999999999.9999;
        //金额整数部分
        let integerNum;
        //金额小数部分
        let decimalNum;
        //输出的中文金额字符串
        let chineseStr = '';
        //分离金额后用的数组，预定义
        let parts;
        if (money == '') {
            return '';
        }
        money = parseFloat(money);
        if (money >= maxNum) {
            //超出最大处理数字
            return '';
        }
        if (money == 0) {
            chineseStr = cnNums[0] + cnIntLast + cnInteger;
            return chineseStr;
        }
        //转换为字符串
        money = money.toString();
        if (money.indexOf('.') == -1) {
            integerNum = money;
            decimalNum = '';
        } else {
            parts = money.split('.');
            integerNum = parts[0];
            decimalNum = parts[1].substr(0, 4);
        }
        //获取整型部分转换
        if (parseInt(integerNum, 10) > 0) {
            let zeroCount = 0;
            let IntLen = integerNum.length;
            for (let i = 0; i < IntLen; i++) {
                let n = integerNum.substr(i, 1);
                let p = IntLen - i - 1;
                let q = p / 4;
                let m = p % 4;
                if (n == '0') {
                    zeroCount++;
                } else {
                    if (zeroCount > 0) {
                        chineseStr += cnNums[0];
                    }
                    //归零
                    zeroCount = 0;
                    chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                }
                if (m == 0 && zeroCount < 4) {
                    chineseStr += cnIntUnits[q];
                }
            }
            chineseStr += cnIntLast;
        }
        //小数部分
        if (decimalNum != '') {
            let decLen = decimalNum.length;
            for (let i = 0; i < decLen; i++) {
                let n = decimalNum.substr(i, 1);
                if (n != '0') {
                    chineseStr += cnNums[Number(n)] + cnDecUnits[i];
                }
            }
        }
        if (chineseStr == '') {
            chineseStr += cnNums[0] + cnIntLast + cnInteger;
        } else if (decimalNum == '') {
            chineseStr += cnInteger;
        }
        return chineseStr;
    }
  }
}
</script>