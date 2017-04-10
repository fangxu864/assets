require("./index.scss");
var TopTitle = PFT.Util.Class({
    init : function(opt){},
    render : function(data){
        var title = data.title || "";
        this.container.html('<span class="topTitleText">'+title+'</span>');
        return this;
    }
});

module.exports = TopTitle;