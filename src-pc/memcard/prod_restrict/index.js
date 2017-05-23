/**
 * Created by Administrator on 2017/4/28.
 */
require("./index.scss");
var renderNav = require("../common/nav/index.js");
$(function () {
    renderNav("1" , ".wrapper_box .header_restrict .title")
});

//以下代码都是旧代码搬过来的

var CONFIG = {
    GET_AREA_DEFAULT_ID : 12, //城市搜索控件默认选中福建省
    provinces : null
};
var G = {
    is : (function(){
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
            (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
                (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                    (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                            (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
        return Sys
    })()
};
var S = (function(){
    var CacheAreas = {};
    var seah_inp_text = "点击搜索产品";
    function init(callback){
        var pselect = $("#provSelect");
        var cselect = $("#citySelect");
        var dselect = $("#conSelect");
        var serhInp = $("#serhInp");
        var s = G.is.ie;
        serhInp.val(seah_inp_text).on("focus",function(e){
            var t = $(e.target);
            t.addClass("onfocus");
            if(!s || parseFloat(s)>8){
                if(t.val() == seah_inp_text){
                    t.val("");
                }
            }
        }).on("blur",function(e){
            var t = $(e.target);
            t.removeClass("onfocus");
            if(!s || parseFloat(s)>8){
                if(t.val() == ""){
                    t.val(seah_inp_text);
                }
            }
        }).on("input propertychange",function(e){
            filter($(e.target))
        })
        //ie6 7 8不支持input事件 用onpropertychange
        /*if(s && parseFloat(s)<9){
         document.getElementById('serhInp').attachEvent('onpropertychange',function(e) {
         if(e.propertyName.toLowerCase()!='value') return;
         filter($(e.srcElement));
         });
         } */
        $("#provSelect").change(function(e){
            List.loading();
            var val = $(e.target).val();
            var data;
            if(val == "00"){
                data = List.getData(1);
                List.buildData(data);
                cselect.empty();
                cselect.append('<option value="00">全部</option>');
                return;
            }else{
                data = List.getData("search",function(odata){
                    var data = {};
                    for(var i in odata){
                        var provid = odata[i]["areas"][0];
                        if(val == provid){
                            data[i] = odata[i];
                        }
                    }
                    return data;
                })
                List.buildData(data,"search");
            }
            if(CacheAreas[val] && CacheAreas[val]["citys"]){
                cselect.empty();
                cselect.append('<option value="00">全部市(区)</option>')
                for(var cid in CacheAreas[val]["citys"]){
                    var c = CacheAreas[val]["citys"][cid];
                    select.append('<option value="'+cid+'">'+c.area_name+'</option>')
                }
            }else{
                getCity(val,function(cres,xtext){
                    if(typeof cres !== "string" && cres.length){
                        cselect.empty();
                        cselect.append('<option value="00">全部市(区)</option>');
                        CacheAreas[val]["city"] = {};
                        $.each(cres,function(index,data){
                            CacheAreas[val]["city"][data.area_id] = data.area_name;
                            cselect.append('<option value="'+data.area_id+'">'+data.area_name+'</option>')
                        })
                    }else{
                        alert("获取市级列表失败！")
                    }
                })
            }

        })
        $("#citySelect").change(function(e){
            List.loading();
            var val = $(e.target).val();
            var data = List.getData("search",function(odata){
                var data = {};
                for(var i in odata){
                    var cityid = odata[i]["areas"][1];
                    if(val == cityid){
                        data[i] = odata[i];
                    }
                }
                return data;
            })
            List.buildData(data,"search");
        })

    }

    function filter(target){
        var t = target;
        var val = t.val();
        //alert(val)
        var data = {};
        var cselect = $("#citySelect");
        var pselect = $("#provSelect");
        if(!val){
            data = List.getData(1);
            List.buildData(data);
            cselect.empty();
            cselect.append('<option value="00">全部</option>');
            pselect.find("option[value=00]").attr("selected",true);
            $("#conSelect").find("option[value=1]").attr("selected",true);
            return;
        }
        var cv = $("#conSelect").val();
        List.loading();
        data = List.getData("search",function(odata){
            var data = {};
            var prodTitle = "";
            var gys = "";
            var cv = "1";
            for(var i in odata){
                //alert(odata[i]);
                if(cv == "1"){ //搜景区
                    prodTitle = odata[i]["p_name"];
                    if(prodTitle.indexOf(val) == 0){
                        data[i] = odata[i]
                    }
                }
                // else{ //搜供应商
                // gys = odata[i]["apply_dname"];
                // if(gys.indexOf(val) == 0){
                // data[i] = odata[i]
                // }
                // }
            }
            return data;
        })
        List.buildData(data,"search");
    }


    return {
        init : init
    }

})();

var List = (function(){
    var AJAX_URL = "/r/product_MemberCardBasic/Lands";
    var oData = {};
    var oDataSize = 0;  //数据总数
    var currentPagesize = 1; //当前页数
    var totalpagesize = 0; //总页数
    var psize = 15; //默认分页每页15条
    var pageSwitchTimeout = 0.5 * 1000;
    var loading_html = PFT.Util.LoadingPc("努力加载中...",{
        tag : "div",
        height: 400
    })
    var saveBtn_otext = $("#saveToNext").text();
    function init(){
        getAll(function(){
            var data = getData(1);
            buildData(data);
            $("#pagenavW").on("click",".nextBtn",function(e){
                if(currentPagesize == totalpagesize){
                    alert("当前已是最后一页");
                    return false;
                }
                loading();
                setTimeout(nextpage,pageSwitchTimeout);
                return false;
            })
            $("#pagenavW").on("click",".prevBtn",function(e){
                if(currentPagesize == 1){
                    alert("当前已是第1页");
                    return false;
                }
                loading();
                setTimeout(prevpage,pageSwitchTimeout);
                return false;
            })
            $("#pagenavW").on("click",".cerPageBtn",whichpage);
            $("#pagenavW").on("keyup",".pageInp",function(e){
                var target = $(e.target);
                var oval = parseFloat(target.val()) || 0;
                if(e.keyCode == 13){
                    whichpage()
                }else if(e.keyCode == 38){//向上 +
                    if(oval == totalpagesize) return
                    target.val(oval+1);
                }else if(e.keyCode == 40){ //向下
                    if(oval == 1) return
                    target.val(oval-1);
                }
            });
            $("#pagenavW").on("focus",".pageInp",function(e){
                var inp = $(e.target);
                var btn = $("#cerPageBtn");
                inp.addClass("onfocus");
                btn.animate({"width":46});
            });
            $("#pagenavW").on("blur",".pageInp",function(e){
                var inp = $(e.target);
                var btn = $("#cerPageBtn");
                inp.removeClass("onfocus");
                btn.animate({"width":0});
            });
            $("#saveToNext").on("click",function(){
                $this = $(this);
                if($this.hasClass("disable")) return false;
                var oData = Count.getSelected();
                var dataArr = [];
                var prodCount = 0;
                for(var i in oData){
                    prodCount++;
                    var tickets = oData[i]["tickets"];
                    for(var s in tickets){
                        var json = {};
                        json["lid"] = i;
                        json["pid"] = s;
                        json["aid"] = tickets[s]["aid"];
                        json["num"] = tickets[s]["count"];
                        dataArr.push(json);
                    }
                }
                //if(prodCount<=1){
                //	alert("需两个或两个以上不同景区产品方可打包成套票");
                //	$this.text("提交保存进入下一页").removeClass("disable");
                //	return;
                //}
                $this.text("保存中...").addClass("disable");
                var d = _JSONstringify(dataArr);
                post({"package_data":d});
            })
            $("#titUl .tip").hover(function(){
                var of = $(this).offset();
                var set_left = -50;
                var set_top = 16;
                $("#tipW").show().css({"top":of.top+set_top,"left":of.left+set_left})
            },function(){
                $("#tipW").hide();
            })
            $("#tipW").mouseover(function(){$(this).show();})
            $("#tipW").mouseleave(function(){$(this).hide();})
        })


    }
    function getAll(callback){
        loading();
        $.ajax({
            url : AJAX_URL,
            type : "GET",
            dataType : "JSON",
            timeout : 15*1000,
            data : { },
            success : function(res){
                if(res && res.data.total>0){
                    oData = res.data.list;
                    oDataSize =  res.data.total;

                    //alert(oData)



                    totalpagesize = Math.ceil( res.data.total/psize); //计算总页数据有小数就整数部分加1
                    callback && typeof callback == "function" && callback();
                }else{
                    $("#mlistUl").html('<li style="height:200px; line-height:200px; text-align:center; font-size:12px; color:red;">无数据...</style>');
                }
            },
            error : function(xhr,textStatus){
                if(textStatus && textStatus == "timeout"){
                    if(xhr && xhr.abort && typeof xhr.abort == "function"){
                        xhr.abort();
                        alert("请求产品列表超时，请稍后重试。");
                        $("#mlistUl").html('<li style="height:200px; line-height:200px; text-align:center; font-size:12px; color:red;">请求产品列表超时，请稍后重试。</style>');
                    }
                }
            }
        })
    }
    function post(data){
        var result = data.package_data;
        var form = $("#resultForm");
        $("#formResult").val(result);
        //console.log(result)
        //return false;
        form.submit();

    }
    function prevpage(){ //上一页
        if(currentPagesize == 1) return;
        $("#pagenavW").find(".pageInp").val("");
        currentPagesize--;
        var data = getData(currentPagesize);
        buildData(data);
    }
    function nextpage(){ //下一页
        if(currentPagesize == totalpagesize) return;
        $("#pagenavW").find(".pageInp").val("");
        currentPagesize++;
        var data = getData(currentPagesize);
        buildData(data);
    }
    function whichpage(){
        var pageInp = $("#pagenavW").find(".pageInp");
        var val = pageInp.val();
        if(val<=0){
            alert("页数必须大于1");
            pageInp.val("");
        }else if(val>totalpagesize){
            alert("页数不能大于总页数");
            pageInp.val("");
        }else{
            loading();
            setTimeout(function(){
                currentPagesize = val;
                var data = getData(val);
                buildData(data);
            },pageSwitchTimeout);
        }
    }
    function loading(){
        $("#mlistUl").html(loading_html);
    }
    function getData(pageindex,filter){
        var begin = 0;
        var end = 0;
        if(pageindex == "search"){
            begin = 1;
            end = oDataSize;
        }else{
            begin = (pageindex-1) * psize + 1;
            end = pageindex * psize;
        }
        var odata = _getData(begin,end);
        var _data = {};
        if(filter && typeof filter == "function"){
            _data = filter(odata);
            return _data;
        }
        return odata;
    }
    function buildData(data,ifNav){
        var str = "";
        var area = null;
        var is_data_empty = true;
        var selectedData = Count.getSelected();
        //console.log(selectedData)
        str +=   '<thead>';
        str +=		 '<tr>';
        str +=			'<th class="align_left">产品名称</th>';
        str +=			'<th class="setwidth">每日限购次数</th>';
        str +=			'<th class="setwidth">每次限购票数</th>';
        str +=			'<th class="setwidth_a">购买间隔（分钟）</th>';
        str +=			'<th class="setwidth">操  作</th>';
        str +=		 '</tr>';
        str +=		'</thead>';
        str +=      '<tbody id="mlistUl_a" class="none_d">';
        str += 		'<td class="align_left" id="p_name"></td>';
        str += 		'<td id="day_num">0</td>';
        str += 		'<td id="ticket">0</td>';
        str += 		'<td id="time">0</td>';
        str += 		'<td><span class="edit" id="edit_id" >限制编辑</span></td>';
        str += 		'</tbody>';
        for(var i in data){
            is_data_empty = false;
            str +=      '<tbody id="mlistUl_a" data-sb=""">';
            str += 		'<td class="align_left" id="p_name">'+data[i]["p_name"]+'</td>';
            str += 		'<td id="day_num" class="day_num">'+data[i]["daily_buy_limit"]+'</td>';
            str += 		'<td id="ticket" class="ticket">'+data[i]["buy_num_limit"]+'</td>';
            str += 		'<td id="time" class="time">'+data[i]["buy_interval"]+'</td>';
            str += 		'<td><span class="edit" id="edit_id" data-daily_limit="'+data[i]["daily_buy_limit"]+'" data-interval="'+data[i]["buy_interval"]+'" data-num_limit="'+data[i]["buy_num_limit"]+'" data-p_name="'+data[i]["p_name"]+'" data-rid="'+data[i]["rid"]+'"   data-pid="'+data[i]["pid"]+'">限制编辑</span></td>';
            str += 		'</tbody>';


        }
        $("#mlistUl").html(str);
        $(".yujbtn").each(function(){
            var active = $(this).attr("data-active");
            if(active=="1"){
                $(this).addClass("onyuj");
            }
        });
        $(".day_num").each(function(){
            var active = $(this).html();
            //alert(active);
            if(active=="null"){
                $(this).html("不限");
            }
        });
        $(".ticket").each(function(){
            var active = $(this).html();
            if(active=="null"){
                $(this).html("不限");
            }
        });
        $(".time").each(function(){
            var active = $(this).html();
            if(active=="null"){
                $(this).html("不限");
            }
        });
        $(".day_num").each(function(){
            var active = Number($(this).html());
            //alert(active);
            if(active=="-1"){
                $(this).html("不限");
            }
        });
        $(".ticket").each(function(){
            var active = Number($(this).html());
            if(active=="-1"){
                $(this).html("不限");
            }
        });
        $(".time").each(function(){
            var active = Number($(this).html());
            if(active=="-1"){
                $(this).html("不限");
            }
        });

        setTimeout(function(){
            $("#mlistUl").children(":first").addClass("selected").find(".botW").slideDown();
        },200)
        if(oDataSize > psize && typeof ifNav == "undefined"){
            var w = $("#pagenavW");
            w.find(".curentpage").text(currentPagesize);
            w.find(".totalpage").text(totalpagesize);
            w.find(".totalItemSize .n").text(oDataSize);
            $("#pagenavW").show();
        }else{
            $("#pagenavW").hide();
        }
        if(is_data_empty){
            $("#mlistUl").html('<li style="height:200px; line-height:200px; text-align:center; font-size:12px; color:red;">无数据...</style>');
        }
    }
    function _getData(begin,end){ //在oData里从第几条取到第几条
        var data = {};
        var index = 0;
        if(begin-end>=0) return;
        //console.log("begin="+begin+" end="+end)
        for(var i in oData){
            index++;
            if(index>=begin && index<=end){
                data[i] = oData[i];
            }
        }
        return data;
    }

    function _JSONstringify(Json){
        var result = "";
        if(typeof JSON !== "undefined" && typeof JSON.stringify == "function"){
            result = JSON.stringify(Json);
        }else{
            result = jQuery.parseJSON(Json);
        }
        return result;
    }



    return {
        init : init,
        getData : getData,
        buildData : buildData,
        loading : loading
    }

})();


var Count = (function(){

    //数据缓存
    var oData = {

    };

    //存储dom元素，有多少存多少提高性能
    var listUl,seledUl,stotalW,total_gprice,total_lprice;
    var keyCode = {};
    function initDom(){ //存放所有初始化dom
        listUl = $("#mlistUl");
        seledUl = $("#seledUl");
        stotalW = $("#stotalW");
        total_gprice = $("#total_gprice");
        total_lprice = $("#total_lprice");
        saveBtn = $("#saveToNext");
    }

    //ui层
    var UI = {
        //初始化界面
        init : function(){
            var self = this;
            initDom(); //初始化第一第事就是初始化dom元素
            listUl.on("click",".topUl",function(e){
                var _t = $(e.target);
                if(_t.hasClass("ck") || _t.parent().hasClass("ck")) return;
                var target = $(this);
                var pLi = target.parent();
                var botW = pLi.find(".botW");
                if(botW.is(":animated")) return;
                if(botW.is(":visible")){
                    UI.slideUp(pLi);
                }else{
                    UI.slideDown(pLi);
                }
            })
            listUl.on("click",".slideUpBtn",function(e){
                var pLi = $(e.target).parents(".itemLi");
                UI.slideUp(pLi);
                return false;
            })
            listUl.on("click",".cbtn",function(e){
                var target = $(e.target);
                var p = target.parent();
                var inp = p.find(".numInp");
                var ov = parseFloat(inp.val());
                if(target.hasClass("addBtn")){
                    inp.val(ov+1);
                    UI.changeCount(target);
                }else if(ov>0){
                    inp.val(ov-1);
                    UI.changeCount(target);
                }
                return false;
            })
            listUl.on("keyup",".numInp",function(e){
                var keyCode = e.keyCode;
                var key = e.key;
                var target = $(e.target);
                var ov = parseFloat(target.val());
                //console.log(keyCode);
                if((keyCode == 40) && (ov>0)){ //下
                    target.val(ov-1);
                    UI.changeCount(target);
                }else if(keyCode == 38){ //上
                    target.val(ov+1);
                    UI.changeCount(target);
                }else if((keyCode>=96 && keyCode<=105) || (keyCode == 8) || (keyCode>=48 && keyCode<=57)){
                    UI.changeCount(target);
                }
            })
            listUl.on("blur",".numInp",function(e){
                var target = $(e.target);
                if(!target.val()){
                    target.val(0);
                }
            })
            listUl.on("hover",".level",function(){
                $(this).find(".select_list").show();
                //var selecth=$(".select_list").height();
                //selecth=selecth+48;
                //$(".container_e").css("height",selecth);
            },function(){
                $(this).find(".select_list").hide();
            });
            listUl.on("click",".select_list li",function(){
                var curTxt = $(this).text();
                $(this).addClass("current").siblings().removeClass("current");
                $(this).parent().siblings(".select_txt").text(curTxt);
                $(this).parent().hide();
            });

            listUl.on("toggle",".click_choose",
                function(){
                    $(this).css("background","#BABCB9");
                    $(this).find("div").addClass("on");
                    $(this).find(".operate_open").css("color","#BABCB9");
                    $(this).find(".operate_close").css("color","#FFFFFF");
                    $(this).parent().prevAll().css("color","#D8D8D8")
                    $(this).parent().prev(".operate_a").hide();
                },
                function(){
                    $(this).css("background","#35BA3B");
                    $(this).find("div").removeClass("on");
                    $(this).parent().prevAll().css("color","#000000")
                    $(this).parent().prev(".operate_a").show();
                    $(this).parent().prev(".operate_a").css("color","#2380AC")
                    $(this).find(".operate_open").css("color","#FFFFFF");
                    $(this).find(".operate_close").css("color","#35BA3B");
                }
            );
            //编辑限制条件
            listUl.on("click","#edit_id",function(e){
                var target = $(e.currentTarget);
                var targetParentTr = target.parents("tr")
                var inputData = [];
                var dayNumVal = targetParentTr.find(".day_num").text();
                var ticketVal = targetParentTr.find(".ticket").text();
                var timeVal = targetParentTr.find(".time").text();
                inputData.push(dayNumVal == '不限' ? '-1' : dayNumVal);
                inputData.push(ticketVal == '不限' ? '-1' : ticketVal);
                inputData.push(timeVal == '不限' ? '-1' : timeVal);
                //alert(target)
                var pid= target.data("pid");
                var rid= target.data("rid");
                var p_name= target.data("p_name");
                //var rid= "null";
                //alert(rid)
                if(rid==null&&"-1"){
                    var rid="0";
                }
                if(day_num=="-1"){
                    var day_num ="-1";
                    target.parents("#mlistUl_a").find("#day_num").html("-1");
                    $("#account_setting .day_num").val("-1");
                }
                if(ticket=="-1"){
                    target.parents("#mlistUl_a").find("#ticket").html("-1");
                    var day_num ="-1";
                }
                if(day_num=="-1"){
                    target.parents("#mlistUl_a").find("#time").html("-1");
                    var day_num ="-1";
                }
                content=   '<form id="account_setting" action="ddddd">';
                content+=  '<input type="hidden" name="pid" value="'+pid+'">';
                content+=  '<input type="hidden" name="rid" value="'+rid+'">';
                content+=   '<ul class="box_con">';
                content+=   	'<li>产品名称：<span class="title_pname" name="name" title="'+p_name+'">'+p_name+'</span></li>';
                content+=		'<li>每日限购次数：<input type="text" name="daily_limit" class="day_num" value="'+inputData[0]+'"></li>';
                content+=		'<li>每次限购票数：<input type="text" name="num_limit" class="ticket" value="'+inputData[1]+'"></li>';
                content+=		'<li>购买间隔（分钟）：<input type="text" name="interval" class="time" value="'+inputData[2]+'"></li> ';
                content+=		'<li style="text-align: right">“-1”表示不限</li> ';
                content+=	'</ul>';
                content+=	'</form>';
                easyDialog.open({
                    container : {
                        header : '编辑限制',
                        content : content,
                        yesFn :function(){
                            var day_num = $("#account_setting .day_num").val().replace(/\s+/,'');
                            var ticket = $("#account_setting .ticket").val().replace(/\s+/,'');
                            var time = $("#account_setting .time").val().replace(/\s+/,'');

                            if( !/^(\-1|[0-9]+)$/.test(day_num) || !/^(\-1|[0-9]+)$/.test(ticket) || !/^(\-1|[0-9]+)$/.test(time) ){
                                alert("请输入正整数或-1");
                                return false;
                            }

                            //alert(day_num)
                            var data = $("#account_setting").serialize();
                            $.post("call/jh_card.php?action=restrict",data,function(data){
                                if(data.status=='success'){
                                    alert(data.msg);
                                    target.parents("#mlistUl_a").find("#day_num").html(day_num == '-1' ? '不限' : day_num);
                                    target.parents("#mlistUl_a").find("#ticket").html(ticket == '-1' ? '不限' : ticket);
                                    target.parents("#mlistUl_a").find("#time").html(time == '-1' ? '不限' : time);
                                }
                                else{
                                    alert(data.msg);
                                }

                            },'json');

                        },
                        noFn : true
                    }

                });



            })

            seledUl.on("click","i.tnum",function(e){
                var target = $(e.target);
                var ov = target.text();
                target.hide();
                var inp = target.next();
                inp.show().focus();
            })
            seledUl.on("blur",".tk input.tnumInp",function(e){
                var target = $(e.target);
                if(target.val().length == 0){
                    target.hide().prev().show();
                    return;
                }
                var count = parseFloat(target.val());
                if(count<0){
                    target.hide().prev().show();
                    return;
                }
                var lp = target.parent();
                var ph = lp.parent().find(".tp");
                var pid = ph.find("input.pid").val();
                var pname = ph.find(".pname").text();
                var tid = lp.find("input.tid").val();
                var aid = lp.find("input.aid").val();
                var tname = lp.find(".tn").text();
                doData.change({
                    pid : pid,
                    pname : pname,
                    tid : tid,
                    tname : tname,
                    count : count
                })
                //console.log(oData)
                UI.reChange();
            })
        },
        changeCount : function(target){
            var pTr = target.parents("tr");
            var pBot = pTr.parents(".botW");
            var pid = pBot.parents(".itemLi").find(".topUl .pid").val();
            var pname = pBot.parents(".itemLi").find(".topUl .tcol_1").text();
            var tid = pTr.find("input.tid").val();
            var aid = pTr.find("input.aid").val();
            var tname = pTr.find(".tname").text();
            var gprice = pTr.find("i.tprice").text();
            var lprice = pTr.find("i.sprice").text();
            var count = pTr.find(".numInp").val();
            doData.change({
                pid : pid,
                pname : pname,
                tid : tid,
                tname : tname,
                count : count,
                gprice : gprice,
                lprice : lprice,
                aid : aid
            })
        },

    };

















    var oData = {

    };
    //操作oData
    var doData = {
        change : function(json){
            var pid = json.pid;
            var lvl = json.lvl;
            var pname = json.pname;
            var tid = json.tid;
            var tname = json.tname;
            var count = json.count;
            var gprice = json.gprice;
            var lprice = json.lprice;
            var aid = json.aid;
            var data = oData[pid];
            var ticket;
            var isEmpty = true;
            //console.log(oData)
            if(count != 0){
                if(data){ //若该产品已被选择
                    ticket = data.tickets[tid];
                    if(ticket){ //若已有票类存在
                        ticket.count = count;
                    }else{ //若不存在该票类(需新增该票类)
                        data.tickets = data.tickets || {};
                        data.tickets[tid] = {};
                        data.tickets[tid]["name"] = tname;
                        data.tickets[tid]["count"] = count;
                        data.tickets[tid]["gprice"] = gprice;
                        data.tickets[tid]["lprice"] = lprice;
                        data.tickets[tid]["aid"] = aid;
                    }
                }else{ //若该产品未被选择
                    oData[pid] = {};
                    oData[pid]["pname"] = pname;
                    oData[pid]["tickets"] = {};
                    oData[pid]["tickets"][tid] = {};
                    oData[pid]["tickets"][tid]["name"] = tname;
                    oData[pid]["tickets"][tid]["count"] = count;
                    oData[pid]["tickets"][tid]["gprice"] = gprice;
                    oData[pid]["tickets"][tid]["lprice"] = lprice;
                    oData[pid]["tickets"][tid]["aid"] = aid;
                }
            }else{
                if(!data) return;
                data.tickets[tid] = undefined;
                delete data.tickets[tid];
                for(var p in data.tickets){
                    isEmpty = false;
                }
                if(isEmpty){
                    oData[pid] = undefined;
                    delete oData[pid];
                }
            }
            //通知UI更新数据
            $(window).trigger("oData.change");
        }
    };

    function getSelected(){ //取得已选择的数据，用于模块间通信
        return oData;
    }

    $(window).on("oData.change",UI.change);

    return { init : UI.init, getSelected : getSelected}

})();


$(function(){
    S.init(function(){
        //List.init();
    });
    List.init();
    Count.init();
})

//重构
;(function(){

    var SelectData = {}; //存放已选择的数据
    var oData = {}; //存放ajax一次性抓取的list列表全部数据
    var cData = {}; //数据缓存
    var totalpagesize = 0; //list列表数据总页数
    var oDataSize = 0; //list列表数据总条数
    var sizeperpage = 5; //每页显示几条数据
    var AreaData = {}; //存放省份、市级信息
    var AjaxTimeout = 5 * 1000;
    var Urls = {
        //getAllProvs : "http://www.12301.cc/call/getAreas.php",
        getAllListData : "prod_restrict.html?lists=get"
    }
    var Obser = (function(){ //事件订阅/发布
        var obser = $({});
        function init(){

        }
        function trigger(eventname){
            obser.trigger(eventname)
        }
        return { init : init, trigger : trigger }
    })();

    var Ajaxor = (function(){

        //获得所有列表数据
        function getAllListData(){
            //loading();
            $.ajax({
                url : Urls.getAllListData,
                type : "GET",
                dataType : "JSON",
                timeout : AjaxTimeout,
                //data : { "sync" : "1" },
                success : function(res){
                    if(res && res.total>0){
                        oData = res.lists;
                        oDataSize = res.total
                        //totalpagesize = Math.ceil(res.total/psize); //计算总页数据有小数就整数部分加1
                    }else{
                        alert("无数据");
                    }
                },
                error : function(xhr,textStatus){
                    if(textStatus && textStatus == "timeout"){
                        if(xhr && xhr.abort && typeof xhr.abort == "function"){
                            xhr.abort();
                            alert("请求产品列表超时，请稍后重试。");
                        }
                    }else{
                        alert("请求产品列表出错");
                    }
                }
            })
        }

        function init(){
            getAllProvs();
        }

        return {
            init : init
        }

    })();

    var Filtor = (function(){
        function filtProv(data,provId){ //过滤出省
            var d = {};
            for(var i in data){
                var _provId = data[i]["areas"][0];
                if(_provId == provId){
                    d[i] = data[i];
                }
            }
            return d;
        }
        function filtCity(data,provId,cityId){ //过滤出省市
            var d = filtProv(data,provId);
            var _d = {};
            for(var i in d){
                var _cityId = d[i]["areas"][1];
                if(_cityId == cityId){
                    _d[i] = d[i];
                }
            }
            return _d;
        }
        function filtProdname(data,name){ //根据景区产品名称过滤
            var _d = {};
            for(var i in data){
                var title = data[i]["title"];
                if(title.indexOf(name) > -1 ){
                    _d[i] = data[i]
                }
            }
            return _d;
        }
        function filtapplyname(data,name){ //根据供应商名称过滤
            var _d = {};
            return _d;
        }
        return {
            filtProv : filtProv,
            filtCity : filtCity,
            filtProdname : filtProdname,
            filtapplyname : filtapplyname
        }
    })();
    //本地数据抓取器
    var Getor = (function(){
        function get(){
            var data = {};
            var args = arguments;
            if(args.length == 0){ //获取全部数据
                data = _get();
            }else if(typeof args[0] == "number" && args[0] !== 0){ //获取指定页数据(用于上一页下一页切换)
                var pageindex = args[0];
                var begin = (pageindex-1) * sizeperpage + 1;
                var end = pageindex * sizeperpage;
                data = _getData(begin,end);
            }else if(typeof args[0] == "object" && typeof args[1] == "number"){ //在指定数据包内抓取数据
                data = _getSubData(args[0],args[1]);
            }
            return data
        }
        function _getSubData(data,pageindex){
            var _d = {};
            var index = 0;
            var begin = (pageindex-1) * sizeperpage + 1;
            var end = pageindex * sizeperpage;
            for(var i in data){
                index++;
                if(index>=begin && index<=end){
                    _d[i] = data[i];
                }
            }
            return _d;
        }
        function _get(begin,end){
            var data = {};
            var index = 0;
            if(arguments.length == 0){
                data[i] = oData[i];
                dData[i] = dData[i];
                return data;
            }else if(begin<end){
                for(var i in oData){
                    index++;
                    if(index>=begin && index<=end){
                        data[i] = oData[i];
                    }
                }
            }
            return data;
        }
        return {
            get : get
        }
    })();

    var buildor = (function(){
        function build(data){

        }
    })();

    var Counter = (function(){


    })();

    var Matchor = (function(){

    })();


    $(function(){
        //Ajaxor.init();
    })



})();

$(document).ready(function(){
    $(".edit").click(function(){
        $(".black").css({ //
            "width":$(window).width()+"px",
            "height":$(window).height()+"px",
            "display":"block"
        });
        $(".alert_box").css("display","block");


    });
    $(".click_close,.cancel").click(function(){
        $(".alert_box").css("display","none");
        $(".black").css("display","none");
    });

});










