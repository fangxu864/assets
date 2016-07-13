/**
 * Created by Administrator on 15-10-21.
 */
var Core = RichBase.extend({
	statics : {
		AJAX_TIMEOUT : 60 * 1000,
		PAGE_SIZE : 5,
		DEFAULT_IMG : "http://www.12301.cc/images/defaultThum.jpg",
		LOADING_IMG : "http://www.12301.cc/images/icons/gloading.gif",
		api : {
			query : "api/inside/plist.php",
			query_debug : "api/inside/plist_dev.php"
		}
	}

});
module.exports = Core;