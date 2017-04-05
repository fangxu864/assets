
var Dialog = require("COMMON/modules/dialog-simple");  //遮罩框
require("./index.scss"); 
var bindDialogTpl = require("./bindDialogTpl.xtpl");

/**
 * Created by Administrator on 2016/9/26.
 */
$(function(){
    var init = function (){

        var agreeDialog = new Dialog({
			header : '<span class="dialogHeader">同意</span>',
            width : 450,
            height : 250,
            closeBtn : true,
            // content : agreeDialogTpl,
            content : bindDialogTpl,
            drag : true,
            speed : 200,
            offsetX : 0,
            offsetY : 0,
            overlay : true,
            headerHeightMin : 46
        });

        //测试 
        // agreeDialog.open();

        $("body").append("<ul class='meituan_notice_box'></ul>");
        $("body").append('<link rel="stylesheet" href="http://static.12301.cc/css/new/qunaer.css"/>');
        var quTsf = "供应商通信标识：";
        var quTss = "交互密钥：";
        var baiTsp = "服务商编号：";
        var baiTss = "店铺编号|密钥：";
        var quTsp = "（由去哪儿提供）";
        var meiTsp = "（由美团提供：partnerId）";
        var meiTsb = "（由美团提供：clientID|clientsecret，注：以竖线隔开）";
        var baiTs = "（由百度直达号提供：prodiver_no）";
        var baiTsa = "（由百度直达号提供：sp_no|secret_key，注：以竖线隔开）";
        var saveURL = "call/jh_tuan.php?action=auth_information";
        var getURL = "route/index.php?c=qunaer_getQunaer&a=getlis";
        var getInfo = "route/index.php?c=qunaer_getQunaer&a=getlis";
        getInfoTab("1");
        $(".profit").live("click",function(e){
            var target = $(e.currentTarget);  //1去哪儿0  2  美团v1 1c0 3 美团V2 1c1 4 百度直达号 2
            var type = target.attr("type");
            $(".profit").removeClass("active");
            target.addClass("active");
            $(".serspan").html("请搜索或选择产品");
            getInfoTab(type);
        })
        $(".qtip").live("click",function(e){
            $(".prodList").hide();
            $(".group_2").hide();
            $(".onBlurInput").hide();
            $(".serspan").html("请搜索或选择产品");
            $(".searchIcon").removeClass("sinco");
            $(".sinco").hide();
            var target = $(e.currentTarget);  //0全部 1已绑定 2 未绑定
            var type = target.attr("type");
            $(".qtip").removeClass("active");
            target.addClass("active");
            var qtip = $(this).attr("type");
            $(".conf_type").attr("qtip",qtip);
        })

        $(".sei").live("click",function(e){
            $(".prodList").hide();
            $(".onBlurInput").show();
            $(".onBlurInput").focus();
            var title = $(".serspan").html();
            if(title=="请搜索或选择产品"){
                $(".onBlurInput").val(null);
            }else{
                $(".onBlurInput").val(title);
            }
            $(".searchIcon").addClass("sinco");

            $(".sinco").show();
            $(".group_2").hide();
            getAllinfo();
            $(".prodList").show();
        })

        $(".serspan").live("click",function(){
            $(".prodList").hide();
            $(".onBlurInput").show();
            $(".onBlurInput").focus();
            var title = $(".serspan").html();
            if(title=="请搜索或选择产品"){
                $(".onBlurInput").val(null);
            }else{
                $(".onBlurInput").val(title);
            }
            $(".sinco").show();
            $(".group_2").hide();
            getAllinfo();
            $(".prodList").show();
        })

        $(".onBlurInput").blur(function(e){
            $(this).hide();
            $(".searchIcon").removeClass("sinco");
            $(".sinco").hide();
        })

        $(".closeR").live("click",function(){
            $(".prodList").hide();
            $(".group_2").hide();
            $(".serspan").html("请搜索或选择产品");
        });

        $(".onBlurInput").live("keyup",function(){
            $(".prodList").hide();
            $(".group_2").hide();
            var sth=$('.onBlurInput').val();
            var i=0;
            $("#prodList li").each(function(){
                var n=$(this).text().indexOf(sth);
                if(n==-1){
                    $(this).css("display","none");
                }else{
                    i+=1
                    $(this).css("display","block");
                }
            });
            if(i==0){
                $(".prodList").css("display","none");
            }else{
                $(".prodList").css("display","block");
            }
        });

        $("#prodList li").live("click",function(){
            var id = $(this).attr("data");
            var title = $(this).html();
            $(".serspan").html(title);
            $("#prodList").hide();
            search(id);
        });

        $(".removeC").live("click",function(e){          //解除绑定
            var id = Number($(this).attr("remove"));
            var removeUrl = "call/jh_tuan.php?action=remove";
            var params ={
                "api" : removeUrl,
                "type" : "2",
                "id" : id
            }
            ajax.getList(params,{
                success : function(res){
                    var rid = params.id;
                    $(".remove_"+rid).parent().parent().remove();
                },
                fail : function(mgs){
                    alert(mgs);
                }
            })

        });

        $(".addC").live("click",function(){    //绑定的 还未加入地址

            var ti={};
            var ids = {};
            var conf_type = $(".conf_type").val();
            var Identity = $(".Identity").val();
            var sign = $(".sign").val();
            var cooperation_way = $("#conSelect").val();
            var meiL = $(".meiL").hasClass("active");
            var meiSelect = $(".meiSelect").val();
            var tid = $(this).parent().parent().find(".idNum").attr("tid");
            var aid = $(this).parent().parent().find(".idNum").attr("aid");
            var lid = $(this).parent().parent().find(".idNum").attr("lid");

            ti.conf_type = conf_type;
            ti.Identity = Identity;
            ti.sign = sign;
            ti.cooperation_way = cooperation_way;
            if(meiL){
                ti.cooperation_way = "1";
                if(meiSelect==0){
                    ti.hand_on_single = 0;
                }else if(meiSelect==1){
                    ti.hand_on_single = 1;
                }
            }else{
                ti.cooperation_way = cooperation_way;
            }
            if(conf_type!=0){
                ids[tid] = aid+'|'+lid+'|'+tid;
            }else{
                ids[tid] = tid+'_'+aid;
            }
            ti.ids = ids;
            var tids = tid;

            var originId = $("#bindBox #bindIdInput").val(ids[tid]);
            agreeDialog.open();

            $("#bindBox .bind").on("click",function(){//绑定
                var originId = $("#bindBox #bindIdInput").val();
                console.log(conf_type);                
                if( originId != ids[tid] && conf_type == "1"){
                    ti.trird_part_teamwork_id = originId;
                }
                $.ajax({
                    type:'POST',url: 'call/jh_tuan.php?action=set_conf',data: ti, dataType:'json',
                }).done(function(res) {
                    console.log(res);
                    if(res.status=="success"){
                        alert("绑定成功");
                        agreeDialog.close();
                        $(".add_"+tids).parent().parent().remove();
                        $("#bindBox .bind").off("click");
                    }else{
                        agreeDialog.close();
                        $("#bindBox .bind").off("click");
                        alert(res.msg);
                    }
                })
            });
            //关闭
            $("#bindBox .close").on("click",function(){
                $("#bindBox .close").off("click");
                agreeDialog.close();
            });
        });

        $(".changeM").live("click",function(e){ //解除通知
            var tarBtn = $(e.currentTarget);
            var surl = tarBtn.attr("tyurl");
            var surl0=surl;
            surl0=surl0.replace("status=2","status=1");
            var surl2=surl;
            var surl5=surl;
            surl5=surl5.replace("status=2","status=5");
            var typeData;
            var meituan_notice_box= $(".meituan_notice_box");
            meituan_notice_box.html("<li surl='"+surl0+"'>产品上架通知</li><li surl='"+surl2+"'>产品信息变动</li><li surl='"+surl5+"'>日历价格变动</li>");
            var _this=$(this);
            meituan_notice_box.css({
                "top":_this.offset().top+22,
                "left":_this.offset().left-22
            }).show(100);
            // $.ajax(
            //     type:'POST',url: surl,data: typeData, dataType:'json',
            // }).done(function(res) {
            //     if(res.code==200){
            //         alert("修改通知成功");
            //         //PFT_GLOBAL.U.Alert("success",'<p style="width:120px">修改通知成功</p>');
            //     }
            //     else{
            //         alert(res.describe);
            //         //PFT_GLOBAL.U.Alert("fail",'<p style="width:450px">'+res.describe+'</p>');
            //     }
            // })
            return false;

        })
        $(".meituan_notice_box li").live("click",function () {
            var turl=$(this).attr("surl");
            $.ajax({
                url: turl,    //请求的url地址
                dataType: "json",   //返回格式为json
                async: true, //请求是否异步，默认为异步，这也是ajax重要特性
                data: { },    //参数值
                type: "post",   //请求方式
                beforeSend: function() {
                    //请求前的处理
                },
                success: function(res) {
                   if(res!==null){
                       //请求成功时处理
                       if(res.code==200){
                           alert("修改通知成功");
                           //PFT_GLOBAL.U.Alert("success",'<p style="width:120px">修改通知成功</p>');
                       }
                       else{
                           alert(res.describe);
                           //PFT_GLOBAL.U.Alert("fail",'<p style="width:450px">'+res.describe+'</p>');
                       }
                   }else{
                        alert("未返回任何数据");
                    }

                },
                complete: function() {
                    //请求完成的处理
                },
                error: function() {
                    //请求出错处理
                }
            });
        })
        $(document).live("click",function () {
            $(".meituan_notice_box").hide()
        })

        function getAllinfo(){
            var qtip = $(".conf_type").attr("qtip");     // 0全部 1已绑定 2 未绑定
            var type = $(".conf_type").val();     // 0去哪儿 1美团 2 百度
            var conSelect= Number($("#conSelect").val());
            if(qtip==0){
                var url = "getAllInfo";
            }else if(qtip==1){
                var url = "getUseInfo";
            }else{
                var url = "getUnuseInfo";
            }
            var params ={
                "api" : "route/index.php?c=qunaer_getQunaer&a="+url,
                "type" : "1",
                "thp" : "s",
                "DockingMode" : type,
                "cooperation_way" : conSelect
            }
            ajax.getList(params,{
                success : function(res){
                    list(res.data);
                    $("#qunaer_select").show();
                },
                fail : function(mgs){
                    alert(mgs);
                }
            })


        }

        function list(res){
            $("#prodList").html("");
            var list = res.list;
            for(var i=0;i<list.length;i++){
                $("#prodList").append("<li data="+list[i].id+">"+list[i].title+"</li>");
            }
        }



        function search(id){
            var conf_type= Number($(".conf_type").val());
            if(conf_type==1){
                var conSelect = "1";
                var hand_on_single = $(".meiSelect").val();
            }else{
                var conSelect= Number($("#conSelect").val());
            }
            var params ={
                //"api" : "route/index.php?c=qunaer_getQunaer&a=getSearch",
                "api" : "qunaerNew.php",
                "type" : "3",
                "lid" : id,
                "conf_type" : conf_type,
                "hand_on_single" : hand_on_single,
                "conSelect" : conSelect
            }
            ajax.getList(params,{
                success : function(res){
                    fillSearch(res,conf_type);
                },
                fail : function(mgs){
                    alert(mgs);
                }
            })
        }

        function fillSearch(res,conf_type){
            var title = $(".serspan").html();
            var str="";
            var list = res.lists;
            str+='<tr class="searchTip">';
            str+='  <td colspan="4">';
            str+='      <div class="searchInput">';
            str+='          <span class="sei"></span>';
            str+='          <img class="searchIcon" src="http://static.12301.cc/images/icons/searchIcon.png">';
            str+='          <span class="scloseIcon closeR" style="display:none"></span>';
            str+='          <span class="serspan">请搜索或选择产品</span>';
            str+='          <input type="text" class="onBlurInput inBin" value="" />';
            str+='      </div>';
            str+='  </td>';
            str+='</tr> ';
            if(list && list.length > 0){
                for(var i in list){
                    str+='<tr class="group_2">';
                    str+='  <td class="col1">';
                    str+='      <a target="_blank" href="javascript:void(0);" tid="'+list[i]['tid']+'" aid="'+list[i]['aid']+'" lid="'+list[i]['lid']+'" class="colorBlue idNum add_'+list[i]['tid']+'"></a>';
                    str+='  </td>';
                    str+='  <td class="col2">';
                    str+='      <span>'+title+'</span>';
                    str+='  </td>';


                    str+='  <td class="col3" title="">'+list[i]['ttitle']+'</td>';

                    console.log(conf_type);
                    if(conf_type == 1){
                        if(list[i]["third_part_teamwork_id"]){
                            str+='  <td class="wwid col4">';
                            str+='      <span>'+list[i]["third_part_teamwork_id"]+'</span>';
                            str+='  </td>';
                        }else{
                            str+='  <td class="wwid col4">';
                            // str+='      <span>'+list[i]["third_part_teamwork_id"]+'</span>';
                            str+='  </td>';
                        }
                        
                    }

                    str+='  <td class="col5">';
                    str+='      <a class="aList statusIdc" href="javascript:void(0)" bid_a="'+list[i]['bid_a']+'" bid_b="'+list[i]['bid_b']+'" bid_c="'+list[i]['bid_c']+'" bind_a="'+list[i]['bind_a']+'" bind_b="'+list[i]['bind_b']+'" bind_c="'+list[i]['bind_c']+'"></a>';
                    str+='      <a class="aList changeM" style="display:none"  bid_b="'+list[i]['bid_b']+'" bind_b="'+list[i]['bind_b']+'" href="javascript:void(0);">修改通知</a>';
                    str+='  </td>';
                    str+='</tr>';
                    
                }
                if(conf_type == 1 && $(".col4.bindId").length == 0 ){
                    $('<th class="col4 bindId">虚拟产品编号</th>').insertAfter(".col3.after");
                }
            }else{

                str+='<tr class="group_2">';
                str+='  <td colspan="4" style="text-align:center;">抱歉暂无分销价格';
                str+='  </td>';
                str+='</tr> ';
            }

            $(".groupItem").html(str);
            $(".serspan").html(title);
            if(conf_type == 1){
                $(".searchTip").find("td").attr("colspan","5");
            }
            statusInfo();

        }

        function statusInfo(){
            var hasClass = $(".conf_type").val();  //去哪儿:0 ;美团v1 v2:1 ; 百度:2
            var qtip = $(".conf_type").attr("qtip");  //全部:0 ;已绑定:1 ; 未绑定:2
            if(hasClass==0){
                $(".idNum").each(function(){
                    var tid = $(this).attr("tid");
                    var aid = $(this).attr("aid");
                    $(this).html(tid+'_'+aid);
                })
            }else if(hasClass==1){
                $(".idNum").each(function(){
                    var tid = $(this).attr("tid");
                    var aid = $(this).attr("aid");
                    var lid = $(this).attr("lid");
                    $(this).html(aid+'|'+lid+'|'+tid);
                })
            }else{
                $(".idNum").each(function(){
                    var tid = $(this).attr("tid");
                    var aid = $(this).attr("aid");
                    var lid = $(this).attr("lid");
                    $(this).html(aid+'|'+lid+'|'+tid);
                })
            }
            if(hasClass==0){
                var t = "a";
            }else if(hasClass==1){
                var t = "b";
            }else{
                var t = "c";
            }
            $(".statusIdc").each(function(){
                var bind = $(this).attr("bind_"+t);
                var bid = $(this).attr("bid_"+t);
                if(qtip==0){
                    if(bind==1){
                        $(this).html("解除绑定");
                        $(this).attr("remove",bid);
                        $(this).addClass("remove_"+bid);
                        $(this).addClass("removeC");
                        if(t=="b"){
                            $(this).parent().find(".changeM").show();
                            var idNum = $(this).parent().parent().find(".idNum").html();
                            var url1 = "module/api/api_product_changenotice/Product_change_notification.php?action=CreateNewTicket&status=2&ids=";
                            var url2 = hex_md5("CreateNewTicket"+idNum);
                            var url = url1+idNum+"&sign="+url2;
                            $(this).parent().find(".changeM").attr("tyurl",url);
                        }
                    }else{
                        $(this).html("绑定");
                        $(this).addClass("addC");
                    }
                }else if(qtip==1){
                    if(bind==1){
                        $(this).html("解除绑定");
                        $(this).attr("remove",bid);
                        $(this).addClass("remove_"+bid);
                        $(this).addClass("removeC");
                        if(t=="b"){
                            $(this).parent().find(".changeM").show();
                            var idNum = $(this).parent().parent().find(".idNum").html();
                            var url1 = "module/api/api_product_changenotice/Product_change_notification.php?action=CreateNewTicket&status=2&ids=";
                            var url2 = hex_md5("CreateNewTicket"+idNum);
                            var url = url1+idNum+"&sign="+url2;
                            $(this).parent().find(".changeM").attr("tyurl",url);
                        }
                    }else{
                        $(this).parent().parent().remove();
                    }
                }else{
                    if(bind==1){
                        $(this).parent().parent().remove();
                    }else{
                        $(this).html("绑定");
                        $(this).addClass("addC");
                    }

                }
            })
        }

        function getInfoTab(type){
            var set,con;
            var conf = $(".conf_type");
            $(".Identity").val(null);
            $(".sign").val(null);
            
            switch(type)
            {
                case "1":
                    set = "0";
                    conf.val("0");
                    fillSuperInfo(quTsf,quTss,quTsp,quTsp)
                    $(".mei_supplir").show();
                    $(".supplemeiS").hide();
                    break;
                case "3":
                    set = "1";
                    con = "1";
                    conf.val("1");
                    fillSuperInfo(quTsf,quTss,meiTsp,meiTsb)
                    $(".mei_supplir").hide();
                    $(".supplemeiS").show();
                    break;
                default:
                    set = "2";
                    conf.val("2");
                    fillSuperInfo(baiTsp,baiTss,baiTs,baiTsa)
                    $(".mei_supplir").hide();
                    $(".supplemeiS").hide();
            }
            var params ={
                "api" : saveURL,
                "set_conf" : set,
                "type" : "0",
                "conSelect" : con
            }
            ajax.getList(params,{
                success : function(res){
                    fillInfo(res);
                    setTimeout(function () {
                        $(".group_2").hide();
                        $("#qunaer_select").hide();
                        if( type != 2 || type != 3){
                            $(".col4.bindId").remove();
                        }
                    },500);
                },
                fail : function(mgs){
                    alert(mgs);
                }
            })
        }
        function fillInfo(res){
            $(".Identity").val(res.supplierIdentity);
            $(".sign").val(res.signkey);
            var typeo = res.signkey;
            if(!typeo){
                $(".supplir_tod").removeClass("free");
                $(".supplir_tod").attr("readOnly",null);
            }else{
                $(".supplir_tod").addClass("free");
                $(".supplir_tod").attr("readOnly","readonly");
            }
        }
        function fillSuperInfo(a,b,c,d){
            $(".first").text(a);
            $(".secend").text(b);
            $(".qu_supplia").text(c);
            $(".qu_supplib").text(d);
        }
    };
    var ajax = {
        fn : new Function,
        AJAX_TIMEOUT : "请求超时，请稍后重试",
        AJAX_XMLERROR : "传输格式有误，请稍后重试",
        AJAX_SERVERERROR : "请求出错，请稍后重试",
        getList : function(params,callbacks){
            var that = this;
            var api = params.api;
            var fn = new Function;
            var type = params.type;
            var conf = $(".conf_type").val();
            if(type==0){
                var params = {
                    "set_conf" : params.set_conf ,
                    "conSelect" : params.conSelect
                }
            }else if(type==1){
                if(conf!=1){
                    var params = {
                        "DockingMode" : params.DockingMode,
                        "cooperation_way" : params.cooperation_way
                    };
                }else{
                    var params = {
                        "DockingMode" : params.DockingMode,
                        "cooperation_way" : "1"
                    };
                }
            }else if(type==2){
                var params = {
                    "id" : params.id
                }
            }else{
                if(params.conf_type==1){
                    var params = {
                        "lid" : params.lid,
                        "conf_type" : params.conf_type,
                        "conSelect" : params.conSelect,
                        "hand_on_single" : params.hand_on_single,
                        "act" : "ticket"
                    }

                }else{
                    var params = {
                        "lid" : params.lid,
                        "conf_type" : params.conf_type,
                        "conSelect" : params.conSelect,
                        "act" : "ticket"
                    }
                }
            }

            var success = callbacks.success || fn;
            var fail = callbacks.fail || fn;
            $("#qunaer_select").hide();
            $("#mask").show();
            $(".gloading_gif").show();
            $.ajax({
                url :api,
                type : "POST",
                dataType : "json",
                data : params,
                timeout : 60000,
                beforeSend:function(){},
                success : function(res){
                    var status = res.status;
					if(res.code == 102) {
						alert("抱歉您尚未登陆或登入超时");
						window.location.href="/home.html"; 
					}
                    if(status==200 || "success"){
                        success(res);
                        $("#mask").hide();
                        $(".gloading_gif").hide();
                        //$("#qunaer_select").show();
                    }else{
                        fail(res.msg)
                    }
					
                },
                error : function(XMLHttpRequest, textStatus, errorThrown){
                    switch(textStatus){
                        case "timeout":
                            alert(that.AJAX_TIMEOUT);
                            break;
                        case "error":
                            alert(that.AJAX_SERVERERROR);
                            break;
                        //default:
                        //alert(that.AJAX_XMLERROR);
                    }
                }
            })

        }
    }
    init();

})