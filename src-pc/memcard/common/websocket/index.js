/**
 * Created by Administrator on 2017/5/15.
 */
var webSocket = PFT.Util.Class({

    wsUri: "ws://localhost:12301/icread/",

    init: function () {
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
            console.log(evt);
        };
    },

    doSend: function (message) {
        console.log(message);
        this.websocket.send(message)
    }
});

module.exports = webSocket;
