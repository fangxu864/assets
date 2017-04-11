require("./index.scss");
var Tpl = require("./index.xtpl");
var Template = PFT.Util.ParseTemplate(Tpl);
var FootTotal = PFT.Util.Class({
    init : function(opt){},
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