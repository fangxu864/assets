require("./index.scss");
var IndexTpl = require("./index.xtpl");

var pageTpls = {
    index: require("./index.xtpl"),
    price: require('./price.xtpl'),
    product: require('./product.xtpl')
};

var Message = require("pft-ui-component/Message");
var Main = PFT.Util.Class({
    userCache : true,

    __CacheData : {},

    container : "#NoticeListPage",

    api : {
        price : "/r/Home_HomeNotice/PriceChangeList/",
        product : "/r/Home_HomeNotice/ProductChangeList/",
        partner : "/r/Home_HomeNotice/partnerChange/"
    },

    EVENTS : {
        "click .tabHeader .tabItem" : "onTabItemClick",
        "click .paginationBox .navBtn" : "onPaginationBtnClick"
    },

    init : function(){
        var that = this;
        var container = this.container;
        container.html( pageTpls.index );
        setTimeout(function(){
            that.tabConContainer = container.children(".tabContainer");
            that.tabHeader = container.children(".tabHeader");
            that.tabHeader.children().first().trigger("click");
        },10);
    },

    getType : function(){
        return this.tabHeader.children(".active").attr("data-type");
    },

    onTabItemClick : function(e){
        var tarItem = $(e.currentTarget),
            type = tarItem.attr("data-type");

        if(tarItem.hasClass("loading")) return false;

        tarItem.addClass("active").siblings().removeClass("active");

        $("#tabCon_" + type).addClass("active").siblings().removeClass("active");

        if(tarItem.attr("data-hasloaded")!=1){
            tarItem.attr("data-hasloaded",1);
            this.fetchData(type,1,1);
        }
    },

    onPaginationBtnClick : function(e){
        var tarBtn = $(e.currentTarget);

        if(tarBtn.hasClass("disable") || tarBtn.hasClass("loading")) return false;

        var fromPage = tarBtn.siblings(".page").find(".pageNum").text() * 1,
            toPage = tarBtn.hasClass("next") ? (fromPage+1) : (fromPage-1),
            type = this.getType();

        this.fetchData(type,fromPage,toPage);
    },

    getPosParams : function(type,page){
        var pos = {
            self_pos : "",
            dis_Pos : ""
        };
        var cacheData = this.__CacheData[type+"_"+page];
        if(!cacheData) return pos;

        if(typeof cacheData.self_pos !=="undefined") pos.self_pos = cacheData.self_pos;
        if(typeof cacheData.dis_Pos !=="undefined") pos.dis_Pos = cacheData.dis_Pos;

        return pos;

    },

    fetchData : function(type,fromPage,toPage){
        if(typeof type!=="string") return false;
        var that = this;
        var __CacheData = this.__CacheData;
        var url = this.api[type];

        fromPage = fromPage || 1;
        toPage = toPage || 1;

        if(!url) return false;

        var _fetch = function(){
            var pos = that.getPosParams(type,fromPage);

            PFT.Util.Ajax(url,{
                type : "post",
                params : {
                    size : 15,
                    page : toPage,
                    self_pos : pos.self_pos,
                    dis_Pos : pos.dis_Pos
                },
                loading : function(){
                    if(fromPage==1 && toPage==1){
                        that.renderPagination("hidden");
                    }else{
                        that.renderPagination(type,fromPage,"loading");
                    }
                },
                complete : function(){
                    if(fromPage==1 && toPage==1){
                        that.renderPagination("hidden");
                    }else{
                        that.renderPagination(type,fromPage);
                    }
                },
                success : function(res){
                    var code = res.code,
                        data = res.data,
                        msg = res.msg || PFT.AJAX_ERROR_TEXT;

                    if(code==200){
                        if(data.list.length){
                            that.renderPagination(type,toPage);
                            that.render(type,data);
                            //请求过的就加入缓存
                            that.__CacheData[type+"_"+toPage] = data;
                        }else{
                            Message.alert("没有更多了..");
                            that.renderPagination(type,fromPage,"noMore");
                        }
                    }else{
                        Message.alert(msg);
                    }
                },
                timeout : function(){
                    Message.alert(PFT.AJAX_TIMEOUT_TEXT);
                },
                serverError : function(){
                    Message.alert(PFT.AJAX_ERROR_TEXT);
                }
            })
        }

        if(this.userCache){ //启用缓存的情况
            var key = type + "_" + toPage;
            if(__CacheData[key]){ //已缓存
                that.render(type,__CacheData[key]);
                that.renderPagination(type,toPage);
            }else{
                _fetch();
            }
        }else{
            _fetch();
        }


    },

    render : function(type,data){
        var tbody = $("#tbody_" + type);

        if( !tbody.length ) return false;

        var parseTemplate = PFT.Util.ParseTemplate( pageTpls[ type ] ),
            html = parseTemplate({ data: data });
        console.log(data);

        tbody.html( html );
    },

    renderPagination : function(type,page,state){
        var pag = $("#tabCon_"+type).children(".paginationBox"),
            prevBtn = pag.children(".prev"),
            nextBtn = pag.children(".next");

        if(!pag.length) return false;

        //恢复状态到初始值
        pag.show();
        prevBtn.removeClass("disable").removeClass("loading");
        nextBtn.removeClass("disable").removeClass("loading").html('<i class="picon icon-arrowright icon-u-bold"></i>');

        //各种状态判断
        //如果在初始化loading时,不显示分页条
        if(type=="hidden") return pag.hide();

        if(page==1) prevBtn.addClass("disable");

        if(state=="loading"){ //ajax loading时
            nextBtn.addClass("loading").html('<img src="'+PFT.LOADING_IMG_GIF+'"/>');
        }

        if(state=="noMore") nextBtn.addClass("disable");

        pag.find(".pageNum").text(page);

    }
});



$(function(){
    new Main;
})