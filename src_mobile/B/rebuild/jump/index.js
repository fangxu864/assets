var Toast = new PFT.Mobile.Toast();
var Alert = PFT.Mobile.Alert;
var Jump =PFT.Util.Class({
    container:"#bodyContainer",
    init:function(){
        this.loadLogOut();
    },
    loadLogOut: function(){
        var _this=this;
        PFT.Util.Ajax("/r/MicroPlat_Member/logout",{
            type:"POST",
            params:{
                token:PFT.Util.getToken()
            },
            dataType:"json",
            success:function(res){
                if(res.code==200){
                    _this.loadingReq();
                }else{
                    Alert(res.msg);
                }
            },
            serverError:function(){
                Alert(PFT.AJAX_ERROR_TEXT);
            },
            timeout: function(){
				Alert(PFT.AJAX_TIMEOUT_TEXT);
			},

        })
    },
    loadingReq:function(){
        var urlParams = PFT.Util.UrlParse();
        var params={
                c:'MicroPlat_Member',
                a:'friendWx',
                token:PFT.Util.getToken(),
                appid:urlParams["appid"],
                fid:urlParams["fid"],
                m:urlParams["m"],
                p_type:urlParams["p_type"],
                account:urlParams["account"],
                ctype:urlParams["ctype"],
                ctx:urlParams["ctx"]
        }
        PFT.Util.Ajax("/r/MicroPlat_Member/friendWx",{
            type:"POST",
            dataType:"json",
            params:params,
            loading:function(){
                Toast.show("loading", "努力加载中...");
            },
            complete:function(){
                Toast.hide("loading", "努力加载中...");
            },
            success: function(res){
                if(res.code==200){
                var url=res.data.url;
                var search=window.location.search;
                //Nurl=url+search;
                //return console.log(Nurl,res.code);
                
                 window.location.href=url;
                }else{
                    Alert(res.msg);
                }
            },
            serverError:function(){
                Alert(PFT.AJAX_ERROR_TEXT);
            },
            timeout: function(){
				Alert(PFT.AJAX_TIMEOUT_TEXT);
			},

        })
    }
})

$(function(){
    new Jump();
})