require("./index.scss");

var Common = require("../common/index.js");

var CheckRadioSelect = Common.CheckRadioSelect;

var c = CheckRadioSelect("#receiverCheckRadioSelectWrap",{
    type : "checkbox",
    name : "recType",
    checked : "1",
    option : [{
        key : 1,
        text : "系统自动筛选"
    },{
        key : 2,
        text : "指定会员"
    }],
    onSelect : function(data){
        
    }
});
c.on("select",function(data){
    console.log(data);
})


var Main = {
    init : function(){
        c.render();
    }
};


$(function(){ Main.init()})