/**
 * Created by Administrator on 2016/8/18.
 */
/**
 * Created with PhpStorm.
 * User: Administrator
 * Date: 14-1-16
 * Time: 下午4:01
 * Function:
 */
require("./index.scss");
var Dialog=require("COMMON/modules/dialog-simple");
var tpl=require("./index.xtpl");


var Dial=new Dialog({
    width : 500,
    closeBtn : true,
    content : tpl,
    drag : true,
    speed : 100,
    onCloseAfter : function(){
        $(".select_down_pages .pages_wrap .con").off("click.click_pages");
        $(".select_down_pages .btn_wrap .ok_btn").off("click.ok_down");
        $(".select_down_pages .btn_wrap .all_btn").off("click.down_all")
    }
});
/*定义iframe_name 的 index*/
window.iframe_name_index=0;




$(".search_form #search_kind a").click(function(){
    $("#act").val("");
    var key=$(this).attr("key");
    $("#"+key).val($(this).attr("kvalue"));
    $(".search_form").submit();
});
$(function(){
    $("#mem_list_tbd").on('dblclick','td', function(){
        if($(this).hasClass('td_dname')) {
            $(this).find('input.dname_input')
                .removeAttr('readonly')
                .addClass('edit_dname')
                .focus();
            return;
        }
        var tr = $(this).parent('tr');
        if(tr.hasClass('hightlight')) {
            tr.removeClass('hightlight');
        } else {
            tr.addClass('hightlight');
        }
    });
    var guid = 0;
    var save = function(){
        var data = {
            action:'DnameUpdate',
            dname:$("#uname").val(),
            com_name:$("#com_name").val(),
            com_type: $("#com_type").find('option:selected').val(),
            dcode: $("#dcode").val(),
            ast : $("#add_saler_type").find('option:selected').val(),
            jiutian_auth : $('input[name="jiutian_auth"]:checked').val(),
            refund_back : $('input[name="refund_back"]:checked').val(),
            group_id : $("#gloup_id").find('option:selected').val(),
            liandi : $('input[name="liandi"]:checked').val(),
            id: guid,
            account : $('input[name="account"]').val()
        };
//       console.log(data);return;
        if(guid>0 && $("#uname").val().length>0) {
            $.post('/call/jh_mem.php',data, function(res){
                alert(res.msg);
                if(res.status=='ok') {
//                    location.reload();
                }
            },'json');
        } else {
            alert("发生错误。企业名称不能为空。")
        }

    };
    $("#mem_list_tbd").on('click','a.edit', function(){
        guid = $(this).attr('data-id');
        var com_types = ['--请选择--','景区','酒店','旅行社','加盟门店','电商','团购网','淘宝/天猫','个人','其他'],
            astList = ['新建','搜索/新建'],
            uname = $("#editInfo_"+guid).find('span.dname').text(),
            com_name = $("#editInfo_c"+guid).find('span.com_name').text(),
            old_value = $("#editInfo_"+guid).find('span.com_type').text(),
            ast = parseInt($("#editInfo_"+guid).attr('data-ast'),10),
            dcode = $("#dcode_"+guid).text(),
            jt_acc = $(this).parent().next().text(),
            acc_right = parseInt($("#editInfo_"+guid).attr('data-jt-acc'),10),
            refund_back_z = parseInt($("#editInfo_"+guid).attr('data-refund_back'),10),
            group_id = parseInt($("#editInfo_"+guid).attr('data-group_id'),10),
            content = '<p>账号名称：<input class="pinput-txt" type="text" id="uname" value="' + $.trim(uname) + '" /></p>',
            account =  $("#editInfo_"+guid).next().next().text(),
            options = '',
            options2 = '',
            terminal_search = parseInt($("#editInfo_"+guid).attr('data-terminal-search'), 10);
        for(var i=0;i < com_types.length;i++) {
            options += '<option value="'+com_types[i]+'"'+
                (com_types[i]==old_value? 'selected="selected"':'')+'>'+com_types[i]+'</option>';

        }
        for(var j=0;j < astList.length;j++) {
            options2 += '<option value="'+j+'"'+
                (j==ast ? 'selected="selected"':'')+'>'+astList[j]+'</option>';

        }

        content += '<p>企业名称：<input class="com-txt" type="text" id="com_name" value="' + $.trim(com_name) + '"  /></p>';
        content += '<p>企业类型：<select id="com_type">'+options+'</select></p>';
        content += '<p>接口编码：<input class="pinput-txt" type="text" id="dcode" value="'+dcode+'"></p>';
        content += '<p>添加分销：<select id="add_saler_type">'+options2+'</select></p>';
        if(jt_acc=='供应商'){
            content += '<p>绑定闸机权限：<input type="radio"  name="jiutian_auth" value="1" '+(acc_right==1?'checked':'')+'/>允许';
            content += '<input type="radio"  name="jiutian_auth" value="0" '+(acc_right==0?'checked':'')+'/>禁止</p>';
            content += '<p>终端查询权限：<input type="radio"  name="liandi" value="1" '+(terminal_search==1 ? 'checked':'')+'/>开启';
            content += '<input type="radio"  name="liandi" value="0" '+(terminal_search==0? 'checked':'')+'/>关闭</p>';

            // content += '<p>自助机查询订单权限：<input type="radio"  name="self-help" value="1"/>开启';
            // content += '<input type="radio"  name="self-help" value="0"/>关闭</p>';

            content += '<p>分销商/散客退款设置：<input type="radio"  name="refund_back" value="1" '+(refund_back_z==1?'checked':'')+'/>支付宝';
            content += '<input type="radio"  name="refund_back" value="0" '+(refund_back_z==0?'checked':'')+'/>资金账户</p>';
        }
        content += '<p>帐号类型：<select name="group_id" id="gloup_id">';
        content += '<option value ="1" '+(group_id==1?'selected="selected"':'')+'">普通帐号</option>';
        content += '<option value ="6" '+(group_id==6?'selected="selected"':'')+'">签约帐号</option>';
        content += '<option value ="2" '+(group_id==2?'selected="selected"':'')+'">测试帐号</option>';
        content += '<option value ="3" '+(group_id==3?'selected="selected"':'')+'">内部点餐帐号</option>';
        content += '<option value ="4" '+(group_id==4?'selected="selected"':'')+'">云顶帐号</option>';
        content += '<option value ="5" '+(group_id==5?'selected="selected"':'')+'">鼓浪屿帐号</option>';
        content += '<input name="account" type="hidden" value="'+account+'"/>';
        content += '</select></p>';
        easyDialog.open({
            container : {
                header : '信息修改',
                content : content,
                yesFn : save,
                noFn : true
            }
        });
    });

    //联盟
    $("#mem_list_tbd").on('click','a.alliance', function(){
        guid = $(this).attr('data-id');

        uname = $("#editInfo_"+guid).find('span.dname').text(),
            content = '<form class="alliance">';
        content += '<input type="hidden" name="action" value="transform" />';
        content += '<input type="hidden" name="memberID" value="'+guid+'" />';
        content += '<p>联盟名称：<input class="pinput-txt" type="text" value="' + $.trim(uname) + '"  name="alliName"/></p>',
            // 平台|供应商|盟主|省代|市代|上级邀请人|邀请人
            content += '<p>利润比例：平台<input class="pinput-txt_b" type="text" name="profit_a" value="15">% 供应商<input class="pinput-txt_b" type="text" name="profit_b" value="20">% 联盟<input class="pinput-txt_b" type="text" name="profit_x">% 邀请人<input class="pinput-txt_b" type="text" name="profit_y">% </p>';
        content += '<p>联盟分配：盟主<input class="pinput-txt_b" type="text" name="profit_c" value="25">% 省代理<input class="pinput-txt_b" type="text" name="profit_d" value="15">% 市代理<input class="pinput-txt_b" type="text" name="profit_e" value="10">% </p>';
        content += '<p>邀请人分配：上级邀请人<input class="pinput-txt_b" type="text" name="profit_f" value="10">% 邀请人<input class="pinput-txt_b" type="text" name="profit_g" value="5">%</p>';
        // content += '<p><h4>（盟主：代理商：邀请人）</h4></p>';
        content +='</form>';
        // console.log(content);
        easyDialog.open({
            container : {
                header : '转化联盟',
                content : content,
                yesFn : function(){
                    var data = $(".alliance").serialize();
                    $.getJSON('../call/jh_alliance.php',data,function(json){
                        if(json.code!=100){
                            alert(json.msg);
                            return false;
                        }
                        alert(json.msg);
                        window.location.reload();
                    });
                },
                noFn : true
            }
        });
    });
    // 账号删除
    $("#mem_list_tbd").on("click",".del_account",function(){
        if(confirm("删除账号将清空手机号并把账号删除，无法使用，确定这么做吗?")){
            var params = {action:'clearAccount', mid:$(this).attr("data-mid")};
            $.post("/call/jh_mem.php", params, function(res){
                alert(res.msg);
                window.location.reload();
            },'json');
        }else{
            // alert("取消删除");
        }
    });
    // 重置密码
    $("#mem_list_tbd").on("click",".reset_password",function(){
        if(confirm("是否重置此账号密码为【pft@12301】？")){
            var params = {action:'resetPassword', mid:$(this).attr("data-mid")};
            $.post("/call/jh_mem.php", params, function(res){
                alert(res.msg);
            },'json');
        }
    });
    $("#mem_list_tbd").on('blur','input.dname_input', function(){
        $(this).attr('readonly','readonly').removeClass('edit_dname');
    });
    $("#ExcelBtn").on('click',function(){
        //$("#act").val("loadExcel");
        //$(".search_form ").submit();

        var totalPage = 1;
        var size;

        //先获取总的页数
        $("#act").val("startloadExcel");
        var params = $('.search_form').serialize();
        $.ajax({
            'url'       : window.location.href,
            'method'    : 'get',
            'data'      : params,
            // 'async'     : false,
            'dataType':'json',
            'success'   : function(res) {
                totalPage = res.pages;
                size=res.size;
                if(totalPage == 1) {
                    //直接导出
                    $("#act").val('loadExcel');
                    $("#excel_page").val(1);
                    $(".search_form ").submit();
                } else {

                    /*渲染页码弹出层部分*/
                    var okBtn=$(".select_down_pages .btn_wrap .ok_btn");//下载该页按钮
                    var down_all_btn=$(".select_down_pages .btn_wrap .all_btn");//下载全部 的按钮

                    var pageCon= $(".select_down_pages .pages_wrap .con");
                    pageCon.html("");//清空页码容器
                    var html="";
                    for(var i=1;i<=totalPage;i++){
                        html+='<div class="page no_down" index="'+i+'">'+i+'</div>'
                    }
                    pageCon.html(html);
                    $(".select_down_pages .btn_wrap .lt").text('*共计 '+totalPage+' 页，每页有 '+size+' 条数据');
                    down_all_btn.addClass("clickable");
                    okBtn.addClass("clickable");
                    down_all_btn.removeClass("notclick");
                    okBtn.removeClass("notclick");
                    $(".select_down_pages .pages_wrap .con .no_down").eq(0).addClass("active");//给未下载的第一个页码添加active类
                    /*打开页码弹出层*/
                    Dial.open();

                    /*页码弹出层事件监听部分*/
                    var cur_page;
                    pageCon.on("click.click_pages",".no_down",function(){
                        $(".select_down_pages .pages_wrap .con .no_down").removeClass("active");
                        cur_page=$(this);
                        $(this).addClass("active")
                    });
                    okBtn.on("click.ok_down",function () {
                        var excel_page=$(".select_down_pages .pages_wrap .con .active").attr("index");
                        if(!excel_page){
                            down_all_btn.removeClass("clickable");
                            okBtn.removeClass("clickable");
                            down_all_btn.addClass("notclick");
                            okBtn.addClass("notclick");
                        }else{
                            // console.log(cur_page.attr("index"));
                            cur_page=$(".select_down_pages .pages_wrap .con .active");
                            cur_page.removeClass("no_down");
                            cur_page.addClass("downed");
                            cur_page.removeClass("active");
                            downFile(excel_page);
                            $(".select_down_pages .pages_wrap .con .no_down").eq(0).addClass("active");//给未下载的第一个页码添加active类

                            excel_page=$(".select_down_pages .pages_wrap .con .active").attr("index");
                            if(!excel_page){
                                down_all_btn.removeClass("clickable");
                                okBtn.removeClass("clickable");
                                down_all_btn.addClass("notclick");
                                okBtn.addClass("notclick");
                            }
                        }
                    });
                    down_all_btn.on("click.down_all",function(){
                        var no_down=$(".select_down_pages .pages_wrap .con .no_down");
                        no_down.removeClass("no_down");
                        no_down.removeClass("active");
                        no_down.addClass("downed");

                        down_all_btn.removeClass("clickable");
                        okBtn.removeClass("clickable");
                        down_all_btn.addClass("notclick");
                        okBtn.addClass("notclick");
                        

                        okBtn.off("click.ok_down");
                        for(var i=0;i<no_down.length;i++){
                            var excel_page=no_down.eq(i).attr("index");
                            downFile(excel_page)
                        }
                    });
                    function downFile(excel_page) {
                        window.iframe_name_index++;
                        console.log( window.iframe_name_index);
                        var iframe_name="iframe"+ window.iframe_name_index;
                        var iframe_html=' <iframe class="iframe_down" name="'+iframe_name+'"></iframe>';
                        $(".select_down_pages .iframe_wrap").append(iframe_html);
                        $("#excel_page").val(excel_page);
                        $("#act").val('loadExcel');
                        var params = $('.search_form').serialize();
                        params += '&show_page=1';
                        var downloadUrl = window.location.href + '?' + params;
                        window.open(downloadUrl, iframe_name);
                    }
                }

            }
        });

        //分页去导出数据
        // for($i = 1; $i <= totalPage; $i++) {
        //     $("#excel_page").val($i);
        //     $("#act").val('loadExcel');
        //     console.log($i);
        //     $(".search_form").submit();
        // }
    });
    $("#searchBtn").click(function(){
        $("#act").val("")  ;
        $(".search_form").submit();
    });
    $("#mem_list_tbd").on('click', 'a.verify', function(){
        if(!confirm('您确定要执行此操作？')) return;
        var status = $(this).attr('data-status'),
            parent_obj = $(this).parent('td'),
            mid = parent_obj.siblings('td.mid').attr('data-mid'),
            params = {action:'SetMemStatus', status:status, mid:mid};
        $.post("/call/jh_mem.php", params, function(res){
            alert(res.msg);
            if(res.status=='ok') {
                parent_obj.siblings('td.status').html(res.body);
            }
        },'json');
    });
    $('#mem_list_tbd').on('click','a.saleID',function(e){
        var d_this = $(e.currentTarget);
        var union_id   = d_this.parent().siblings('.mid').attr('data-mid');
        $("input[name='z_salesID']")[0].value=union_id;
        $(".black").css({
            "width":$(window).width()+"px",
            "height":$(window).height()+"px",
            "display":"block"
        });
        PFT_GLOBAL.G.Ajax({
            url : "../module/zax/admin_report/call.php",
            data : {action:'get_salesID',fid:union_id},
            type :'POST',
            timeout : function(){console && console.log("获取数据超时")},
            serverError : function(){console &&
            console.log("接口出错:module/zax/admin_report/call.php?get_saleID")}
        },function(res){
            $("#salesID>option" ).each(function() {
                if($(this)[0].value==res.salesID){
                    $(this).attr('selected','selected');
                    return false;
                }
            })
            $("#kefuID>option" ).each(function() {
                if($(this)[0].value==res.kefuID){
                    $(this).attr('selected','selected');
                    return false;
                }
            })
//            res.protocal_start = '2015-12-20';
//            res.protocal_end   = '2015-12-31';
//            res.protocol_main  = '年费9800,协议截止日期为2016年12月31日';
            $("#protocol_start").val(res.protocol_start);
            $("#protocol_end").val(res.protocol_end);
            $("#protocol_main").val(res.protocol_main);
            $("#protocal_meal").val(res.protocal_meal);
            $(".alert_box").css("display","block");
        })
    })
    $(".click_close_addqd,.cancel_addqd").click(function(){
        $(".alert_box_addqd").css("display","none");
        $(".black_addqd").css("display","none");
    })

    $('#mem_list_tbd').on('click','a.saleIDAdd',function(e){
        $(".alert_box_addqd").css("display","block");
    })
    $(".click_close,.cancel").click(function(){
        $(".alert_box").css("display","none");
        $(".black").css("display","none");
    })
    $(".save").click(function(){
        var union_id = $("input[name='z_salesID']")[0].value,
            salesID = $("#salesID>option:selected")[0].value,
            kefuID = $("#kefuID>option:selected")[0].value,
            protocal_start = $("#protocol_start").val(),
            protocal_end   = $("#protocol_end").val(),
            protocol_main  = $("#protocol_main").val();
        protocal_meal  = $("#protocal_meal").val();
        PFT_GLOBAL.G.Ajax({
            url : "../module/zax/admin_report/call.php",
            data : {
                action:'single_salesID',
                fid:union_id,
                salesID:salesID,
                kefuID:kefuID,
                protocal_start:protocal_start,
                protocal_end:protocal_end,
                protocol_main:protocol_main,
                protocal_meal:protocal_meal
            },
            type :'POST',
            timeout : function(){console && console.log("获取数据超时")},
            serverError : function(){console &&
            console.log("接口出错:module/zax/admin_report/call.php?single_salesID")}
        },function(res){
            if(res.sta=='suc')
                PFT_GLOBAL.U.Alert("success",'<p style="width:120px;">设置成功</p>');
            else
                PFT_GLOBAL.U.Alert("fail",'<p style="width:120px;">设置失败</p>');
            $(".alert_box").css("display","none");
            $(".black").css("display","none");
        })
    })

    $(".save_addqd").click(function(){
        var sale = $("#addnewSale").val(),
            deleteId = $("#hasSalesID>option:selected")[0].value;
        account = $("#newSaleAccount").val();
        PFT_GLOBAL.G.Ajax({
            url : "../module/zax/admin_report/call.php",
            data : {
                action:'sale_change',
                sale:sale,
                deleteId:deleteId,
                account:account,
            },
            type :'POST',
        },function(res){
            if(res.code==0)
                PFT_GLOBAL.U.Alert("fail",'<p style="width:120px;">您未进行任何操作</p>');
            else
                PFT_GLOBAL.U.Alert("success",'<p style="width:120px;">'+ res.msg +'</p>');
            $(".alert_box_addqd").css("display","none");
            $(".black_addqd").css("display","none");
            location.reload();
        })
    })

    //设置对接系统
    $(".csysbox").on("click",".csys_save",function(){
        var i=0
        var csysid=new Array()
        $('#select_id2').find('li').each(function(){
            csysid[i++]=$(this).find('.csys_sys').val()
        })
        if(confirm("确认对接吗？")){
            var params = {action:'setCsys', mid:$(".connectSys").val(),csys:csysid};
            $.post("/call/jh_mem.php", params, function(res){
                alert(res.msg);
                if(res.status=="success"){
                    $('.alertBg').hide()
                    $('.csysbox').hide()
                }
            },'json');
        }
    });

    //取消对接系统的配置
    $(".csysbox").on("click",".cancel",function(){
        $('.alertBg').hide()
        $('.csysbox').hide()
    });

    //显示对接极其没有对接的系统
    $('#mem_list_tbd').on('click','a.CsysID',function(){
        $('.alertBg').show()
        $('.csysbox').show()
        var html_con='';
        var html_ncon='';
        var aid = $(this).parent().siblings('.mid').attr("data-mid");
        var params = {action:'showCsys', mid:aid};
        $.post("/call/jh_mem.php", params, function(res){
            for(var i in res['connect']){
                html_con +='<li>'+res['connect'][i]['name']+'<input class="connect_val" type="hidden" value="'+res['connect'][i]['id']+'"></li>';
            }
            html_con +='</ul>';
            for(var i in res['noconnect']){
                html_ncon +='<li>'+res['noconnect'][i]['name']+'<input class="csys_sys" type="hidden" value="'+res['noconnect'][i]['id']+'"></li>';
            }
            html_ncon+='<input class="connectSys" type="hidden" value="'+aid+'">'
            $('#select_id').html(html_con);
            $('#select_id2').html(html_ncon);
        },'json');
    })
});