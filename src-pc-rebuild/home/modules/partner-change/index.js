/**
 * Created by Administrator on 2016/12/29.
 */

require("./index.scss");
var Common = require("../../common");
var Tpl = require("./index.xtpl");
var Loading = require("COMMON/js/util.loading.pc");
module.exports = function(parent){

    var container = $('<div id="PartnerChangeBox" class="PartnerChangeBox barBox"></div>').appendTo(parent);
    //var container = Tpl.appendTo(parent);

    var PartnerChange = PFT.Util.Class({
        //debug : true,
        container : container,
        //template : PFT.Util.ParseTemplate(Tpl),
        init : function(){
            this.fetch();
            console.log(this.container)
        },
        render : function(data){
             // var html = this.template(data);
             // this.container.html(html);

        },
        fetch : function(){
            var that = this;
            var html = Loading("努力加载中...");
            var container = this.container;
            Common.Ajax(Common.api.Home_HomeNotice.partnerChange,{
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
                    var msg = res.msg;
                    var data = res.data;
                    if(code == 200){
                        container.empty().append(Tpl);
                        var ul = $("#partnerList");
                        for(var i in data){
                            if (i == "toAdd"){
                                var li =$('<li>您添加了<em class="blue">'+data[i]+'</em>个分销商 <a href="">点击查看</a> </li>')
                            }else if (i == "toDel"){
                                var li =$('<li>您删除<em class="orange">'+data[i]+'</em>个分销商 <a href="">点击查看</a> </li>')
                            }else if (i == "beAdd"){
                                var li =$('<li><em class="blue">'+data[i]+'</em>个供应商添加了您 <a href="">点击查看</a> </li>')
                            }else if(i == "beDel"){
                                var li =$('<li><em class="orange">'+data[i]+'</em>个供应商删除了您 <a href="">点击查看</a> </li>')
                            }
                            ul.append(li)
                        }
                    }else{
                        console.log(msg)
                    }
                }
            })


        }
    });

    return new PartnerChange;
};


