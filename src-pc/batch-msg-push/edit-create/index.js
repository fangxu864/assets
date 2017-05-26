require("./index.scss");
var Common = require("../common/index.js");
var CheckRadioSelect = Common.CheckRadioSelect;
//异步文件上传组件
var Fileupload = Common.Fileupload;

var DatetimePicker = require("COMMON/Components/Datepicker/v0.1");

var AJAX_ERROR_TEXT = PFT.AJAX_ERROR_TEXT;
var AJAX_TIMEOUT_TEXT = PFT.AJAX_TIMEOUT_TEXT;

var Message = require("pft-ui-component/Message");

//接收方radio
var ReceiverRadio = CheckRadioSelect("#receiverCheckRadioSelectWrap",{
    type : "radio",
    name : "recType",
    option : [{
        key : 1,
        text : "系统自动筛选"
    },{
        key : 2,
        text : "指定会员"
    }],
    onSelect : function(data){
        
    }
});


//推送渠道checkbox
var PushChannelCheckbox = CheckRadioSelect("#pushChannelCheckRadioSelectWrap",{
    type : "checkbox",
    name : "pushChannel",
    option : [{
        key : 1,
        text : "短信"
    },{
        key : 2,
        text : "微信"
    }],
    onSelect : function(data){
        
    }
});

//推送方式radio
var PushStyleRadio = CheckRadioSelect("#pushStyleCheckRadioSelectWrap",{
    type : "radio",
    layout : "v",
    name : "pushStyle",
    option : [{
        key : 1,
        text : "启动时立即推送"
    },{
        key : 2,
        css : {
            height : "40px",
            lineHeight : "40px"
        },
        text : function(){
            var st = "定时推送";
            st += '<input readonly id="datetimeInp" class="datetimeInp shadow textInp" type="text" placeholder="年-月-日 时:分:秒"/>';
            return st;
        }
    },{
        key : 3,
        css : {
            height : "40px",
            lineHeight : "40px"
        },
        text : function(){
            var st = "动态推送，于会员生日前";
            st += '<input class="pushDayCountInp shadow textInp" id="pushDayCountInp" type="text" placeholder="请输入整数"/>天推送';
            return st;
        }
    }],
    onSelect : function(data){
        
    }
});



var Main = PFT.Util.Class({
    container : "#formWrap",
    EVENTS : {
        "change #msgTypeSelect" : "onMsgTypeSelectChange",
        "click #datetimeInp" : "onDatetimeInpClick"
    },
    init : function(){
        var that = this;
        var fileShowInp = this.fileShowInp = $("#excelUploadWrap").find(".fileShow");
        this.uploadExcelBtn = $("#exportEnterBtn");
        this.msgTypeSelect = $("#msgTypeSelect");
        this.excelUploadLine = $("#excelUploadLine");

        this.datetimePicker = new DatetimePicker();

        this.bindEvents();
        ReceiverRadio.render();
        PushChannelCheckbox.render();
        PushStyleRadio.render();
        this.initMsgType();

        //初始化时默认选中
        this.msgTypeSelect.val(0);

    },
    bindEvents : function(){
        var that = this;
        //excel文件上传input
        $("#exportFileInput").on("change",function(e){
            var files = e.target.files;
            if(files.length<1) return false;
            that.uploadExcel(files[0])
        })

        // this.container.on("change","#msgTypeSelect",function(e){
        //     that.onMsgTypeSelectChange(e);
        // })

        //接收方radio选择时
        ReceiverRadio.on("select",function(data){
            if(data.disable) return false;
            var key = data.key;
            if(key==1){//系统自动筛选
                that.excelUploadLine.hide();
                PushStyleRadio.disable(1,2);
                PushStyleRadio.enable(3).select(3);
            }else if(key==2){//指定会员
                that.excelUploadLine.show();
                PushStyleRadio.enable(1,2).select(1);
                PushStyleRadio.disable(3);
            }
        })


    },
    onMsgTypeSelectChange : function(e){
        var val = $(e.currentTarget).val();
        if(val==0){ //通用时   接收方只能选择指定会员
            ReceiverRadio.enable(2).select(2).disable(1);
        }else if(val==2){ //礼券到期 接收方只能选择系统自动筛选
            ReceiverRadio.enable(1).select(1).disable(2);
        }else if(val==1){ //生日祝福时， 接收方都可选
            //这里不做任何处理
            ReceiverRadio.enable(1,2,3);
        }
    },
    onDatetimeInpClick : function(e){
        var tarInp = $(e.currentTarget);
        var tarOpt = tarInp.parents(".checkRadioOpt");
        if(!tarOpt.length || tarOpt.hasClass("disable")) return false;
        var datetime = tarInp.val();
        this.datetimePicker.show(datetime,{
            picker : tarInp
        })
    },
    initMsgType : function(){
        var typeArr = Common.msgType;
        var html = "";
        for(var i=0; i<typeArr.length; i++){
            var type = typeArr[i];
            var val = type.val;
            var text = type.text;
            if(val==-1) continue;
            html += '<option value="'+val+'">'+text+'</option>';
        }
        this.msgTypeSelect.html(html);
        this.msgTypeSelect.trigger("change");
    },
    uploadExcel : function(file){
        var uploadBtn = this.uploadExcelBtn;
        var fileShowInp = this.fileShowInp;
        Fileupload(Common.url.uploadExcel,{
            params : {
                excelUp : file,
                identify : "batSendMsg"
            },
            loading : function(){
                uploadBtn.addClass("disable");
            },
            complete : function(){
                uploadBtn.removeClass("disable");
            },
            success : function(res){
                var code = res.code;
                var msg = res.msg || AJAX_ERROR_TEXT;
                var data = res.data;
                if(code==200){
                    Message.success("上传成功");
                    fileShowInp.val(data.src);
                }else{
                    Message.error(msg,3000);
                }
            },
            serverError : function(xhr,text){
                Message.alert(text || AJAX_ERROR_TEXT);
            }
        })
    }
});


$(function(){ new Main()})