var Common = require("../common.js");
var PageSize = Common.pageSize;
var Util = PFT.Util;
var List = Util.Class({
    state : {
        isLoading : false,
        currentPage : 1,
        hasMore : true,
        data : []
    },
    init : function(){
        this.fetch({
            page : 1
        })
    },
    fetch : function(params,opt){
        var state = this.state;
        if(state.isLoading) return false;

        PFT.Ajax(Common.api.list,{
            type : Common.ajaxType,
            ttimeout : Common.ttimeout,
            loading : function(){},
            complete : function(){},
            success : function(res){

            },
            serverError : Common.serverError
        });

    },
    hide : function(){

    }
});


module.exports = List;