require("./index.scss");
//引入消息提示组件
var Message = require("pft-ui-component/Message");
var Tpl = require("./index.xtpl");
var Template = PFT.Util.ParseTemplate(Tpl);
var Common = require("../../../common.js");
var Ajax_GetShowInfo = require("SERVICE/order-booking/getShowInfo");
var Loading_PC = PFT.Util.LoadingPc("正在加载场次信息...",{
    height : 200
})
var ChangciSelect = PFT.Util.Class({
    init : function(opt){
        var that = this;
        var urlParams = Common.getPidAid();
        var startDate = this.startDate = opt.startDate;
        var pid = this.pid = urlParams.pid;
        var aid = this.aid = urlParams.aid;

        this.poper = this.createPoper();
        this.mask =  this.createMask();


        this.poper.on("click",".listItem",function(e){
            var tarItem = $(e.currentTarget);
            var changciTime = tarItem.find(".changciTime").text();
            if(!tarItem.hasClass("active")) that.trigger("change",{time:changciTime});
            tarItem.addClass("active").siblings().removeClass("active");
            that.close();
        });
        this.mask.on("click",function(e){
            that.close();
        })


        this.refresh(pid,aid,startDate);


    },
    position : function(){
        var tarElem = $("#iShowBeginTimeInp").parent();
        var offset = tarElem.offset();
        return{
            top : offset.top + tarElem.height(),
            left : offset.left
        }
    },
    createPoper : function(){
        this.poper = $('<div id="showTimePoper" class="showTimePoper"></div>').appendTo($("body"));
        return this.poper;
    },
    createMask : function(){
        this.mask = $('<div id="showTimePoperMask" class="showTimePoperMask"></div>').appendTo($("body"));
        return this.mask;
    },
    open : function(){
        var pos = this.position();
        this.poper.css({
            left : pos.left,
            top : pos.top + 20,
            opacity : 0,
            display : "block"
        }).animate({top:pos.top,opacity:1},120);
        this.mask.fadeIn(120);
    },
    close : function(){
        var that = this;
        var top = this.poper.css("top");
        top = top.substr(0,top.length-2) * 1;
        this.poper.animate({top:top+20,opacity:0},120,function(){
            that.poper.hide();
        });
        this.mask.fadeOut(120);
    },
    renderList : function(list){
        var html = Template({data:list});
        this.poper.html(html);
    },
    refresh : function(pid,aid,date){
        var that = this;
        var listUl = this.poper.find(".listUl");
        Ajax_GetShowInfo({
            pid : pid,
            aid : aid,
            date : date
        },{
            loading : function(){
                listUl.html(Loading_PC);
            },
            complete : function(){
                listUl.html("");
            },
            success : function(data){
                that.renderList(data);
                if(data.length==0){
                    that.trigger("empty");
                }
            },
            fail : function(msg,code){ Message.alert(msg)},
            timeout : function(){ Message.alert(PFT.AJAX_TIMEOUT_TEXT)},
            serverError : function(){ Message.alert(PFT.AJAX_ERROR_TEXT)}
        })
    }
});

module.exports = ChangciSelect;