require("./index.scss");
var Common = require("../common.js");
var Status = Common.Status;
var LoadingText = PFT.Util.LoadingPc("努力加载中...",{
    tag : "tr",
    colspan : 5,
    height : 300,
    css : {
        "background-color" : "#fff"
    }
});
var ContainerTpl = require("./container.xtpl");
var ListTpl = require("./item.xtpl");
var List = PFT.Util.Class({
    container : $("#listContainer"),
    EVENTS : {
        "click .lineTr .doBtn" : "onDoBtnClick"
    },
    init : function(){
        this.container.html(ContainerTpl);
        this.listBodyContainer = $("#listBodyContainer");

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
        //只有4种动作  挂失  恢复  禁用  启用
        //只有禁用不需要输入用户密码 
        var parent = tarBtn.parents("td");
        var cid = parent.attr("data-cid");
        var did = parent.attr("data-did");
        var status = parent.attr("data-status");

        if(status!=2){ //只有禁用不需要输入用户密码 
            var password = prompt("请输入此会员的消费密码");
            if(!password) return false;
            alert(cid+" "+did+ " "+status)
        }else{
            var result = window.confirm("确定要禁用此会员吗？");
            if(!result) return false;
            alert(cid+" "+did+ " "+status)
        }



    },
    //适配转换后端返回来的数据
    adaptListData : function(data){

        for(var i=0,len=data.length; i<len; i++){
            var item = data[i];
            var status = item.status;
            item["status_text"] = Status[status].text;
            item["action"] = Status[status].action;
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
                that.trigger("loading");
            },
            complete : function(){
                that.setState("isLoading",false);
                container.html("");
                that.trigger("loading");
            },
            success : function(res){
                if(PFT.Util.isObject(res)){
                    var list = that.adaptListData(res.list);
                    var currentPage = res.page;
                    var totalPage = res.totalpage;
                    if(!PFT.Util.isArray(list)) return alert(PFT.AJAX_ERROR_TEXT);
                    if(list.length){
                        container.html(template({list:list}));
                        that.trigger("success",res)
                    }else{
                        container.html('<tr><td colspan="5" style="background:#fff; padding:150px 0; text-align:center">暂无匹配会员...</td></tr>');
                    }
                }else{
                    alert(PFT.AJAX_ERROR_TEXT);
                }
            }
        })


    }
});

module.exports = List;