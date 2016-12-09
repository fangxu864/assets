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
                
            }
        })
    }
});

$(function () {
    var appDetail = new Main()
});