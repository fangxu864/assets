require("./index.scss");
var Util = PFT.Util;

var Message = require("pft-ui-component/Message");
var AJAX_TIMEOUT_TEXT = PFT.AJAX_TIMEOUT_TEXT;
var AJAX_ERROR_TEXT = PFT.AJAX_ERROR_TEXT;

var Common = require("../common.js");
var LoadingHtml = function(type){
    return Util.LoadingPc("努力加载中..",{
        height : type=="refresh" ? 600 : 80,
        className : type=="refresh" ? "refreshLoadingState" : "getMoreLoadingState", 
        tag : "tr",
        colspan : 7
    });
};

var ListTemplate = Util.ParseTemplate(require("./index.xtpl"));


var ListManager = Util.Class({
    container : "#listTbody",
    state : {
        params : {},
        hasMore : false,
        isLoading : false
    },
    init : function(){
        
    },
    setParams : function(params){
        var that = this;
        this.state.params = {};
        for(var i in params) that.state.params[i] = params[i];
    },
    refresh : function(params){
        var that = this;
        var container = this.container;
        var state = this.state;

        //如果当前正在loading 则新请求不执行，需要等上一次加载完
        if(state.isLoading) return false;

        //重置参数以缓存
        state.hasMore = true;
        this.setParams(params);

        Util.Ajax(Common.url.msgList,{
            type : "POST",
            params : params,
            loading : function(){
                container.html(LoadingHtml("refresh"));
                state.isLoading = true;
                that.trigger("loading","refresh");
            },
            complete : function(){
                container.html("");
                state.isLoading = false;
                that.trigger("complete","refresh");
            },
            success : function(res){
                var code = res.code;
                var msg = res.msg || AJAX_ERROR_TEXT;
                var data = res.data;
                var list = data.list;
                var nowId = data.now_id;
                var html = "";
                if(code==200){
                    html = that.renderList(list);
                    container.html(html);
                    state.params.now_id = nowId;
                    if(list.length<state.params.size) that.state.hasMore = false;
                }else{
                    Message.alert(msg);
                }
            },
            timeout : function(){
                Message.alert(AJAX_TIMEOUT_TEXT);
            },
            serverError : function(){
                Message.alert(AJAX_TIMEOUT_TEXT);
            }
        })
    },
    getMore : function(){
        var that = this;
        var container = this.container;
        var state = this.state;
        
        if(state.isLoading) return false;
        if(!state.hasMore) return false;

        Util.Ajax(Common.url.msgList,{
            type : "POST",
            params : state.params,
            loading : function(){
                container.append(LoadingHtml("getMore"));
                state.isLoading = true;
                that.trigger("loading","getMore");
            },
            complete : function(){
                state.isLoading = false;
                that.trigger("complete","getMore");
            },
            success : function(res){
                var code = res.code;
                var msg = res.msg || AJAX_ERROR_TEXT;
                var data = res.data;
                var list = data.list;
                var nowId = data.now_id;
                var html = "";
                if(code==200){
                    html = that.renderList(list);
                    container.append(html);
                    container.find(".getMoreLoadingState").remove();
                    state.params.now_id = nowId;
                    if(list.length<state.params.size){
                        that.state.hasMore = false;
                    }

                }else{
                    Message.alert(msg);
                }
            },
            timeout : function(){
                Message.alert(AJAX_TIMEOUT_TEXT);
            },
            serverError : function(){
                Message.alert(AJAX_TIMEOUT_TEXT);
            }
        })
    },
    adaptData : function(data){
        var MsgType = Common.msgType;
        for(var i=0,len=data.length; i<len; i++){
            (function(){
                var item = data[i];
                var msg_type = item.msg_type;
                item["msg_type"] = Common.getMsgType(msg_type);
                item["channel"] = Common.getChannelText(item.channel);
                item["send_type"] = Common.sendType[item.send_type];
                item["action"] = Common.getActionByStatus(item.status);
                item["status"] = Common.getStatusText(item.status);
            })(i);
        }
        return data;
    },
    renderList : function(data){
        var html = "";
        var params = this.state.params;
        var nowId = params.now_id;
        var emptyText = "";
        var size = params.size;
        var cls = "state empty";
        if(Util.isArray(data)){
            if(data.length){
                data = this.adaptData(data);
                html = ListTemplate({list:data});
                if(data.length<size){
                    cls += " getMore";
                    html += '<tr class="stateLine '+cls+'"><td colspan="7">没有更多了..</td></tr>';
                }
            }else{ //空
                if(!nowId){ //refresh时
                    emptyText = "查无匹配条件的消息..";
                    cls += " refresh";
                }else{
                    emptyText = "没有更多了.."
                    cls += " getMore";
                }
                html += '<tr class="stateLine '+cls+'"><td colspan="7">'+emptyText+'</td></tr>';
            }
        }
        return html;
    }
});

module.exports = ListManager;