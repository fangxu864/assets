/**
 * Created by Administrator on 2016/11/21.
 */
/**
 * Created by Administrator on 2016/11/21.
 */
require("./index.scss");
var tpl = require("./result_box.xtpl");

//块级写法\
var RESULT_BOX=PFT.Util.Class({
    //放入容器
    container:"#result_box",

//绑定事件
    EVENTS:{
         "click .btn_add":"clickAdd",
         "click .price_fix":"clickPriceFix"
    },

    //init()方法在实例化以后会默认执行
    init:function(){
        $("#result_box").append(tpl)
    },

//事件调用方法1
    showResult:function(req){
        $("table tbody tr").remove();
        if(req.length){
            for(var i =0 ;i<req.length;i++){
                var operation = "<a class='btn_add' data-id="+req[i].id+">添加</a>";

                if(req[i].created){
                    operation = "已添加|<a class='price_fix' data-id="+req[i].id+">价格配置</a>"
                }
                var tr = $("<tr data-id="+req[i].id+"><td class='col_first'>["+req[i].passport+"]"+req[i].dname+"</td><td>"+req[i].com_type+"</td><td>"+req[i].cname+"["+req[i].mobile+"]</td><td>"+operation+"</td></tr>");
                $("table tbody").append(tr);
            }
        }
    },

    clickAdd:function (e) {
        var _this=this;
        //console.log($("#csrf_token").val());
        $.post("../call/jh_mem.php",
            {action:"AddRelationShip",distor:$(e.target).attr("data-id"),token:$("#csrf_token").val()},
            function (req){
                if(req.status != "success"){
                    alert(req.msg)
                }else{
                    $(e.target).replaceWith($("<span>已添加|<a class='price_fix' data-id="+req.id+">价格配置</a></span>"));
                }
            },"json")
    },

    clickPriceFix:function (e) {
        window.location.href='../new_configuration.html?did='+$(e.target).attr("data-id")
    },
    quickAdd:function (req) {
        var operation = "<a class='btn_add' data-id="+req.id+">添加</a>";

        if(req.created){
            operation = "已添加|<a class='price_fix' data-id="+req.id+">价格配置</a>"
        }
        var tr = $("<tr><td class='col_first'>["+req.passport+"]"+req.dname+"</td><td>"+req.com_type+"</td><td>"+req.cname+"["+req.mobile+"]</td><td>"+operation+"</td></tr>");
        var data = $("table tbody .col_first");
        for(var i =0 ; i< data.length ; i++){
            if(data[i].innerHTML == "["+req.passport+"]"+req.dname){
                return false
            }
        }

        $("table tbody").append(tr);
    },
//事件调用方法2
    event2:function(){
    },

//用于函数内部自我调用的方法
    selfFunctionCall1:function(){
    }
});

//模块导出
module.exports=RESULT_BOX;