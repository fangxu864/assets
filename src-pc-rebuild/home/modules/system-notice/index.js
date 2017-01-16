/**
 * Created by Administrator on 2016/12/29.
 */

require("./index.scss");
var Common = require("../../common");
var Tpl = require("./index.xtpl");
var Loading = require("COMMON/js/util.loading.pc");
module.exports = function(parent){

    var container = $('<div id="SystemNoticeBox" class="SystemNoticeBox barBox"></div>').appendTo(parent);
    //var container = Tpl.appendTo(parent);

    var SystemNotice = PFT.Util.Class({
        //debug : true,
        container : container,
        //template : PFT.Util.ParseTemplate(Tpl),
        init : function(){
            this.fetch();
        },
        render : function(data){
             // var html = this.template(data);
             // this.container.html(html);

        },
        fetch : function(){
            var that = this;
            var html = Loading("努力加载中...");
            var container = this.container;
            Common.Ajax(Common.api.Home_HomeNotice.systemNotice,{
                loading : function(){
                    container.html(html);
                },
                complete : function(){
                },
                success : function(res){
                    var code = res.code;
                    var msg = res.msg;
                    var data = res.data;
                    if(code == 200){
                        container.empty().append(Tpl);
                        var ul = $("#noticeList");
                        for(var i in data){
                            var li =$('<li><span class="noticeTitle">'+data[i].title+'</span><span class="noticeTime">'+data[i].create_time+'</span></li>')
                            li.attr("title",data[i].title);
                            li.attr("id",data[i].id);
                            ul.append(li)
                        }
                    }else{
                        console.log(msg)
                    }
                }
            })


        }
    });

    return new SystemNotice;
};


