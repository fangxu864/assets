/**
 * Created by Administrator on 16-4-6.
 */
require("../css/fenx_storage_default.css");
var List = require("./modules/list.js");
var Main = RichBase.extend({
	init : function(){
		this.areaSelect = $("#areaSelect");
		this.switchBtn = $("#switchStorageBtn");
		this.list = new List();
		this.bindEvents();

	},
	bindEvents : function(){
		var that = this;
		this.areaSelect.on("change",function(e){
			that.list.fetchList();
		})
	}
});

$(function(){ new Main()})