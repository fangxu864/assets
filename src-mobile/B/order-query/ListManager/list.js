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
    state : {
        status : "",
        isLoading : false,
        currentPage : 1,
        begin_date : "2017-04-01",
        end_date : "2017-04-20",
        date_type : 0,
        hasMore : true,
        data : []
    },
    EVENTS : {
        "click .getMoreBtn" : "onGetMoreBtnClick"
    },
    init : function(opt){
        var state = this.state;
        this.state.status = opt.status;
    },
    onGetMoreBtnClick : function(e){
        var tarBtn = $(e.currentTarget);
        var state = this.state;
        var ajaxParams = state.ajaxParams;
        tarBtn.remove();
        this.fetch({
            status : state.status,
            size : PageSize,
            page : state.currentPage+1,
            begin_date : state.begin_date,
            end_date : state.end_date,
            date_type : state.date_type
        })
    },
    fetch : function(params){
        var that = this;
        var state = this.state;
        if(state.isLoading) return false;
        var page = params.page;
        var container = this.container;
        Util.Ajax(Common.api.list,{
            type : Common.ajaxType,
            ttimeout : Common.ttimeout,
            params : params,
            loading : function(){
                if(page==1){
                    container.html(LoadingHtml);
                }else{
                    container.append(GetMoreLoadingHtml);
                }
                that.state.isLoading = true;
            },
            complete : function(){
                if(page==1){
                    container.html("");
                }else{
                    container.find(".getMore_loading").remove();
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
                    that.state.data.push(data);
                }else{
                    Alert(msg);
                }
            },
            serverError : Common.serverError
        });
    },
    refresh : function(params){
        var state = this.state;
        for(var i in params) state[i] = params;
        state.currentPage = 1;
        this.fetch({
            status : state.status,
            size : PageSize,
            page : state.currentPage,
            begin_date : state.begin_date,
            end_date : state.end_date,
            date_type : state.date_type
        });
        return this;
    },
    renderList : function(list){

        //测试
        // if(Common.getObjectKeyCount(list)==0){
        //     for(var i=0,len=10; i<len; i++) list[i] = "";
        // }
        var container = this.container;
        // var html = "";
        // Common.forEach(list,function(item,index){
        //     html += '<li style="height:100px; line-height:100px; text-align:center">'+index+'</li>';
        // },this);
        var html = ItemTemplate({data:list});
        return html;
    },
    hide : function(){

    }
});


module.exports = List;