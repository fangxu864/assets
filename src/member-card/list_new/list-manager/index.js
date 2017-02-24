require("./index.scss");
var Common = require("../common.js");
var LoadingText = PFT.Util.LoadingPc("努力加载中...",{
    tag : "tr",
    height : 300
});
var Pagination = require("COMMON/Components/Pagination");
var ContainerTpl = require("./container.xtpl");
var ListTpl = require("./item.xtpl");
var List = PFT.Util.Class({
    container : $("#listContainer"),
    EVENT : {
        "click .lineTr .doBtn" : "onDoBtnClick"
    },
    init : function(){
        this.container.html(ContainerTpl);
        this.listBodyContainer = $("#listBodyContainer");

        var pagination = this.pagination = new Pagination({
            container : "#paginationContainer",  //必须，组件容器id
            count : 7,                //可选  连续显示分页数 建议奇数7或9
            showTotal : true,         //可选  是否显示总页数
            jump : true	              //可选  是否显示跳到第几页
        });


        this.fetchList();
    },
    state : {
        isLoading : false
    },
    template : PFT.Util.ParseTemplate(ListTpl),
    getState : function(key){
        return this.state[key];
    },
    setState : function(key,value){
        this.state[key] = value;
    },
    onDoBtnClick : function(e){
        var tarBtn = $(e.currentTarget);
        
    },
    //适配转换后端返回来的数据
    adaptListData : function(data){

        var Status = {
            0 : "正常",
            1 : "挂失", 
            2 : "禁用",
            3 : "冻结", 
            4 : "废弃"
        };

        for(var i=0,len=data.length; i<len; i++){
            var item = data[i];
            var did = item.did;
            var status = item.status;

            var doBtn = "";
            if(status == 0){
                doBtn = '<a href="repayment.html?did=' + did + '">授信/预存</a><a class="doBtn guashi" data-toState="1" href="javascript:void(0)">挂失</a><a class="doBtn jinyong" data-toState="2" href="javascript:void(0)">禁用</a>';
            }else if(status == 1){
                doBtn = '<a href="repayment.html?did=' + did + '">授信/预存</a><a class="buka" href="member_card.html?fid=' + did + '">补卡</a><a data-toState="0" class="doBtn huifu" href="javascript:void(0)">恢复</a>';
            }else if(status == 2){
                doBtn = '<a href="repayment.html?did=' + did + '">授信/预存</a><a class="doBtn qiyong"  data-toState="0" href="javascript:void(0)">启用</a>';
            }

            item["status_text"] = Status[status];
            item["doBtn"] = doBtn;

        }

        return data;
    },
    fetchList : function(params){
        if(this.getState("isLoading")) return false;  //如果正在请求
        var that = this;
        var container = this.listBodyContainer;
        var template = this.template;
        var pagination = this.pagination;

        params = PFT.Util.Mixin({
            status : "",
            keyword : "",
            begin : "",
            end : "",
            currentPage : 1,
            pageSize : 15
        },params || {});


        PFT.Util.Ajax(Common.Api.list(),{
            type : Common.Ajax_Type,
            ttimeout : Common.Ajax_Timeout,
            params : params,
            loading : function(){
                that.setState("isLoading",true);
                container.html(LoadingText);
                pagination.render(null); //loading的时间先隐藏分页器
            },
            complete : function(){
                that.setState("isLoading",false);
                container.html("");
            },
            success : function(res){
                if(PFT.Util.isObject(res)){
                    var list = that.adaptListData(res.list);
                    var currentPage = res.page;
                    var totalPage = res.totalpage;
                    if(!PFT.Util.isArray(list)) return alert(PFT.AJAX_ERROR_TEXT);
                    if(list.length){
                        container.html(template({list:list}));
                        pagination.render({current:currentPage,total:totalPage});
                    }else{
                        container.html('<tr><td colspan="4" style="padding:150px 0; text-align:center">暂无匹配会员...</td></tr>');
                    }
                }else{
                    alert(PFT.AJAX_ERROR_TEXT);
                }
            }
        })


    }
});

module.exports = List;