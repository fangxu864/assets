/**
 * Created by Administrator on 2016/12/29.
 */

require("./index.scss");
var Common = require("../../common");
var Tpl = require("./index.xtpl");
var ItemTpl = require("./item.xtpl");
var Loading = require("COMMON/js/util.loading.pc");
var loadingHeight = Common.loadingHeight;
var LoadingHtml = Loading("努力加载中...",{
	height : loadingHeight
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
        render : function(data,type){
            if(type=="empty"){
                this.container.find(".noticeList").html('<li style="width:100%; height:100px; line-height:100px; text-align:center;">暂无产品上下架消息..</li>')
            }else{
                var html = this.template(data);
                this.container.find(".noticeList").html(html);
            }
            this.trigger("ready");
        },
        fetch : function(){

            if(this.__hasLoaded) return false;
            this.__hasLoaded = true;

            var that = this;
            var container = this.container;
            var listUl = this.container.find(".noticeList");

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
                        if(data.length==0){
                            that.render(null,"empty");
                        }else{
                            var newData = [];
                            for(var i=0,len=data.length; i<len; i++){
                                var item = data[i];
                                var time = item.create_time;
                                if(typeof time!=="string") time = "";
                                time = time.split(" ")[0];
                                item["create_time"] = time;
                                newData.push(item);
                            }
                            that.render({data:newData})
                        }
                    }else{
                        listUl.html('<div style="height:'+loadingHeight+'px; line-height:'+loadingHeight+'px" class="state serverError">'+msg+'</div>');
                        that.trigger("ready");
                    }
                },
                timeout : function(){
                    listUl.html('<div style="height:'+loadingHeight+'px; line-height:'+loadingHeight+'px" class="state timeout">'+PFT.AJAX_TIMEOUT_TEXT+'</div>');
                    that.trigger("ready");
                },
                serverError : function(){
                    listUl.html('<div style="height:'+loadingHeight+'px; line-height:'+loadingHeight+'px" class="state serverError">'+PFT.AJAX_ERROR_TEXT+'</div>');
                    that.trigger("ready");
                }
            })


        }
    });

    return new SystemNotice;
};


