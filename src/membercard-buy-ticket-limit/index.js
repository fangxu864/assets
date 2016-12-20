/**
 * Created by ZhengJs on 2016/12/19.
 */
require("./index.scss");
var Pagination = require("COMMON/modules/pagination-x");
var Service = require("./Service/product_MemberCardBasic-lands_Service.js");
var editDialog=require("./editDialog");
var Loading = require("COMMON/js/util.loading.pc.js");

var Main = {
 //声明分页器为全局变量
    pagination:null,
 //初始化————————————————————————————————————————————————————————————
    init:function () {
        this.paginationInit();
        this.getWholeData();
        this.eventInit();
        this.editPart = new editDialog();
    },
    
 //以下为初始化部分——————————————————————————————————————————————————————
    //初始化分页器
    paginationInit:function () {
        var _this = this;
        _this.pagination = new Pagination({
            container: "#pagination_box",
            count : 7,
            showTotal : true,
            jump : true
        });

        _this.pagination.on("page.switch",function(toPage,currentPage,totalPage){
             _this.pageChange(toPage);
             _this.pagination.render({current:toPage,total:_this.cacheData.length}); 	 //渲染点击的页面
        });
    },
    
    //事件初始化
    eventInit:function () {
        var _this = this;

        //输入搜索
        $("#filter").on("input",function (e) {

            $("#loading").remove()
            var filterResult = _this.filterBox($(e.target).val(),_this.Wholedata.list);
            if(!filterResult){
                return false
            }
            var sortResult = _this.sortBox("-",filterResult);
            var devideResult = _this.dividePage(sortResult,15);
            _this.cacheData = devideResult;
            $("#total_box").show();
            $("#total_box #total").text(_this.countTotal(_this.cacheData));

            //形成分页器，渲染第一页
            _this.pagination.render({current:1,total:_this.cacheData.length});
            $("#tbody").empty();
            if(devideResult.length){
                for(var i =0 ; i <_this.cacheData[0].length;i++){
                    //rid
                    if(!_this.cacheData[0][i].rid){
                        var rid = "";
                    }else{
                        var rid = _this.cacheData[0][i].rid;
                    }

                    //每日购票次数
                    if(!_this.cacheData[0][i].daily_buy_limit || _this.cacheData[0][i].daily_buy_limit == -1){
                        var daily_buy_limit = "不限"
                    }else{
                        var daily_buy_limit = _this.cacheData[0][i].daily_buy_limit
                    }

                    //每日限购票数
                    if(!_this.cacheData[0][i].buy_num_limit || _this.cacheData[0][i].buy_num_limit == -1){
                        var buy_num_limit = "不限"
                    }else{
                        var buy_num_limit = _this.cacheData[0][i].buy_num_limit
                    }

                    //购买间隔
                    if(!_this.cacheData[0][i].buy_interval || _this.cacheData[0][i].buy_interval == -1){
                        var buy_interval = "不限"
                    }else{
                        var buy_interval = _this.cacheData[0][i].buy_interval
                    }

                    var newTr = $('<tr> <td>'+_this.cacheData[0][i].p_name+'</td> <td class="daily_buy_limit">'+daily_buy_limit+'</td> <td class="buy_num_limit">'+buy_num_limit+'</td> <td class="buy_interval">'+buy_interval+'</td> <td class="ticketEdit" data-rid = "'+_this.cacheData[0][i].rid+'" data-name="'+_this.cacheData[0][i].p_name+'" data-pid="'+_this.cacheData[0][i].pid+'" data-rid="'+rid+'">票类编辑</td> </tr>');
                    $("#tbody").append(newTr)
                }
            }else{
                var loadingHTML = Loading("找不到相关数据，请检查您的搜索条件。",{
                    width : 808,
                    height : 500,
                    id : "loading",
                    imgWidth : -1,
                });
                $(".ticketLimit").append(loadingHTML);
                $("#total_box").hide();
            }

            //点击编辑
            $(".ticketEdit").on("click",function (e) {
                _this.editPart.Dialog.open();
                var daily_limit = $(e.target).parent().find(".daily_buy_limit").text();
                var num_limit = $(e.target).parent().find(".buy_num_limit").text();
                var interval = $(e.target).parent().find(".buy_interval").text();
                if(daily_limit == "不限"){
                    daily_limit = -1
                }
                if(num_limit == "不限"){
                    num_limit = -1
                }
                if(interval == "不限"){
                    interval = -1
                }
                $("#daily_limit").val(daily_limit);
                $("#num_limit").val(num_limit);
                $("#interval").val(interval);
                $("#editContainer").attr("data-pid",$(e.target).attr("data-pid"));
                $("#editContainer").attr("data-rid",$(e.target).attr("data-rid"));
                $("#p_name").attr("title",$(e.target).attr("data-name")).text($(e.target).attr("data-name"))
            })
        });


    },

    //缓存全部数据
    getWholeData:function () {
        var _this = this;
        Service({title:"123"},{
            loading:function () {
                var loadingHTML = Loading("加载中",{
                    width : 808,
                    height : 500,
                    id : "loading"
                });
                $(".ticketLimit").append(loadingHTML);
            },
            success:function (data) {
                $("#loading").remove();
                _this.Wholedata = data;
                $("#total_box").show();
                $("#total_box #total").text(_this.countTotal(_this.Wholedata));
                $("#filter").trigger("input");
            },
            fail:function () {
                var loadingHTML = Loading("找不到相关数据，请检查您的搜索条件。",{
                    width : 808,
                    height : 500,
                    id : "loading",
                    imgWidth : -1,
                });
                $(".ticketLimit").append(loadingHTML);
                $("#total_box").hide();
            }
        })
    },

    //分页器更改触发的事件
    pageChange:function (toPage) {
        var _this = this;
        $("#tbody").empty();
        for(var i =0 ; i < this.cacheData[toPage-1].length ; i++){
            //rid
            // if(!this.cacheData[toPage-1][i].rid){
            //     var rid = "";
            // }else{
            //     var rid = this.cacheData[toPage-1][i].rid;
            // }


            //每日购票次数
            if(!this.cacheData[toPage-1][i].daily_buy_limit || this.cacheData[toPage-1][i].daily_buy_limit == -1){
                var daily_buy_limit = "不限"
            }else{
                var daily_buy_limit = this.cacheData[toPage-1][i].daily_buy_limit
            }

            //每日限购票数
            if(!this.cacheData[toPage-1][i].buy_num_limit || this.cacheData[toPage-1][i].buy_num_limit == -1){
                var buy_num_limit = "不限"
            }else{
                var buy_num_limit = this.cacheData[toPage-1][i].buy_num_limit
            }

            //购买间隔
            if(!this.cacheData[toPage-1][i].buy_interval || this.cacheData[toPage-1][i].buy_interval == -1){
                var buy_interval = "不限"
            }else{
                var buy_interval = this.cacheData[toPage-1][i].buy_interval
            }


            var newTr = $('<tr> <td>'+this.cacheData[toPage-1][i].p_name+'</td> <td class="daily_buy_limit">'+daily_buy_limit+'</td> <td class="buy_num_limit">'+buy_num_limit+'</td> <td class="buy_interval">'+buy_interval+'</td> <td class="ticketEdit" data-rid="'+this.cacheData[toPage-1][i].rid+'" data-name="'+this.cacheData[toPage-1][i].p_name+'" data-pid="'+this.cacheData[toPage-1][i].pid+'">票类编辑</td> </tr>');
            $("#tbody").append(newTr)
        }

        $(".ticketEdit").on("click",function (e) {
            _this.editPart.Dialog.open();
            $("#daily_limit").val("");
            $("#num_limit").val("");
            $("#interval").val("");
            $("#editContainer").attr("data-pid",$(e.target).attr("data-pid"));
            $("#editContainer").attr("data-rid",$(e.target).attr("data-rid"));
            $("#p_name").attr("title",$(e.target).attr("data-name")).text($(e.target).attr("data-name"))
        })
    },


 //检索引擎部分——————————————————————————————————————————
    //检索：根据条件返回符合关键词的部分，data为对象类型
    filterBox:function(keyWord,data){
        var resultBox = [];
        var exactBox = [];
        var key;
        for (key in data){
            var tab = {};
            tab.times = 0;
    
            for(var i = 0; i<keyWord.length ; i++){
    
                //计算匹配相似度
                if(data[key].p_name.indexOf(keyWord[i]) != -1){
                    tab.times += 1;
                    tab.p_name = data[key].p_name;
                    tab.rid = data[key].rid;
                    tab.pid =  data[key].pid;
                    tab.buy_interval = data[key].buy_interval;
                    tab.buy_num_limit = data[key].buy_num_limit;
                    tab.daily_buy_limit = data[key].daily_buy_limit;
                    tab.dstatus = data[key].dstatus;

                }
            }
    
            //保存变量
            if(tab.times != 0){
                resultBox.push(tab)
            }
        }
        //如果为空，返回全部
        if(keyWord ==""){
            for (key in data){
                var tab = {};
                tab.times = 0;
                tab.rid = data[key].rid;
                tab.p_name = data[key].p_name;
                tab.pid =  data[key].pid;
                tab.buy_interval = data[key].buy_interval;
                tab.buy_num_limit = data[key].buy_num_limit;
                tab.daily_buy_limit = data[key].daily_buy_limit;
                tab.dstatus = data[key].dstatus;
                resultBox.push(tab);
            }
            return resultBox
        }

        //如果有高等级匹配度则覆盖模糊搜索的结果
        for(i=0 ; i<resultBox.length ; i++){
            if(resultBox[i].times == keyWord.length){
                exactBox.push(resultBox[i]);
            }
        }

        if(exactBox.length){
            return exactBox
        }else {
            return(resultBox)
        }

    },

//按匹配度排序(direction为“+”升序；direction为“-”，降序)
    sortBox:function(direction,data){
        if(direction == "+"){
            function asc(a, b){
                return a.times- b.times;
            }
            data.sort(asc)
    
    
        }else if(direction == "-"){
            function des(a,b){
                return b.times- a.times;
            }
            data.sort(des)
        }else{
            return false
        }
    
        return data;
    },
//分页
    dividePage:function(data, size) {

        var whole = $.extend([], data);
        var length = data.length;
        var totalPage = Math.ceil(length/parseInt(size));


        var cacheData = [];
        for(var i=0 ; i<totalPage ; i++){
            var part = [];
            for(var j=0 ; j<size ; j++){
                if(whole[j]){
                    part.push(whole[j]);
                }
            }

            //如果加一个删一个就会每次漏掉一个，所以要在循环外面删除
            whole.splice(0,size);

            cacheData.push(part)
        }
        return cacheData
    },
    //计算总条数
    countTotal:function (data) {
        var len = 0;
        for(var i = 0 ; i < data.length ; i++){
            len += data[i].length
        }
        return len;

    }
};

$(function () {
    Main.init()
});