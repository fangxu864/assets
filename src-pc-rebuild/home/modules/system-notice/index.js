/**
 * Created by Administrator on 2016/12/29.
 */

require("./index.scss");
var Common = require("../../common");
var Tpl = require("./index.xtpl");
var Loading = require("COMMON/js/util.loading.pc");
module.exports = function(parent){

    var container = $('<div id="SystemNoticeBox" class="SystemNoticeBox barBox"></div>').appendTo(parent);

    var SystemNotice = PFT.Util.Class({
        //debug : true,
        container : container,
        template : PFT.Util.ParseTemplate(Tpl),
        init : function(){
            this.fetch();
        },
        render : function(data){
              var html = this.template(data);
              this.container.html(html);

        },
        fetch : function(){
            var that = this;
            var html = Loading("努力加载中...");
            var container = this.container;

            container.html(html);

            setTimeout(function(){
                Common.Ajax(Common.api.Home_HomeNotice.systemNotice,{
                    params : {
                        size : 8,
                    },
                    loading : function(){
                        container.html(html);
                    },
                    complete : function(){
                    },
                    success : function(res){
                        var code = res.code;
                        var msg = res.msg || PFT.AJAX_ERROR_TEXT;
                        var data = res.data;
                        if(code == 200){
                            that.render({data:data})
                        }else{
                            (code!=401) && alert(msg)
                        }
                    }
                })
            },2000)


        }
    });

    return new SystemNotice;
};

