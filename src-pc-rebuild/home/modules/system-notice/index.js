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

    var container = $('<div id="SystemNoticeBox" class="SystemNoticeBox barBox"></div>').appendTo(parent);

    var SystemNotice = PFT.Util.Class({
        __hasLoaded : false,
        //debug : true,
        container : container,
        template : PFT.Util.ParseTemplate(ItemTpl),
        init : function(){
            //this.fetch();
            container.html(Tpl);
            this.container.find(".noticeList").html(LoadingHtml);
        },
        render : function(data){
              var html = this.template(data);
              this.container.find(".noticeList").html(html);
        },
        fetch : function(){


            if(this.__hasLoaded) return false;
            this.__hasLoaded = true;

            var that = this;
            var container = this.container;
            

            Common.Ajax(Common.api.Home_HomeNotice.systemNotice,{
                params : {
                    size : 8,
                },
                loading : function(){
                    that.container.find(".noticeList").html(LoadingHtml);
                },
                complete : function(){
                    that.container.find(".noticeList").html("");
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

    return new SystemNotice;
};


