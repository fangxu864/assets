
var Parse = require("COMMON/js/util.url.parse.query");//解析url参数

module.exports = function(params,opt){

    PFT.Util.Ajax("/r/MicroPlat_Order/order/",{
        type : "post",
        params : {
            token : params.token,
            pid : params.pid,
            aid : params.aid,
            tnum : params.tnum,
            begintime : params.begintime,
            endtime : params.endtime,
            contacttel : params.contacttel,
            ordername : params.ordername,
            paymode : params.paymode,
            sfz : params.sfz,
            idcards : params.idcards, 
            tourists : params.tourists,
            zoneid : params.zoneid,
            roundid : params.roundid,
            venusid : params.venusid,
            link : params.link,
            assembly : params.assembly

        },
        loading : opt.loading,
        complete : opt.complete,
        success : function(res){
            res = res || {};
            var code = res.code;
            var data = res.data;
            var msg = res.msg || PFT.AJAX_ERROR_TEXT;
            if(code==200){
                opt.success(data);
            }else if( code==207 ){
                var para = that.getpara();
				window.location.href = "login.html" + para ;
            }else{
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

}