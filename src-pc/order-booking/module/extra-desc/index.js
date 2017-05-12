require("./index.scss");
var Tpl = require("./index.xtpl");
var Template = PFT.Util.ParseTemplate(Tpl);

var ExtraDesc = PFT.Util.Class({
    init : function(opt){
        this.data = opt.data;
    },
    render : function(){
        var html = Template(this.data);
        this.container.html(html);
        return this;
    }
});

module.exports = ExtraDesc;