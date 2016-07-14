/**
 * Created by Administrator on 15-11-19.
 */
var Query = require("./modules/query");
var queryor = null;
var Main = RichBase.extend({
	init : function(){
		queryor = new Query();
	}
});

$(function(){ new Main(); })