/**
 * Author: huangzhiyang
 * Date: 2016/12/1 9:52
 * Description: ""
 */
require("./index.scss");
var getAppdetail = require("./appDetail_Service.js");
// var Template = {
//     appBox : PFT.Util.ParseTemplate(require("./tpl/details.tpl"))
// };

var demo = {
    isNew: true,
    isExpired: true,
}
var Main = PFT.Util.Class({
    init : function(){
        $(".section-appdetails").empty().append(require("./tpl/details.tpl"));
        // this.renderAppBox({
        //     id : "121",
        //     name : "微商城",
        //     iconCls : "sMall",
        //     priceText : ""
        //
        // })
        this.loadAjax();

    },
    renderAppBox : function(data){
        var html = Template.appBox(data);
        console.log(html);
    },

    loadAjax:function () {
        getAppdetail({},{
            success:function (req) {
                
                //后台数据导入
                $("#appName").text(req.appName);
                $("#appText").append(req.appText);
                $("#num").text(req.appUseNumber);
                $("#appDetails").text(req.appDetail);
                $("#etime").text(req.etime);
                $("#appDetails").text(req.appDetail);
                $("#price").text(req.price);
                
                
                var status = req.status;
                if(status == 0){
                    $("#btn").text("免费试用");
                    //信息提示框部分初始化
                    var btnLeft = $("#btn").offset().left;
                    var btnTop = $("#btn").offset().top;
                    $("#btn").mouseenter(function () {
                        $("#message_box_close").show().offset(function (n,c) {
                            newPos = new Object();
                            newPos.left =  btnLeft - 20;
                            newPos.top= btnTop - 80;
                            return newPos
                        })
                    }).mouseleave(function () {
                        $("#message_box_close").hide()
                    });
                }else if(status == 1){
                    $("#btn").text("续费");
                    //信息提示框部分初始化
                    var btnLeft = $("#btn").offset().left;
                    var btnTop = $("#btn").offset().top;
                    $("#btn").mouseenter(function () {
                        $("#message_box_open").show().offset(function (n,c) {
                            newPos = new Object();
                            newPos.left =  btnLeft - 50;
                            newPos.top= btnTop - 80;
                            return newPos
                        })
                    }).mouseleave(function () {
                        $("#message_box_open").hide()
                    });
                }else if(status == -1){
                    $("#btn").text("开通");
                    //信息提示框部分初始化
                    var btnLeft = $("#btn").offset().left;
                    var btnTop = $("#btn").offset().top;
                    $("#btn").mouseenter(function () {
                        $("#message_box_close").show().offset(function (n,c) {
                            newPos = new Object();
                            newPos.left =  btnLeft + 30;
                            newPos.top= btnTop - 80;
                            return newPos
                        })
                    }).mouseleave(function () {
                        $("#message_box_close").hide()
                    });
                }
            }
        })
    }
});

$(function () {
    var appDetail = new Main()
});