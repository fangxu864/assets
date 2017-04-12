require("./index.scss");
var Filter = require("./module/filter/index.js");

var main = {
    query : function(opt){
        var that = this;
        var opt = opt || {};
        var pageSize = opt.pageSize || 15;
        var currentPage = opt.currentPage || 1;
        var provice = opt.province || "";
        var city = opt.city || "";
        var title = opt.title || "";
        var ty = opt.ty || "2";
        var supplier = opt.supplier || "";
        var ttimeout = opt.ttimeout || 20 * 60 * 1000;
        var data = {
            pageSize : pageSize,
            page : currentPage ,
            city : city,
            provice : provice,
            title : title,
            supplier : supplier,
            async : 1
        };
        var listUl = $("#mlistUl");
        var pagenavW = $("#pagenavW");
        // var status = this.statics.queryState;
        // if(ty=="2"){
            PFT.Ajax({
                url : "/r/product_Evolute/getProList",
                type : "GET",
                dataType : "json",
                ttimeout : ttimeout,
                data : data,
                loading : function(){
                    listUl.html(status["loading"]);
                    pagenavW.hide();
                },
                removeLoading : function(res){
                    // that.statics.last = "";
                    // that.statics.currentPage += 1;
                    listUl.html("");
                    pagenavW.show();
                },
                timeout : function(){ listUl.html(status["timeout"]);},
                serverError : function(){ listUl.html(status["serverError"]);}
            },function(res){
                var code = res.code;
                var lists = res.data.lists;
                // var last = res.last;
                var totalPage = res.data.totalPage;
                if(code==200){
                    if(1){
                        that.buildHtml(res);
                    }else{
                        listUl.html(status["empty"]);
                        if(provice) that.fire("search_empty",res);
                    }
                    // that.statics.last = last;
                    // if(!last){
                    //     that.fire("no_next",res);
                    // }else{
                    //     that.fire("has_next",res);
                    // }
                }else if(code==0){
                    listUl.html(status["unlogin"]);
                }else if(code==400){
                    listUl.html(status["ban"]);
                }else{
                    listUl.html(status["fail"]);
                }
            })
        // }
        // else{
        //     PFT.Ajax({
        //         url : "prod_sale_dt.html",
        //         type : "GET",
        //         dataType : "json",
        //         ttimeout : ttimeout,
        //         data : data,
        //         loading : function(){
        //             listUl.html(status["loading"]);
        //             pagenavW.hide();
        //         },
        //         removeLoading : function(res){
        //             that.statics.last = "";
        //             that.statics.currentPage -= 1;
        //             listUl.html("");
        //             pagenavW.show();
        //         },
        //         timeout : function(){ listUl.html(status["timeout"]);},
        //         serverError : function(){ listUl.html(status["serverError"]);}
        //     },function(res){
        //         var code = res.code;
        //         var lists = res.lists;
        //         var last = res.last;
        //         var totalPage = res.totalPage;
        //         if(code==200){
        //             if(!that.statics.isObjEmpty(lists)){
        //                 that.buildHtml(res);
        //             }else{
        //                 listUl.html(status["empty"]);
        //                 if(provice) that.fire("search_empty",res);
        //             }
        //             that.statics.last = last;
        //             if(!last){
        //                 that.fire("no_next",res);
        //             }else{
        //                 that.fire("has_next",res);
        //             }
        //         }else if(code==0){
        //             listUl.html(status["unlogin"]);
        //         }else{
        //             listUl.html(status["fail"]);
        //         }
        //     })
        // }
    },
    buildHtml : function(res){
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
    }
}

$(function () {
    main.query()
    new Filter();
})