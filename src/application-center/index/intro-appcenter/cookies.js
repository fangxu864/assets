

var Cookie = {

	setCookie : function(name,value,expiresYear){ //Cookie的名称、值以及过期天数

		var str = name + "=" + escape(value); 
		var exdate = new Date();
		exdate.setTime(exdate.getTime()+(365*24*3600*1000)*expiresYear);
		str+='; expires='+ exdate.toGMTString();
		document.cookie=str;

	},

	getCookie : function(name){ //传入Cookie的名称

		var arr = document.cookie.split('; ');
		console.log(arr);
		if(arr.length==0) return '';
		for(var i=0; i <arr.length; i++){
		    var tmp = arr[i].split('=');
		    if(tmp[0]==name) return unescape(tmp[1]);
		}
		return '';

	},

	delCookie : function(){
	}


}

module.exports = Cookie;















