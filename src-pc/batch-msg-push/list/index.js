require("./index.scss");

var Util = PFT.Util;
var Filter = require("./filter");
var ListManager = require("./list-manager");

var Main = {
    init : function(){
        var filter = this.Filter = new Filter();
        var listManager = this.ListManager = new ListManager();
        filter.on("search",function(params){
            listManager.refresh(params);
        });
        listManager.on("loading",function(){
            filter.setLoading(true);
        })
        listManager.on("complete",function(){
            filter.setLoading(false);
        })

        Util.ScrollManager({
            container : "#G_Body",
            timeout : 200,
            distanceAtBottom : 17,
            scroll : function(data){},
            scrollAtBottom : function(data){
                listManager.getMore();
            }
        });


        //启动
        filter.trigger("search");


    }
};


//页面入口
$(function(){ Main.init()});