/**
 * Created by Administrator on 2017/5/15.
 */
var Message = require("pft-ui-component/Message");
var readIdCard = PFT.Util.Class({

    wsUri: "ws://localhost:12301/icread/",

    init: function () {
        if(!window.WebSocket){
            alert("您的浏览器不支持读卡，请使用chrome浏览器或其它支持websocket的浏览器。");
            return false;
        }
        var _this = this;
        this.websocket = new WebSocket(_this.wsUri);
        this.websocket.onopen = function(evt) {};
        this.websocket.onclose = function(evt) {};
        this.websocket.onmessage = function(evt) {
            var data = JSON.parse(evt.data);
            var data2 = JSON.parse(data.data);
            var name = data2.Name;
            var code = data2.Code;
            _this.trigger("socketMessage" ,{name:name, code:code})
        };
        this.websocket.onerror = function(evt) {
            // Message.warning("使用读卡功能需要开启webSocket服务。")
        };
    },

    doSend: function (message) {
        if(!window.WebSocket){
            alert("您的浏览器不支持读卡，请使用chrome浏览器或其它支持websocket的浏览器。");
            return false;
        }
        //0        CONNECTING        连接尚未建立
        //1        OPEN            WebSocket的链接已经建立
        //2        CLOSING            连接正在关闭
        //3        CLOSED            连接已经关闭或不可用
        if(this.websocket.readyState == 0){
            Message.error("请先开启webSocket服务。");
            return false;
        }else if(this.websocket.readyState == 1){
            Message.success("连接已建立，请先放置身份证后点击读卡。");
        }else if(this.websocket.readyState == 2 || this.websocket.readyState == 3 ){
            Message.error("webSocket服务被关闭，读卡不可用，请重启webSocket服务。");
            return false;
        }
        this.websocket.send(message)
    }
});

// module.exports = new readIdCard();
module.exports = readIdCard;
