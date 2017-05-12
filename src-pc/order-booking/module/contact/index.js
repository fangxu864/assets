require('./index.scss');



var ParseTemplate =  PFT.Util.ParseTemplate;
var Message = require("pft-ui-component/Message");
var tips = require("COMMON/modules/tips/index.js");
var Tips = new tips ();

var indexTpl = require("./index.xtpl");
var IndexTemplate = ParseTemplate(indexTpl);
var name_idNum_li_tpl = require("./tpl/name-idNum-li.xtpl");
var common_contact_tpl = require("./tpl/common-contact.xtpl");



var Contact = PFT.Util.Class({

    init:function (opt) {},

    bind:function () {
        var _this = this;
        this.container.on("blur" , "input[data-must = true]", function (e) {
            var curInp = $(this);
            _this.checkInp(curInp);
        });
        //取票人input和游客信息第一个input同步
        // this.container.on("propertychange input" , "input[name = ordername]" ,function () {
        //     var val = $(this).val();
        //     _this.container.find(".tourist-info-box .name-idNum-ul li:first-child .name-inp").val(val);
        // });
        
        //常用联系人点击快速选择
        this.container.on("click", ".contact-ul .contact-li" ,function () {
            var curBtn = $(this);
            curBtn.addClass("selected").siblings().removeClass("selected");
            _this.container.find("input[name = ordername]").val(curBtn.attr("data-name"));
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
            var inpSet = _this.container.find(".contact-info-box input[data-must = true]");
            if( !_this.checkInp(inpSet) ) return false;
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
        });

        //向服务器form submit 身份证excel
        this.container.on("change","#exportFileInput",function(e){
            $("#exportIDCardForm").submit();
            $(e.currentTarget).val("");
        })


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
        var Box = this.container.find(".contact-info-box .rt .contact-ul");
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
    checkInp: function (inpSet) {
        var _this = this;
        var allOk = true;
        for(var i = 0; i< inpSet.length; i++){
            var item = inpSet.eq(i);
            var type = item.attr("validate-type");
            var inpVal = item.val();
            var isBreak = false;
            switch (type){
                case "name":
                    if(inpVal == ''){
                        // item.focus();
                        Tips.closeAllTips();
                        Tips.show({
                            lifetime : 1500 ,
                            direction:'right',
                            hostObj : item ,
                            content : "请填写姓名",
                            bgcolor : "#f0c245"
                        });
                        isBreak = true;
                    }
                    break;
                case "idCard":
                    if(!PFT.Util.Validate.idcard(inpVal)){
                        // item.focus();
                        Tips.closeAllTips();
                        Tips.show({
                            lifetime : 1500 ,
                            direction:'right',
                            hostObj : item ,
                            content : "请填写正确的身份证号",
                            bgcolor : "#f0c245"
                        });
                        isBreak = true;
                    }
                    break;
                case "mobile":
                    if(!/^1[0-9]{10}$/.test(inpVal)){
                        // item.focus();
                        Tips.closeAllTips();
                        Tips.show({
                            lifetime : 1500 ,
                            direction:'right',
                            hostObj : item ,
                            content : "请填写正确的手机号",
                            bgcolor : "#f0c245"
                        });
                        isBreak = true;
                    }
                    break;
                default:
                    alert(type);
            }
            if(isBreak){
                allOk = false;
                break;
            }
        }
        return allOk;

    },

    /**
     * @method 对象化序列参数
     */
    deSerialize: function ( str ) {
        var arr = str.split("&");
        var obj = {
            tourist_name: [],
            tourist_cert: []
        };
        for( var i= 0 ; i< arr.length ;i++ ){
            var key = decodeURIComponent( arr[i].split("=")[0] );
            var value = decodeURIComponent(arr[i].split("=")[1]);
            if(/^tourist_name\[]$/.test(key)){
                obj.tourist_name.push(value);
            }else if(/^tourist_cert\[]$/.test(key)){
                obj.tourist_cert.push(value);
            }else{
                obj[ key ] = value;
            }
        }
        return obj;
    },

    //当身份证excel文件上传完成后执行此方法
    onIDCardExcelUploadSuccess : function(res){
        var code = res.code;
        var msg = res.msg || PFT.AJAX_ERROR_TEXT;
        var data = res.data;
        if(code==200){ //成功
            var listUl = $("#touristListUl");
            var items = listUl.children();
            for(var i=0,len=data.length; i<len; i++){
                var item = data[i];
                items.eq(i).find(".name-inp").val(item.name);
                items.eq(i).find(".idNum-inp").val(item.cardNum);
            }
        }else if(code==102){//登录过期
            Message.alert("登录状态已过期，请重新登录","",{
                onCloseAfter : function(){
                    window.location.href = PFT.PREFIX_DOMAIN() + "dlogin_n.html";
                }
            })
        }else{
            Message.alert(msg);
        }
    },


    //-------------------对外开放的方法-------------------//
    renderTouristList : function(count){
        var touristListContainer = this.container.find(".tourist-info-box");
        var listUl = $("#touristListUl");
        var items = listUl.children();
        var len = items.length;
        var html = "";
        if(isNaN(count)) return this; //必须是数字
        if(!PFT.Util.Validate.typeInit0(count)) return this;  //必须是整数，可以为0
        count = count * 1;  //转成number型

        var dis = Math.abs(count-len);

        if(count==0) return this; //不能为0

        if(count==len) return this;

        if(count>len){ //增加
            for(var i=0; i<dis; i++) html += name_idNum_li_tpl;
            listUl.append(html);
        }else{//减少

            //排序
            var itemsBySort = (function(items){

                //只填一个
                var bothBlank = [];   //姓名跟id都没填的
                var hasOneInput = []; //姓名跟id只填写一个的
                var bothInput = [];   //姓名跟id都有填的
                items.each(function(){
                    var item = $(this);
                    var nameInp = item.find(".name-inp");
                    var idInp = item.find(".idNum-inp");
                    var name = $.trim(nameInp.val());
                    var id = $.trim(idInp.val());
                    if(id=="" && name==""){
                        bothBlank.push(item);
                    }else if(id!="" || name!=""){
                        hasOneInput.push(item);
                    }else{
                        bothInput.push(item);
                    }
                })

                return bothInput.concat(hasOneInput,bothBlank);

            })(items);

            var sl = itemsBySort.length;

            //减少的时候，优先删除信息填写量少的
            for(var i=sl-1; i>=sl-dis; i--){
                itemsBySort[i].remove();
            }

        }

    },



    render : function(data){
        //把外层模块传进来的data存起来
        this.data = data;

        if(data.needID==2) window["onIDCardExcelUploadSuccess"] = this.onIDCardExcelUploadSuccess;

        this.container.html(IndexTemplate(data));
        this.bind();
        this.getContactData();
        return this;
    },

    /**
     * @method 获取联系人模块的表单数据
     */

     //获取信息这个方法，由于业务需求上的新更，需要新增身分证excel文件上传功能  
     //由于上传excel文件目前只能用form表单提交上传
     //这样一来，这个模块里就存在2个form，并且是嵌套关系，会有问题
     //所以，这个模块最外层的form#contactInfoForm需要去掉或移到其它地方
    getData:function (){
        var inpSet = this.container.find("input[data-must = true]");
        var res = this.checkInp(inpSet);
        if(!res) return false;
        var params = {};
        var tourListInfoForm = $("#tourListInfoForm");
        if(tourListInfoForm.length){ //如果存在tourListInfoForm表单，说明是needID==2的情况
            params = $("#tourListInfoForm").serialize();
            params = this.deSerialize(params);
        }
        params["ordername"] = $.trim($("#contact_ordernameInp").val());
        params["ordertel"] = $.trim($("#contact_mobileInp").val());
        params["memoInp"] = $.trim($("#contact_memoInp").val());
        if($("#contact_idcardInp").length>0) params["idCard"] = $.trim($("#contact_idcardInp").val());
        return params;
    }

});


module.exports = Contact;