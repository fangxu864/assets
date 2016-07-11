/**
 * Author: huangzhiyang
 * Date: 2016/7/11 11:48
 * Description: ""
 */
require("./index.scss");
var Dialog = require("COMMON/modules/dialog-simple");
var dialog_content = require("./index.xtpl");
var Api = require("../api.js");
var Main = function(){
	var that = this;
	this.dialog = new Dialog({
		width : 680,
		height : 370,
		content : dialog_content,
		drag : true,
		onReady : function(){
			that.bankSelect = $("#bankName");
			that.provSelect = $("#provSeect");
			that.provSelect.on("change",function(e){
				console.log(e)
			})
		}
	})
};
Main.prototype = {
	__bankList : null,
	__province : null,
	getBankList : function(){
		var that = this;
		PFT.Util.Ajax(Api.url("getList"),{
			loading : function(){},
			complete : function(){},
			success : function(res){
				res = res || {};
				var data = res.data || {};
				var list = data.list;
				var province = data.province;
				if(res.code==200){
					that.__bankList = list;
					that.__province = province;
					var bankHtml = "";
					var provHtml = "";
					for(var i in list){
						var d = list[i];
						var code = d["code"];
						var name = d["name"];
						bankHtml += '<option data-name="'+name+'" value="'+code+'">'+name+'</option>';
					}
					for(var p in province){
						var d = province[p];
						var code = d["code"];
						var name = d["name"];
						provHtml += '<option data-name="'+name+'" value="'+code+'">'+name+'</option>';
					}
					that.bankSelect.html(bankHtml);
					that.provSelect.html(provHtml);
				}else{
					alert(res.msg || PFT.AJAX_ERROR_TEXT);
				}
			}
		})
	},
	open : function(){
		var that = this;
		this.dialog.open({
			onAfter : function(){

				if(!that.__bankList && !that.__province){
					that.getBankList();
				}
			}
		});
	}
};
module.exports = Main;