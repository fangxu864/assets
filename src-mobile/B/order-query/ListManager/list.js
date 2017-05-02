var Alert = require("COMMON/Components/Alert-Mobile/v1.0");

var Common = require("../common.js");
var PageSize = Common.pageSize;
var Util = PFT.Util;
var LoadingHtml = Common.getLoadingHtml("努力加载中..",{
    tag : "li",
    height : 400
});
var GetMoreLoadingHtml = Common.getLoadingHtml("努力加载中..",{
    tag : "li",
    className : "getMore_loading",
    height: 60,
    loadingImg : {width:20}
});
var ItemTemplate = Util.ParseTemplate(require("./item.xtpl"));
var List = Util.Class({
    status : "",
    state : {
        isLoading : false,
        currentPage : 1,
        hasMore : true,
        params : {}
    },
    EVENTS : {
        "click .getMoreBtn" : "onGetMoreBtnClick"
    },
    init : function(opt){
        var state = this.state;
        this.state.status = opt.status;
        this.status = opt.status;
    },
    onGetMoreBtnClick : function(e){
        var tarBtn = $(e.currentTarget);
        var state = this.state;
        var ajaxParams = state.ajaxParams;
        var params = this.getParams();
        var _params = {};
        for(var i in params) _params[i] = params[i];
        _params["size"] = PageSize;
        _params["page"] = state.currentPage+1;
        this.fetch(_params);
    },
    fetch : function(params){
        var that = this;
        var state = this.state;
        if(state.isLoading) return false;
        var page = params.page;
        var container = this.container;
        params["status"] = this.status;
        params["size"] = PageSize;
        Util.Ajax(Common.api.list,{
            type : Common.ajaxType,
            ttimeout : Common.ttimeout,
            params : {
                status : params.status,
                begin_date : params.begin_date,
                end_date : params.end_date,
                date_type : params.date_type,
                size : PageSize,
                page : params.page,
                token : Common.getToken()
            },
            loading : function(){
                if(page==1){
                    container.html(LoadingHtml);
                }else{
                    container.find(".getMoreBtn").remove();
                    container.append(GetMoreLoadingHtml);
                }
                that.state.isLoading = true;
            },
            complete : function(){
                if(page==1){
                    container.html("");
                }else{
                    container.find(".getMore_loading").remove();
                    // container.append('<li class="getMore_state getMoreBtn">点击查看更多</li>');
                }
                that.state.isLoading = false;
            },
            success : function(res){
                var data = res.data;
                var code = res.code;
                var msg = res.msg || PFT.AJAX_ERROR_TEXT;
                if(code==200){
                    if(Common.getObjectKeyCount(data)>0){ //如果返回的object不为空
                        var html = that.renderList(data);
                        html += '<li class="getMore_state getMoreBtn">点击查看更多</li>';
                        container.append(html);
                    }else{ //如果返回：{data:{}} 
                        var html = "";
                        if(page>1){
                            html += '<li class="getMore_state getMore_empty">没有更多了..</li>';
                        }else{
                            html += '<li class="state empty">暂无匹配条件的订单</li>';
                        }
                        container.append(html);
                        that.state.hasMore = false;
                    }
                    that.state.currentPage = page;
                }else if(code==102){
                    Common.unLogin();
                }else{
                    Alert(msg);
                }
            },
            serverError : function(xhr,errorText){
                Common.serverError(xhr,errorText);
                container.append('<li class="getMore_state getMoreBtn">点击查看更多</li>');
            }
        });
    },
    refresh : function(params){
        
        var that = this;

        //更上一次refresh时缓存下来的params更新到新的params
        this.setParams("clear");
        for(var i in params) that.state.params[i] = params[i];

        //重置页数为第1页
        this.state.currentPage = 1;
        params["page"] = 1;

        this.fetch(params);

        return this;
    },
    adaptData : function(list){
        var paymode = Common.paymode;
        Common.forEach(list,function(item,index){
            var ticket_list = item.ticket_list;
            var buy_pmode = item.buy_pmode;
            var sale_pmode = item.sale_pmode;
            var extra = item["__extra__"] || (item["__extra__"]={});
            extra["buy_pmode"] = Common.paymode[buy_pmode];
            extra["sale_pmode"] = Common.paymode[sale_pmode];
            extra["buy_money"] = item.buy_money / 100;
            extra["sale_money"] = item.sale_money / 100;
            Common.forEach(ticket_list,function(ticket,ind){
                //__extra__字段标识是前端自己加入的数据
                var extra = ticket["__extra__"] || (ticket["__extra__"]={});
                var buy_pmode = ticket.buy_pmode;
                var sale_pmode = ticket.sale_pmode;
                extra["status"] = Common.statusText[ticket.status];
            })

        });
        return list;
    },
    renderList : function(list){

        //测试
        // if(Common.getObjectKeyCount(list)==0){
        //     for(var i=0,len=10; i<len; i++) list[i] = "";
        // }
        var container = this.container;
        list = this.adaptData(list);
        // var html = "";
        // Common.forEach(list,function(item,index){
        //     html += '<li style="height:100px; line-height:100px; text-align:center">'+index+'</li>';
        // },this);
        var html = ItemTemplate({data:list});
        return html;
    },
    hide : function(){

    },
    getParams : function(){
        return this.state.params;
    },
    setParams : function(prop,val){
        if(prop=="clear") return this.state.params = {};
        this.state.params[prop] = val;
    }
});


module.exports = List;