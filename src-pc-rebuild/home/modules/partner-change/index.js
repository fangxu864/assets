/**
 * Created by Administrator on 2016/12/29.
 */

require("./index.scss");
var Common = require("../../common");
var Tpl = require("./index.xtpl");
var ItemTpl = require("./item.xtpl");
var Loading = require("COMMON/js/util.loading.pc");
var LoadingHtml = Loading("努力加载中...",{
	height : 400
});
module.exports = function(parent){

    var container = $('<div id="PartnerChangeBox" class="PartnerChangeBox barBox"></div>').appendTo(parent);
    //var container = Tpl.appendTo(parent);

    var PartnerChange = PFT.Util.Class({
        //debug : true,
        __hasLoaded : false,
        container : container,
        template : PFT.Util.ParseTemplate(ItemTpl),
        init : function(){
            //this.fetch();
            container.html(Tpl);
			this.listUl = container.find(".partnerList");
			this.listUl.html(LoadingHtml);
        },
        render : function(data){
             var html = this.template(data);
             this.listUl.html(html);
             this.trigger("ready");
        },
        fetch : function(){

            if(this.__hasLoaded) return false;
            this.__hasLoaded = true;

            var that = this;
            var listUl = this.listUl;


            Common.Ajax(Common.api.Home_HomeNotice.partnerChange,{
                params : {
                    size : 8,
                },
                loading : function(){
                    listUl.html(LoadingHtml);
                },
                complete : function(){
                    listUl.html("");
                },
                success : function(res){
                    var code = res.code;
                    var msg = res.msg || PFT.AJAX_ERROR_TEXT;
                    var data = res.data;
                    if(code == 200){
                        that.render({data:data})
                    }else{
                        //(code!=401) && alert(msg) 
                    }
                },
                timeout : function(){},
                serverError : function(){}
            })

            
        }
    });

    return new PartnerChange;
};


