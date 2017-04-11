require('./index.scss');

var indexTpl = require("./index.xtpl");

var ParseTemplate =  require("COMMON/js/util.parseTemplate.js");
var Message = require("pft-ui-component/Message");
var tips = require("COMMON/modules/tips/index.js");
var name_idNum_li_tpl = require("./tpl/name-idNum-li.xtpl");
var common_contact_tpl = require("./tpl/common-contact.xtpl");
var Tips = new tips ();

// Tips.closeAllTips();
// Tips.show({
//     lifetime : 1500 ,
//     direction:'top',
//     hostObj : icon ,
//     content : "刷新成功",
//     bgcolor : "#3eba40"
// })

var Contact = PFT.Util.Class({

    init:function (relyDiv) {
        var _this = this;
        this.container  = $('<div class="contact-main-box"></div>');
        //依托的div
        var RelyDiv = typeof relyDiv === "string" ? $(relyDiv) : relyDiv;
        RelyDiv.append(_this.container);
        this.container.html(indexTpl);
        this.bind();
        this.getContactData();
    },

    bind:function () {
        var _this = this;
        //取票人input和游客信息第一个input同步
        this.container.on("propertychange input" , "input[name = ordername]" ,function () {
            var val = $(this).val();
            _this.container.find(".tourist-info-box .name-idNum-ul li:first-child .name-inp").val(val);
        });
        
        //常用联系人点击快速选择
        this.container.on("click", ".contact-ul .contact-li" ,function () {
            var curBtn = $(this);
            curBtn.addClass("selected").siblings().removeClass("selected");
            _this.container.find("input[name = ordername]").val(curBtn.attr("data-name")).trigger("input");
            _this.container.find("input[name = ordertel]").val(curBtn.attr("data-mobile"));
            _this.container.find("input[name = idCard]").val(curBtn.attr("data-idNum"))
        });

        //常用联系人删除
        this.container.on("click", ".contact-ul .contact-li .del-btn" ,function (e) {
            e.stopPropagation();
            var curBtn = $(this);
            var name = curBtn.attr("data-name");
            var mobile = curBtn.attr("data-mobile");
            var idNum = curBtn.attr("data-idNum");
            Message.confirm('是否删除"'+name+'"?',function (relult) {
                if(relult){
                    var param = {
                        action: "delete",
                        mobile: mobile,
                        name: name,
                        ID: idNum
                    };
                    $.ajax({
                        url: "/r/Book_Booking/updateLinkman",    //请求的url地址
                        dataType: "json",   //返回格式为json
                        async: true, //请求是否异步，默认为异步
                        data: param,    //参数值
                        type: "POST",   //请求方式
                        timeout:5000,   //设置超时 5000毫秒
                        beforeSend: function() {
                            //请求前的处理
                        },
                        success: function(res) {
                            // 请求成功时处理
                            if( res.code  == 200 ){
                                _this.getContactData();
                                Message.success("删除成功！")
                            }else{
                                Message.error(res.msg)
                            }
                        },
                        complete: function(res,status) {
                            //请求完成的处理
                            if(status=="timeout") {
                                Message.error('请求超时，删除失败')
                            }
                        },
                        error: function() {
                            //请求出错处理
                            Message.error('请求出错')
                        }
                    });
                }
            })
        });

        //常用联系人添加
        this.container.on("click" , ".saveUserBtn" ,function () {
            _this.checkContactInp();
            var name = _this.container.find("input[name = ordername]").val();
            var mobile = _this.container.find("input[name = ordertel]").val();
            var idNum = _this.container.find("input[name = idCard]").val();

            //假设用户添加的联系人是全新的，姓名和手机都不能和已有的一样
            var isNew = true;
            for(var i = 0; i< _this.ContactHub.length; i++){
                if(_this.ContactHub[i].mobile == mobile && _this.ContactHub[i].name == name && _this.ContactHub[i].ID == idNum ){
                    Message.warning('已存在该联系人，请勿重复添加');
                    return false;
                }
                if(_this.ContactHub[i].mobile == mobile || _this.ContactHub[i].name == name ){
                    //如果存在手机或姓名相同的，则为更新
                    isNew = false;
                }
            }

            if(isNew && _this.ContactHub.length == 10){
                Message.warning('常用联系人最多可以添加10个哦');
                return false;
            }

            var param = {
                action: "update",
                mobile: mobile,
                name: name,
                ID: idNum
            };
            $.ajax({
                url: "/r/Book_Booking/updateLinkman",    //请求的url地址
                dataType: "json",   //返回格式为json
                async: true, //请求是否异步，默认为异步
                data: param,    //参数值
                type: "POST",   //请求方式
                timeout:5000,   //设置超时 5000毫秒
                beforeSend: function() {
                    //请求前的处理
                },
                success: function(res) {
                    // 请求成功时处理
                    if( res.code  == 200 ){
                        Message.success("添加成功！");
                        _this.getContactData();
                    }else{
                        Message.error(res.msg)
                    }
                },
                complete: function(res,status) {
                    //请求完成的处理
                    if(status=="timeout") {
                        Message.error('请求超时，添加失败')
                    }
                },
                error: function() {
                    //请求出错处理
                    Message.error('请求出错')
                }
            });
        })


    },

    /**
     * @method 渲染更新方法
     * @param needIdNum 需要身份证的数量
     */
    //已渲染过的数量
    renderedNum: 0,
    render: function (needIdNum) {

        var num = Number(needIdNum);
        if( num === NaN || num < 0 ) return false;

        switch (num){
            case 0 :
                this.container.find(".contact-info-box .lt .id-card-li").hide();
                this.container.find(".contact-info-box .lt .id-card-li input").attr("data-must","false");
                this.container.find(".tourist-info-box").hide();
                break;
            case 1 :
                this.container.find(".contact-info-box .lt .id-card-li").show();
                this.container.find(".contact-info-box .lt .id-card-li input").attr("data-must","true");
                this.container.find(".tourist-info-box").hide();
                break;
            default:
                var needAppendNum = num - this.renderedNum;
                this.renderedNum = num;
                this.container.find(".contact-info-box .lt .id-card-li").hide();
                this.container.find(".contact-info-box .lt .id-card-li input").attr("data-must","false");
                this.container.find(".tourist-info-box").show();
                var html = '';
                if(needAppendNum > 0){
                    for(var i = 0; i< needAppendNum; i++){
                        html += name_idNum_li_tpl;
                    }
                    this.container.find(".tourist-info-box .name-idNum-ul").append(html);
                }else{
                    for(var i = 0; i< Math.abs( needAppendNum ); i++){
                        this.container.find(".tourist-info-box .name-idNum-ul li:last-child").remove();
                    }
                }
                break;
         }
    },

    /**
     * @method 获取联系人信息
     */
    ccTemplate: ParseTemplate(common_contact_tpl),
    //常用联系人暂存仓库
    ContactHub: {},
    getContactData: function () {
        var _this = this;
        var loadingStr = PFT.Util.LoadingPc("努力加载中...",{
            tag : "div",
            height: 90
        });
        var Box = $(".contact-main-box .contact-info-box .rt .contact-ul");
        Box.html(loadingStr);

        $.ajax({
            url: "/r/Book_Booking/getLinkman",    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步
            data: {},    //参数值
            type: "GET",   //请求方式
            timeout:5000,   //设置超时 5000毫秒
            beforeSend: function() {
                //请求前的处理
            },
            success: function(res) {
                // 请求成功时处理
                if( res.code  == 200 ){
                    if(　res.data.length > 0 ) {
                        _this.ContactHub = res.data;
                        var html = _this.ccTemplate({data: res.data});
                        Box.html(html);
                    }else{
                        Box.html("<p style='color: orangered;text-align: center'>暂无常用联系人，请添加</p>");
                    }
                }else{
                    Box.html("<p style='color: orangered;text-align: center'>"+res.msg+"</p>");
                }
            },
            complete: function(res,status) {
                //请求完成的处理
                if(status=="timeout"){
                    Box.html("<p style='color: orangered'>请求超时</p>")
                }
            },
            error: function() {
                //请求出错处理
                Box.html("<p style='color: orangered;text-align: center'>请求出错</p>")
            }
        });

    },

    /**
     * @method 表单校验
     */
    checkContactInp: function () {
        var _this = this;
        var inpSet = this.container.find(".contact-info-box input[data-must = true]");
        for(var i = 0; i< inpSet.length; i++){
            var item = inpSet.eq(i);
            console.log(item);
            if(item.val() == ''){
                Tips.closeAllTips();
                Tips.show({
                    lifetime : 1500 ,
                    direction:'right',
                    hostObj : item ,
                    content : "请填写内容",
                    bgcolor : "#3eba40"
                })
            }
            break;
        }
    }

});


module.exports = Contact;