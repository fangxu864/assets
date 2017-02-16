/**
 * Created by Administrator on 2016/7/27.
 */
require("../index.scss");

var Pagination = require("COMMON/modules/pagination");
var Datepicker = require("COMMON/modules/datepicker");
//切换菜单
var no_use_btn = document.getElementById("no_use_btn");//取“未使用”按钮
var searchWrap = document.getElementById("searchWrap");
var stateLi = $(".stateLi");
var table_four = document.getElementById("table_four");
var no_use_table = $("#no_use_table");
var nouse_tbody = no_use_table.children("tbody").eq(0);
var search_keyword_box = document.getElementById("search_keyword_box");
var search_time_box = document.getElementById("search_time_box");
var today = new Date().Format("yyyy-MM-dd");
var datepicker = new Datepicker();
var Main = PFT.Util.Class({
    init: function (opt) {
        console.log(opt)
        var container = this.container = opt.container;
    },
    EVENTS: {
       /* "click": {
            "#start_time": "onStartClick",
            "#end_time": "onEndClick",
            "#no_use_search": "onNotUseSchClick",
            "#no_use_btn": "onNotUseBtnClick"
        }*/
        "click #start_time":"onStartClick",
        "click #end_time":"onEndClick",
        "click #no_use_search":"onNotUseSchClick",
        "click #no_use_btn":"onNotUseBtnClick",
    },
    onStartClick: function () {
        console.log(1)
    },
    onEndClick:function(){
         console.log(1)
    },
    onNotUseBtnClick: function () {
        //未使用
        table_four.style.display = "none";
        no_use_table.css("display", "table");
        search_keyword_box.style.display = "none";
        search_time_box.style.display = "block";

        for (var i = 0; i < stateLi.length; i++) {
            stateLi[i].className = "stateLi";
        }
        this.className = "no_use_btn_active";
    },
    onNotUseSchClick: function () {
        var start_time = document.getElementById("start_time").value
        var end_time = document.getElementById("end_time").value
        // alert(start_time+"-"+end_time)

        $.ajax({
            url: "call/jh_card.php",    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            data: {
                "status": 4,
                "begin": start_time,
                "end": end_time,
                "pageSize": 10,
                "currentPage": 1,
                "action": "list"
            },  //参数值
            type: "GET",   //请求方式
            beforeSend: function () {
                //请求前的处理
            },
            success: function (req) {
                dealData(req);

            },
            complete: function () {
                //请求完成的处理
            },
            error: function () {
                //请求出错处理
            }
        });

        //改变导出按钮的href
        var href = "/mcard_list.html?act=loadExcel&status=4&begin=" + start_time + "&end=" + end_time;
        $("#daoBtn1").attr("href", href);
    },
    dealData: function (req) {
        //分页器部分
        var totalpage = req.totalpage;
        var page = req.page;
        var pageSize = req.pageSize;
        if (totalpage > 1) {
            var p = new Pagination({
                "id": "pagination_box",//分页器盒子的容器
                "data_total_num": pageSize * totalpage,//数据总数量
                "per_page_num": pageSize,//每页显示的数据条数
                "present_page": page,//当前页数
                "callBack": function (present_page) {
                    console.log(present_page);
                    var start_time = document.getElementById("start_time").value;
                    var end_time = document.getElementById("end_time").value;

                    $.ajax({
                        url: "call/jh_card.php",    //请求的url地址
                        dataType: "json",   //返回格式为json
                        async: true, //请求是否异步，默认为异步，这也是ajax重要特性
                        data: {
                            "status": 4,
                            "begin": start_time,
                            "end": end_time,
                            "pageSize": 10,
                            "currentPage": present_page,
                            "action": "list"
                        },  //参数值
                        type: "GET",   //请求方式
                        beforeSend: function () {
                            //请求前的处理
                        },
                        success: function (req) {
                            dealData(req);

                        },
                        complete: function () {
                            //请求完成的处理
                        },
                        error: function () {
                            //请求出错处理
                        }
                    });

                }
            })
        }

        //将返回数据显示到页面中
        var con = '';//定义存储内容的变量
        var arrSet = req.list;//定义返回的数组集；
        var state = {
            "0": "正常",
            "1": "挂失",
            "2": "禁用",
            "3": "冻结",
            "4": "废弃"
        };
        for (var i = 0; i < arrSet.length; i++) {
            if (arrSet[i].status == "0") {
                con += '<tr' + ' data_did="' + arrSet[i].did + '" ' + ' data_cid="' + arrSet[i].cid + '"' + '><td class="card_num"><a href="register_card.html?did=' + arrSet[i].did + '" class="no_use_tb_tr_fir_td_a" data_name="' + arrSet[i].cname + '" data_mobile="' + arrSet[i].mobile + '">' + arrSet[i].dname + '(' + arrSet[i].card_no + ')</a>' +
                    '</td><td>' + arrSet[i].ordertime + '</td><td class="">正常</td><td class="">' +
                    '<a href="repayment.html?did=' + arrSet[i].did + '">授信/预存</a>' +
                    '<a style="margin:0 8px" class="" data_tostate="1" href="javascript:void(0)" onclick="dealGuaShi(this)">挂失</a>' +
                    '<a class="no_use_jinyong" data_tostate="2" href="javascript:;" onclick="dealJinYong(this)">禁用</a></td></tr>'
            }
            else if (arrSet[i].status == "1") {
                con += '<tr' + ' data_did="' + arrSet[i].did + '" ' + ' data_cid="' + arrSet[i].cid + '"' + '><td class="card_num"><a href="register_card.html?did=' + arrSet[i].did + '" class="no_use_tb_tr_fir_td_a" data_name="' + arrSet[i].cname + '" data_mobile="' + arrSet[i].mobile + '">' + arrSet[i].dname + '(' + arrSet[i].card_no + ')</a>' +
                    '</td><td>' + arrSet[i].ordertime + '</td><td class="">挂失</td><td class="">' +
                    '<a href="repayment.html?did=' + arrSet[i].did + '">授信/预存</a>' +
                    '<a style="margin:0 8px" class="" href="register_card.html?did=' + arrSet[i].did + '">补卡</a>' +
                    '<a class="" data_tostate="0" href="javascript:void(0)" onclick="dealHuiFu(this)">恢复</a></td></tr>'
            }
            else if (arrSet[i].status == "2") {
                con += '<tr' + ' data_did="' + arrSet[i].did + '" ' + ' data_cid="' + arrSet[i].cid + '"' + '><td class="card_num"><a href="register_card.html?did=' + arrSet[i].did + '" class="no_use_tb_tr_fir_td_a" data_name="' + arrSet[i].cname + '" data_mobile="' + arrSet[i].mobile + '">' + arrSet[i].dname + '(' + arrSet[i].card_no + ')</a>' +
                    '</td><td>' + arrSet[i].ordertime + '</td><td class="">禁用</td><td class="">' +
                    '<a href="repayment.html?did=' + arrSet[i].did + '">授信/预存</a>' +
                    '<a class="no_use_qiyong" style="margin-left: 8px;" data_tostate="0" href="javascript:void(0)" onclick="dealQiYong(this)">启用</a></td></tr>'
            } else {
                con += ""
            }
        }
        nouse_tbody.html(con);

        //给表格第一列添加淡出联系人和电话效果
        $(".no_use_tb_tr_fir_td_a").one("mouseover", function () {
            var html = '<div class="no_use_tb_tr_fir_td_a_fade">' + $(this).attr("data_name") + ' ' + $(this).attr("data_mobile") + '</div>'
            $(this).append(html)
        })
        $(".no_use_tb_tr_fir_td_a").on({
            mouseover: function () {
                $(this).find("div").stop(true, true)
                $(this).find("div").fadeIn();
            },
            mouseout: function () {
                $(this).find("div").stop(true, true)
                $(this).find("div").fadeOut();
            }
        })
    }

});

  var main=new Main({
      container:"#memListContainer"
  })
module.exports = Main;



















