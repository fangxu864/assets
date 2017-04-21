
var Parse = require("COMMON/js/util.url.parse.query");//解析url参数

module.exports = function(params,opt){

    var xhr = PFT.Util.Ajax("/r/MicroPlat_Product/getCalendarPrice",{
        type : "post",
        params : {
            token : params.token,
            pid : params.pid,
            aid : params.aid,
            date : params.date
        },
        loading : opt.loading,
        complete : opt.complete,
        success : function(res){
            res = res || {};
            var code = res.code;
            var data = res.data;
            var msg = res.msg || PFT.AJAX_ERROR_TEXT;
            if(code==200){
                // if(data.length){
                    opt.success(data);
                // }else{
                    // opt.empty(data);
                // }
            }else if(code==207){
				var para = getpara();
				window.location.href = "login.html" + para ;	
			}else {
				opt.fail(msg);
			}
        }

    })

    function getpara(){
        var url = window.location.href;
        var urlPara = Parse(url);
        var fullHost = window.location.protocol + "//" +window.location.hostname + window.location.pathname;
        delete urlPara[fullHost]
        var url = "?";
        for( var i in urlPara){
            url += i +"=" + urlPara[i] + "&";
        }
        url = url.substring( 0 , url.length-1 );

        return url
    }

    return xhr

}
