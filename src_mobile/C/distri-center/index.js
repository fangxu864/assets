/**
 * Created by Administrator on 16-1-5.
 */
require("./index.scss");
var GetList = require("SERVICE_M/mall-alldis").getList;
var Tpl = require("./index.xtpl");
var Loading = new PFT.Mobile.Toast();
var Main = PFT.Util.Class({
	template : PFT.Util.ParseTemplate(Tpl),
	init : function(){
		var that = this;
		GetList({
			loading : function(){
				Loading.show("loading","努力加载中...")
			},
			complete : function(){
				Loading.hide();
			},
			success : function(data){
				that.render(data);
			},
			fail : function(msg,code){
				PFT.Mobile.Alert(msg);
			}
		})
	},
	render : function(data){
		var html = this.template(data);
		$("#pageMainCon").html(html);
	}
});

$(function(){
	new Main();
})