require("./index.scss");
var Tpl = require("./index.xtpl");
var Template = PFT.Util.ParseTemplate(Tpl);
var FootTotal = PFT.Util.Class({
    EVENTS : {
        "click #submitOrderBtn" : "onSubmitOrderBtnClick"
    },
    init : function(opt){},
    onSubmitOrderBtnClick : function(e){
        var tarBtn = $(e.currentTarget);
        if(tarBtn.hasClass("disable")) return false;
        this.trigger("submit",tarBtn);
    },
    render : function(totalInfo){
        var that = this;
        this.container.html(Template(totalInfo));
        return this;
    },
    disableSubmit : function(){
        $("#submitOrderBtn").addClass("disable");
        return this;
    },
    enableSubmit : function(){
        $("#submitOrderBtn").removeClass("disable");
        return this;
    }
});

module.exports = FootTotal;