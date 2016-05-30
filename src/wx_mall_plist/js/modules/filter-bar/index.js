/**
 * Author: huangzhiyang
 * Date: 2016/5/30 19:30
 * Description: ""
 */
require("./style.scss");
var UrlParse = require("COMMON/js/util.url.parse.query");
var FilterBar = Backbone.View.extend({
	PTYPE : {
		"A" : "景区",
		"C" : "酒店",
		"F" : "套票",
		"H" : "演出",
		"B" : "周边游",
		"I" : "年卡"
	},
	initialize : function(opt){
		var opt = opt || {};
		this.Api = opt.Api;
		this.Api.getTopic().then(function(topics){
			console.log(topics)
		})
		$("#page-index").append(require("./tpl.html"));
		var urlParams = UrlParse();
		var topic = urlParams.topic || "不限";
		var ptype = urlParams.ptype;
		if(topic) this.topic(topic);
		if(ptype) this.ptype(ptype);
	},
	//getor or setor
	topic : function(topic){
		var target = $("#switchTopicBtn");
		if(topic){
			if(topic=="不限"){
				target.attr("data-val","").find(".t").text("主题");
			}else{
				target.attr("data-val",topic).find(".t").text(topic);
			}
		}else{
			return target.attr("data-val");
		}
	},
	ptype : function(ptype){
		var target = $("#switchPtypeBtn");
		if(ptype){
			target.attr("data-val",ptype).find(".t").text(this.PTYPE[ptype]);
		}else{
			return target.attr("data-val");
		}
	},
	city : function(city){

	}
});
module.exports = function(opt){
	return new FilterBar(opt);
}