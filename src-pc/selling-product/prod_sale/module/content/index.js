
//引入消息提示模块
var Message = require("pft-ui-component/Message");
require("./index.scss");
var Mcon = PFT.Util.Class({
    
    init: function () {
        this.container = $("#M-con");
        this.initRender();
        this.bind();
    },

    bind: function () {
        var _this = this;
        //开启关闭按钮点击时
        this.container.on("click",".yujbtn",function(e){
            var target = $(e.currentTarget);
            target.parents(".list_con").attr("data-ac",id);
            var active_list_a = target.parents(".list_con").find('.list_data .yujbtn');
            $(active_list_a).each(function(){
                var active = $(this).attr("data-active");
                if(active=="1"){
                    var id = $(this).attr("data-id");
                    target.parents(".list_con").attr("data-ac",id);
                }
            });
            var old_id = target.parents(".list_con").attr("data-ac");
            var id = target.attr("data-id");
            var pid = target.attr("data-pid");
            var yucln = e.target.className;
            var listUl = $("#mask");
            var that = this;
            //var loading = '<li class="loading" style="text-align:center; line-height:1; height:400px;"><p style="color:#aeaeae; font-size:12px; padding-top:300px;">加载数据...</p><img src="images/other/loading_1.gif" alt="" /></li>';
            var loading = '<li class="loading" style="text-align:center; line-height:1; height:400px;"><p style="color:#aeaeae; font-size:12px; padding-top:300px;">加载数据...</p><img src="http://www.12301.cc/images/img/loading.gif" alt="" /></li>';
            var pagenavW = $("#pagenavW");
            var ttimeout =  20 * 60 * 1000;
            //var status = this.statics.queryState;
            var data = {
                pid: pid,
                sid: id,
            };
            var datb = {
                pid: pid,
                sid: id,
            };
            var conf_price = $(this).attr("data-conf_price");
            var ac = $(this).attr("data-active");
            var data_conf_price = target.parents(".list_con").attr("data-conf_price");
            if(ac == "1"){
                Message.confirm("确定要关闭该产品的转分销!" ,function (result) {
                    if (result==true){
                        PFT.Ajax({
                            url : "/r/product_Evolute/closeEvolute",
                            type : "GET",
                            dataType : "json",
                            ttimeout : ttimeout,
                            data : data,
                            loading : function(){
                                //listUl.html(loading);
                                $("#mask").css("display","block");
                                $(".img_none").css("display","block");
                                //pagenavW.hide();
                            },
                            removeLoading : function(res){
                                //listUl.html("");
                                $("#mask").css("display","none");
                                $(".img_none").css("display","none");
                            },
                        },function(data){
                            if(data.code =='200'){
                                //if(data.status =='success'){
                                Message.success("关闭成功");
                                //我更新了哦
                                _this.trigger("existUpdate");
                                var active_list_a = target.parents(".list_con").find('.list_data .yujbtn');
                                $(active_list_a).each(function(){
                                    var active = $(this).attr("data-active");
                                    if(active=="0"){
                                        target.parents(".list_con").attr("data-ac","0");
                                        $(this).parent().find(".color_a").html("");
                                    }
                                });
                                target.removeClass("onyuj");
                                target.attr("data-active","0");
                                target.parent().find(".color_a").html("");
                            }
                            else{
                                Message.error(data.msg)
                            }
                        })
                    }
                    else{
                        return false;
                    }
                })
            }else{
                var active_list_a = target.parents(".list_con").find('.list_data .yujbtn');
                PFT.Ajax({
                    url : "/r/product_Evolute/openEvolute",
                    type : "GET",
                    dataType : "json",
                    ttimeout : ttimeout,
                    data : datb,
                    loading : function(){
                        //listUl.html(loading);
                        $("#mask").css("display","block");
                        $(".img_none").css("display","block");

                        //pagenavW.hide();
                    },
                    removeLoading : function(res){
                        //listUl.html("");
                        $("#mask").css("display","none");
                        $(".img_none").css("display","none");
                    },
                },function(data){
                    if(data.code =='200'){
                        //if(data.status =='success'){
                        Message.success("开启成功");
                        //我更新了哦
                        _this.trigger("existUpdate");
                        var active_list_a = target.parents(".list_con").find('.list_data .yujbtn');
                        $(active_list_a).each(function(){
                            var active = $(this).attr("data-active");
                            var pid = $(this).attr("data-id");
                            if(active=="1"){
                                $(this).removeClass("onyuj");
                                $(this).parent().find(".color_a").html("");
                                $(this).attr("data-active","0");
                            }
                            else{
                                if(conf_price=="1"){
                                    $(this).attr("data-active","0");
                                    $(this).removeClass("onyuj");
                                    //$(this).parent().find(".color_a").html("分销价格");
                                    target.parent().find(".color_a").html("分销价格");
                                }
                                else{
                                    $(this).attr("data-active","0");
                                    $(this).removeClass("onyuj");
                                    $(this).parent().find(".color_a").html("");
                                }

                            }
                        });
                        target.addClass("onyuj");
                        target.attr("data-active","1");

                        //target.parent().find(".color_a").html("分销价格");

                    }
                    else{
                        Message.error(data.msg)
                    }
                })
            }
        })
    },

    /**
     * @method 渲染来自数据中心的res
     * @param res
     */
    render: function (res) {
        var that = this;
        var code = res.code;
        var lists = res.data.lists;
        var str = "";
        var last = res.last;
        var currentPage = res.data.currentPage;
        var totalPage = res.data.totalPage;
        $(".nextBtn").attr("total",totalPage);
        $("#prevPageBtn").attr("data-mid",currentPage);
        $("#prevPageBtn").attr("data-last",currentPage+1);
        $("#prevPageBtn").attr("data-first",currentPage-1);
        $("#prod_sale_tiptext").attr("data",totalPage);
        var data = lists;
        var url_type = $(".listWrap").attr("data_type");
        if(url_type=="1"){
            url="adjusting.html";
        }
        else{
            url="adjusting.html";
        }
        for(var i in data){
            is_data_empty = false;
            str += '<div class="list">';
            str += '<div class="list_top position_a ">';
            str +=     '<div class="title" data="'+data[i]["title"]+'" " title="'+data[i]["title"]+'">'+data[i]["title"]+'</div>';
            str += 			'<div class="top_right_a">';
            str +=				'<span class="supplier">供应商</span>';
            str +=				'<span class="supply_price">成本价</span>';
            str +=				'<span class="retail_price">零售价</span>';
            str +=				'<span class="operate">操作</span>';
            str +=			'</div>';
            str +=       '</div>';
            for(var s in data[i]["ticket"]){
                var t = data[i]["ticket"][s];
                var lists =data[i]["ticket"][s]["lists"];
                var tt = data[i]["ticket"][s]["title"];
                var pid = data[i]["ticket"][s]["pid"];

                var tid = t["pid"];
                str +=     '<div class="list_con" data-ac="">';
                str +=     '<div class="ticket"><span class="dtitle" title="'+tt+'">'+tt+'</span><span class="dtitl" title=""></span></div>';
                for(var j in lists){
                    var dname=lists[j]["dname"];
                    var js=lists[j]["js"];
                    var ls=lists[j]["ls"];
                    var id=lists[j]["aid"];
                    var aids=lists[j]["apply_did"];
                    var sid=lists[j]["sapply_did"];
                    var active=lists[j]["active"];
                    var lvl=lists[j]["lvl"];
                    var show_reseller_storage = lists[j]["show_reseller_storage"];   //1时  添加 “分销库存”链接
                    var conf_price=lists[j]["conf_price"];
                    str +=     '<ul class="list_data">';
                    str +=     '<li>';
                    str +=			'<span class="supplier_a" >';
                    str +=            	'<span class="title_name" title="'+dname+'">'+dname+'</span>';
                    str +=				'<span class="title_id" title="账户ID|景区ID|门票ID">'+data[i]["memberSID"]+'|'+i+'|'+s+'</span>';
                    str +=				'</span><span class="supply_price supply_data" data="'+js+'">'+js+'</span>';
                    str +=				'<span class="retail_price retail_data" data="'+ls+'">'+ls+'</span>';
                    str +=				'<span class="operate_a color_a operate_data" data="'+conf_price+'" onclick="window.open(\''+url+'?pid='+pid+'&sid='+sid+'&lvl='+lvl+'&aids='+aids+'\')">分销价格</span>';
                    str +=				'<span class="yujbtn" id="yuj" data-ac="" data-active="'+active+'"  data-conf_price="'+conf_price+'" data-show="'+conf_price+'" data-pid="'+pid+' "data-id="'+id+'"></span>';
                    str +=              '<span class="show_reseller_storage color_h" data-show-s="'+show_reseller_storage+'" onclick="window.open(\'fenx_storage.html?pid='+pid+'\')">分销库存</span>';
                    str +=			'</span>';
                    str +=		'</li>';
                    str +=		'</ul>';
                }
                str +='</div>';
            }
            str += '</div>';
        }
        $(".M-con").html(str);
        $("#total_num").text("共"+totalPage+"页");
        $("#whichPageNum").text(currentPage);
        $(".page_num_").val("");
        $(".yujbtn").each(function(){
            var active = Number($(this).attr("data-active"));
            if(active=="1"){
                if(conf_price=="1"){
                    $(this).addClass("onyuj");
                }
                else{
                    $(this).addClass("onyuj");
                    $(this).parent().find(".color_a").html("");
                }
            }

        });
        $(".show_reseller_storage ").each(function(){
            var show = $(this).attr("data-show-s");
            if(show=="0"){
                $(this).hide();
            }
        });
        $(".yujbtn").each(function(){
            var active = Number($(this).attr("data-active"));
            if(active=="0"){
                $(this).parent().find(".color_a").html("");
            }else{

                $(this).parent().find(".color_a").html("分销价格");
            }
        });
        $(".supply_data").each(function(){
            var pan = Number($(this).attr("data"));
            if(pan=="-1"){
                $(this).text("无供货价格");
            }
        })
        $(".retail_data").each(function(){
            var pan = Number($(this).attr("data"));
            if(pan=="-1"){
                $(this).text("无零售价格");
            }
        })
        $(".operate_data").each(function(){
            var pan = Number($(this).attr("data"));
            if(pan=="0"){
                $(this).text("");
            }
        })
    },

    /**
     * @method showLoading
     */
    showLoading: function () {
        var loadingStr = PFT.Util.LoadingPc("努力加载中...",{
            tag : "div",
            height: 200
        });
        this.container.html(loadingStr)
    },

    /**
     * @method showError
     */
    showError: function (errorText) {
        var errorStr = '<div style="width: 100%; height: 200px; line-height: 200px;text-align: center;color: #f07844; font-size: 16px">'+errorText+'</div>';
        this.container.html(errorStr)
    },

    //初始化时显示的内容
    initRender: function () {
        var errorStr = '<div style="width: 100%; height: 200px; line-height: 200px;text-align: center;color: #c3c3c3; font-size: 16px">请选择查询条件再点击搜索按钮进行查询</div>';
        this.container.html(errorStr)
    }


});


module.exports = new Mcon();