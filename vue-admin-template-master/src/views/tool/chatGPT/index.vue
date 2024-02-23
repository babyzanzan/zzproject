<!-- chatGPT接入控件(暂时接入星火) -->
<template>
    <div style="margin-top:30px;padding-left:10px;padding-right:10px">
      <el-row :gutter="20">
        <el-col :span="16">
            <el-input
                style="margin-left:20px"
                type="textarea"
                placeholder="请输入内容"
                v-model="userInput"
                maxlength="500"
                show-word-limit
                :autosize="{ minRows: 2}"
                resize="none"
            />
        </el-col>
        <el-col :span="8">
            <el-button @click="start" type="primary" style="margin-left:10px;width:50%" :loading="loading">{{ loading? 'ai在拼命思考啦':'提问' }}</el-button>
        </el-col>
      </el-row>
      <div>
        <div v-for="chatConten in finalChat">
            <p style="color:green">我:{{ chatConten.user }}</p>
            <p style="color:red">chatGPT:{{ chatConten.ai }}</p>
        </div>
      </div>
      

      <!-- <el-input
        ref="outputText"
        style="margin-top:20px"
        type="textarea"
        :autosize="{ minRows: 5}"
        resize="none"
      /> -->
    </div>
  </template>
   
  <script>
  import CryptoJS from 'crypto-js';
   
  export default {
    data() {
      return {
        appId: '83caf91f',
        status: 'init',
        ttsWS: null,
        totalRes: '',
        userInput: '',
        aiContentRequest: '',
        finalChat: [],
        loading:false
      };
    },
    methods: {
      getWebsocketUrl() {
        return new Promise((resolve, reject) => {
          const apiKey = 'de71932a67ac3286996aa1bcbceab910';
          const apiSecret = 'ZDcxNGNhZmMwNGEzNzUzNDc1MjkxZWIx';
          const url = 'wss://spark-api.xf-yun.com/v1.1/chat';
          const host = window.location.host;
          const date = new Date().toGMTString();
          const algorithm = 'hmac-sha256';
          const headers = 'host date request-line';
          const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v1.1/chat HTTP/1.1`;
          const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
          const signature = CryptoJS.enc.Base64.stringify(signatureSha);
          const authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
          const authorization = window.btoa(authorizationOrigin);
          const finalUrl = `${url}?authorization=${authorization}&date=${date}&host=${host}`;
          //console.log(finalUrl)
          resolve(finalUrl);
        });
      },
      setStatus(status) {
        this.status = status;
      },
      connectWebSocket() {
        this.setStatus('ttsing');
        this.getWebsocketUrl().then((url) => {
          let ttsWS;
          if ('WebSocket' in window) {
            ttsWS = new WebSocket(url);
          } else if ('MozWebSocket' in window) {
            ttsWS = new MozWebSocket(url);
          } else {
            alert('浏览器不支持WebSocket');
            return;
          }
          this.ttsWS = ttsWS;
          ttsWS.onopen = (e) => {
            this.webSocketSend();
          };
          ttsWS.onmessage = (e) => {
            this.result(e.data);
          };
          ttsWS.onerror = (e) => {
            clearTimeout(this.playTimeout);
            this.setStatus('error');
            alert('WebSocket报错，请f12查看详情');
            //console.error(`详情查看：${encodeURI(url.replace('wss:', 'https:'))}`);
          };
          ttsWS.onclose = (e) => {
            //console.log(e);
          };
        });
      },
      webSocketSend() {
        let that = this
        const params = {
          header: {
            app_id: this.appId,
            uid: '18969258773',
          },
          parameter: {
            chat: {
              domain: 'general',
              temperature: 0.5,
              max_tokens: 1024,
            },
          },
          payload: {
            message: {
              text: [
                    {"role": "user", "content": that.userInput} 
                ]
            },
          },
        };
        //console.log(JSON.stringify(params));
        this.ttsWS.send(JSON.stringify(params));
      },
      start() {
        this.loading = true
        this.totalRes = '';
        this.aiContentRequest = ''
        this.connectWebSocket();
      },
      requestHandle(requestData) {//处理request
        this.aiContentRequest = this.aiContentRequest + requestData.payload.choices.text[0].content
     },
      result(resultData) {
        let jsonData = JSON.parse(resultData);
        //console.log(jsonData)

        this.totalRes += resultData;
        //this.$refs.outputText.value = this.totalRes;

        //加入到ai回答中
        if(jsonData.header.status!==2){//不为结束就进行添加
            this.requestHandle(jsonData)
        }else {
            let contentSomething = {
                ai: this.aiContentRequest,
                user: this.userInput
            }
            this.finalChat.push(contentSomething)
            this.userInput = ''
            this.loading = false
        }

        if (jsonData.header.code !== 0) {
          alert(`提问失败: ${jsonData.header.code}:${jsonData.header.message}`);
          //console.error(`${jsonData.header.code}:${jsonData.header.message}`);
          return;
        }
        if (jsonData.header.code === 0 && jsonData.header.status === 2) {
          this.ttsWS.close();
          this.setStatus('init');
        }
      },
    },
  };
  </script>