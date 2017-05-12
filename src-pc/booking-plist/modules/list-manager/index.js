var AJAX_ERROR_TEXT = PFT.AJAX_ERROR_TEXT;
var AJAX_TIMEOUT_TEXT = PFT.AJAX_TIMEOUT_TEXT;

var Util = PFT.Util;
var isEmptyObject = Util.isEmptyObject;
var isArray = Util.isArray;
var isObject = Util.isObject;

var Common = require("../../common.js");
var Tpl = require("./index.xtpl");
var LoadingHtml = PFT.Util.LoadingPc("努力加载中...",{
    tag : "li",
    height : 600,
    css : {"background-color" : "#fff"}
})
var LoadingHtml_More = PFT.Util.LoadingPc("努力加载中...",{
    tag : "li",
    height : 50,
    css : {"background-color" : "#fff"}
})
var Message = require("pft-ui-component/Message");
var ListManager = PFT.Util.Class({
    TIMEOUT_COLOR : 1.5 * 1000,
    INIT_TICKET_MAX_SHOW : 3,  //默认最多显示3张票，多出的会被隐藏
    PAGE_SIZE : 5,             //每页请求多少条item
    container : "#orderListUl",
    EVENTS : {
        "click .refreshPriceBtn" : "onRefreshPriceBtnClick",
        "click .slideTicketUlBtn " : "onSlideTicketUlBtnClick",
        "click .buyBtn " : "onBuyBtnClick",
        "click .ticTypeToggleBtn" : "onTicTypeToggleBtnClick"
    },
    template : PFT.Util.ParseTemplate(Tpl),
    state : {
        currentPage : 1,
        isLoading : false,
        hasMore : true
    },
    init : function(){
        this.refresh();
    },
    //刷新实时价格
    onRefreshPriceBtnClick : function(e){
        var tarBtn = $(e.currentTarget);
        var pid = tarBtn.attr("data-pid");
        var aid = tarBtn.attr("data-aid");
        var fsid = tarBtn.attr("data-fsid");
        var fsaccount = tarBtn.attr("data-fsaccount");
        if(tarBtn.hasClass("disable")) return false;
        var parentLine = tarBtn.parents(".line");
        var lsPriceBox = parentLine.children(".col_4").find(".priceBoxLS");
        var jsPriceBox = parentLine.children(".col_5").find(".priceBoxJS");
        var imgLoading = '<img class="refreshPriceLoadingImg" src="'+PFT.LOADING_IMG_GIF+'" />';
        var params = {
            pid : pid,
            aid : aid
        };
        if(fsid) params["fsid"] = fsid;
        if(fsaccount) params["fsaccount"] = fsaccount;

        var origin = {
            ls : lsPriceBox.html(),
            js : jsPriceBox.html()
        };
        PFT.Util.Ajax(Common.Api.realTimePrice(),{
            type : Common.AJAX_TYPE,
            ttimeout : Common.AJAX_TIMEOUT,
            params : params,
            loading : function(){
                tarBtn.addClass("disable");
                lsPriceBox.html(imgLoading);
                jsPriceBox.html(imgLoading);
            },
            complete : function(){
                tarBtn.removeClass("disable");
                lsPriceBox.html(origin.ls);
                jsPriceBox.html(origin.js);
            },
            success : function(res){
                var data = res.data;
                if(res.code==200){
                    var jsprice = data.jsprice / 100;
                    var lsprice = data.lsprice / 100;

                    lsPriceBox.html('<i class="yen">&yen;</i><em class="num">'+lsprice+'</em>');
                    jsPriceBox.html('<i class="yen">&yen;</i><em class="num">'+jsprice+'</em>');


                }else{
                    Message.error(res.msg || PFT.AJAX_ERROR_TEXT);
                }
            },
            timeout : function(){
                Message.error(PFT.AJAX_TIMEOUT_TEXT);
            },
            serverError : function(){
                Message.error(PFT.AJAX_ERROR_TEXT);
            }
        })
    },
    onTicTypeToggleBtnClick : function(e){
        var tarBtn = $(e.currentTarget);
        var height = 0;
        tarBtn.parents(".ticketUlItem").children(".ticketTypeMsgBox").slideToggle(150,function(){
            var ticketUl = tarBtn.parents(".ticketUl");
            var slideTriggerBtn = ticketUl.parents(".ticketBox").children(".slideTicketUlBtn");
            ticketUl.children().each(function(){
                var item = $(this);
                if(item.hasClass("hidden")) return true;

                height += item.height();

                // if(slideTriggerBtn.hasClass("on")){
                //     height += item.height();
                // }else{
                //     if(!item.hasClass("hidden")){
                //         height += item.height();
                //     }
                // }
            })
            ticketUl.animate({height:height},200)
        });
    },
    onSlideTicketUlBtnClick : function(e){
        var showCount = this.INIT_TICKET_MAX_SHOW;
        var tarBtn = $(e.currentTarget);
        var ticketUl = tarBtn.parent().children(".ticketUl");
        tarBtn.toggleClass("on");
        var beginHeight = 0;
        var hiddenHeight = 0;
        var children = ticketUl.children();
        if(tarBtn.hasClass("on")){ //打开
            children.each(function(){
                var item = $(this);
                if(!item.hasClass("hidden")){
                    beginHeight += item.height();
                }else{
                    item.removeClass("hidden");
                    hiddenHeight += item.height();
                }
            })
            ticketUl.height(beginHeight);
            ticketUl.animate({height:(beginHeight+hiddenHeight)},200);
        }else{ //关闭
            for(var i=0; i<showCount; i++){
                beginHeight += children.eq(i).height();
            }
            ticketUl.animate({height:beginHeight},200,function(){
                for(var s=showCount; s<children.length; s++){
                    children.eq(s).addClass("hidden");
                }
            })
        }
    },
    onBuyBtnClick : function(e){
        this.trigger("buyBtn.click",e);
    },
    getState : function(prop){
        return prop ? this.state[prop] : this.state;
    },
    /**
     * 以下3种方式都可调用
     * setState({hasMore:false})
     * setState({hasMore:false,currentPage:10})
     * setState(prop,value)   
     */
    setState : function(){
        var args = arguments;
        var __state = this.state;
        var state = args[0];
        var val = args[1];
        if(typeof __state[state]!=="undefined" && typeof val!=="undefined") return this.state[state] = val;

        if(Object.prototype.toString.call(state)=="[object Object]"){
            PFT.Util.Mixin(__state,state)
        }

    },
    adaptLands : function(lands,pType){
        var num = 0;
        var fsid = Common.getFsid();
        var fsaccount = Common.getFsaccount();
        var fsname = Common.getFsname();
        var pageSize = this.PAGE_SIZE;
        var INIT_TICKET_MAX_SHOW = this.INIT_TICKET_MAX_SHOW;
        for(var i in lands){
            num++;
            var land = lands[i];
            if(num==1) lands[i]["first"] = true;  //为第一个item加一个first字段
            var tickets = lands[i]["ticket"];
            var minPrice = "undefined";

            //后端返回的门市价跟结算价都是以分为单位，这里前端需要除100，转成元
            for(var t=0,len=tickets.length; t<len; t++){
                var tick = tickets[t];
                var ls = tick.ls / 100;
                var js = tick.js / 100;
                tick["ls"] = ls;
                tick["js"] = js;
            }


            //为每个item添加一个字段：minprice  最低价格
            for(var t=0,tlen=tickets.length; t<tlen; t++){
                var tic = tickets[t];
                var jsprice = tic["js"] * 1;
                if(t>INIT_TICKET_MAX_SHOW-1) tic["showWhenInit"] = "hidden";
                if(minPrice==="undefined") minPrice = jsprice;
                if(minPrice>=jsprice) minPrice = jsprice;
            }
            lands[i]["minprice"] = minPrice;

            //切换更多按钮
            lands[i]["showTrigger"] = tickets.length > INIT_TICKET_MAX_SHOW ? true : false;

            //在计调下单时，每个item添加以下3个字段
            if(fsid && fsaccount){
                lands[i]["fsid"] = fsid;
                lands[i]["fsaccount"] = fsaccount;
                lands[i]["fsname"] = fsname;
            }

            //ptype后端已经返回了
            // lands[i]["ptype"] = pType;

        }
        return {
            lands : lands,
            count : num
        };
    },

    /**
     * 刷新列表
     */
    refresh : function(params){
        var that = this;
        var container = this.container;
        var pageSize = this.PAGE_SIZE;
        var adaptLands = this.adaptLands;
        var fsid = Common.getFsid();
        var fsaccount = Common.getFsaccount();
        params = PFT.Util.Mixin({
            page : 1,
            pageSize : pageSize,
            title : "",
            pType : "",
            theme : "",
            province : "",
            city : ""
        },params || {});

        if(fsid!==false) params["fsid"] = fsid;
        if(fsaccount!==false) params["fsaccount"] = fsaccount;

        //防止外部模块恶意修改page数
        params.page = 1;

        if(this.getState("isLoading")) return false;

        this.setState("currentPage",1);

        Common.fetch(params,{
            loading : function(){
                that.setState("isLoading",true);
                container.html(LoadingHtml)
            },
            complete : function(){
                that.setState("isLoading",false);
                container.html("")
            },
            success : function(data){
                var landData = that.adaptLands(data.lands);
                var count = landData.count; //后端返回几条item
                if(count<pageSize){ 
                    that.setState("hasMore",false);
                }else{
                    that.setState("hasMore",true);
                }
                that.renderList(1,data);
            },
            empty : function(data){
                that.setState("hasMore",false);
                that.renderList(1,data);
            },
            fail : function(msg,code){
                that.setState("hasMore",false);
                Message.alert(msg+"，错误代码："+code);
            },
            timeout : function(){
                that.setState("hasMore",false);
                Message.alert(AJAX_TIMEOUT_TEXT);
            },
            serverError : function(){
                that.setState("hasMore",false);
                Message.alert(AJAX_ERROR_TEXT)
            }
        })
    },
    /**
     * 获取更多
     */
    getMore : function(params){
        var that = this;
        var container = this.container;
        var pageSize = this.PAGE_SIZE;
        var adaptLands = this.adaptLands;
        var fsid = Common.getFsid();
        var fsaccount = Common.getFsaccount();
        if(this.getState("isLoading") || !this.getState("hasMore")) return false;
        params = PFT.Util.Mixin({
            page : 1,
            pageSize : pageSize,
            title : "",
            pType : "",
            theme : "",
            province : "",
            city : ""
        },params || {});

        if(fsid!==false) params["fsid"] = fsid;
        if(fsaccount!==false) params["fsaccount"] = fsaccount;

        var page = params.page;

        Common.fetch(params,{
            loading : function(){
                that.setState("isLoading",true);
            },
            complete : function(){
                that.setState("isLoading",false);
                container.children().last().remove();
            },
            success : function(data){
                var landData = that.adaptLands(data.lands);
                var count = landData.count; //后端返回几条item
                if(count<pageSize){ 
                    that.setState("hasMore",false);
                }else{
                    that.setState("hasMore",true);
                }
                that.setState("currentPage",page);
                that.renderList(page,data);
            },
            empty : function(data){
                that.setState("hasMore",false);
                that.setState("currentPage",page);
                that.renderList(page,data);
            },
            fail : function(msg,code){
                that.setState("hasMore",false);
                Message.alert(msg+"，错误代码："+code);
            },
            timeout : function(){
                that.setState("hasMore",false);
                Message.alert(AJAX_TIMEOUT_TEXT);
            },
            serverError : function(){
                that.setState("hasMore",false);
                Message.alert(AJAX_ERROR_TEXT)
            }
            
        });




    },
    getFirstLand : function(lands){
        var i = 1;
        var first = null;
        for(var id in lands){
            if(i==1) first = lands[id];
            break;
        }
        return first;
    },
    getCurrentPage : function(){
        return this.getState("currentPage");
    },
    resetState : function(){
        this.setState({
            currentPage : 1,
            isLoading : false,
            hasMore : true
        })
    },
    //渲染列表
    renderList : function(page,data){

        console.log(data);

        var that = this;
        var container = this.container;
        var pageSize = this.PAGE_SIZE;
        var state = this.getState();
        var currentPage = state.currentPage;
        var hasMore = state.hasMore;
        var isLoading = state.isLoading;
        var template = this.template;
        var lands = data.lands;
        var html = "";
        var getItemCount = function(data){
            var count = 0;
            if(isObject(data) && isEmptyObject(data)) return count;
            if(isArray(data) && data.length==0) return count;
            for(var i in data) count++;
            return count;
        };
        var count = getItemCount(lands);



        if(count==0){
            if(page==1){
                html = '<li class="state empty">暂无相关产品..</li>';
            }else{
                html += '<li class="state noMore">没有更多了..</li>';
            }
        }else{
            html = template({
                lands : lands,
                defaultImg : PFT.DEFAULT_IMG
            });
            if(count<pageSize){
                html += '<li class="state noMore">没有更多了..</li>';
            }else{
                html += LoadingHtml_More;
            }
            var firstLand = this.getFirstLand(lands);
            var lid = firstLand.lid;
            setTimeout(function(){
                $("#orderItem_"+lid).removeClass("first");
            },this.TIMEOUT_COLOR);
        }

        page==1 ? container.html(html) : container.append(html);

    }
});


module.exports = ListManager;