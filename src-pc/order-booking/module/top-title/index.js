require("./index.scss");
var Common = require("../../common.js");
var TopTitle = PFT.Util.Class({
    init : function(opt){
        var fsid = Common.getFsid();
        var fsaccount = Common.getFsaccount();
        var fsname = Common.getFsname();

        if(fsid && fsaccount && fsname){
            this.container.append('<p class="jidiao">您正在帮分销商<span class="fenname">'+fsname+'</span>下单</p>');
        }

    },
    render : function(data){
        var title = data.title || "";
        this.container.append('<h3 class="topTitleText mod-pl">'+title+'</h3>');
        return this;
    }
});

module.exports = TopTitle;