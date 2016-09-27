/**
 * Author: huangzhiyang
 * Date: 2016/9/21 14:33
 * Description: ""
 */
require("./index.scss");
//var Calendar = require("COMMON/modules/calendar");
var Tpl = require("./rule.item.xtpl");
var Loading_Text = require("COMMON/js/util.loading.pc")("努力加载中...",{
	height : 400,
	tag : "li"
});
var Datepicker = require("COMMON/modules/datepicker");
var Main = PFT.Util.Class({
	controler : PFT.Config.Api.get("Member_VacationMode"),
	container : "#vmContainer",
	__Cache : {},
	template : PFT.Util.ParseTemplate(Tpl),
	EVENTS : {
		"click .switchBox" : "onSwitchBoxClick",
		"click .timeInp" : "onTimeInpClick",
		"click #addPageBtn" : "addRule",
		"click #ruleContainer .doActionGroup .delete" : "deleteRule",
		"click #ruleContainer .ruleItem .saveBtn" : "updateRule",
		"click #ruleContainer .checkbox" : "onCheckBoxClick",
		"click #ruleContainer .stopGroup" : "onRadioClick",
		"click #ruleContainer .rTit" : "onSldieBtnClick",
		"click #ruleContainer .slide" : "onSldieBtnClick",
		"click #ruleContainer .pageNameInp" : "onPageNameInpClick",
		"click #setGlobalSetBtn" : "onSetGlobalSetBtnClick"
	},
	init : function(){
		this.beginTimeInp = $("#beginTimeInp");
		this.endTimeInp = $("#endTimeInp");
		this.beginTimeSelect_hour = $("#beginTimeSelect-hour");
		this.beginTimeSelect_mine = $("#beginTimeSelect-mine");
		this.endTimeSelect_hour = $("#endTimeSelect-hour");
		this.endTimeSelect_mine = $("#endTimeSelect-mine");
		this.switchBox = $("#switchBox");
		this.ruleContainer = $("#ruleContainer");

		//this.datepicker = new Calendar();

		this.datepicker = new Datepicker();

		//var _datepicker = new Datepicker();
		//_datepicker.open("2016-09-15",{
		//	picker : $("#beginTimeInp")
		//});
		//_datepicker.on("switch",function(data){
		//	console.log(data);
		//})
		//_datepicker.open("2016-09",{
		//	min : "2016-09-10"
		//});
		//_datepicker.open("2016-09",{
		//	max : "2016-09-20"
		//});
		//_datepicker.open("2016-09",{
		//	todayBeforeDisable : true
		//});
		//_datepicker.open("2016-09",{
		//	todayAfterDisable : true
		//});

		//this.getGlobalRule();
		//
		//this.getRuleList();

	},
	onSwitchBoxClick : function(e){
		$(e.currentTarget).toggleClass("on");
	},
	onCheckBoxClick : function(e){
		e.stopPropagation();
		var tarBox = $(e.currentTarget);
		tarBox.toggleClass("active");
	},
	onRadioClick : function(e){
		var tarBox = $(e.currentTarget);
		var radio = tarBox.find(".radio");
		var conBox = tarBox.parents(".conBox");
		var configBox = conBox.find(".configBox");
		if(radio.hasClass("active")) return false;
		radio.addClass("active");
		tarBox.siblings().children(".radio").removeClass("active");
		if(radio.attr("data-type")==2){
			configBox.show();
		}else{
			configBox.hide();
		}
	},
	onSldieBtnClick : function(e){
		e.stopPropagation();
		var parent = $(e.currentTarget).parents(".ruleItem");
		parent.toggleClass("active").children(".conBox").slideToggle(100);
	},
	onPageNameInpClick : function(e){
		e.stopPropagation();
	},
	onSetGlobalSetBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		this.saveGlobalRule()
	},
	onTimeInpClick : function(e){
		var tarInp = $(e.currentTarget);
		var date = tarInp.val();
		var min="",max="";
		if(tarInp.hasClass("begin")){
			max = this.endTimeInp.val();
		}else{
			min = this.beginTimeInp.val();
		}
		this.datepicker.show(date,{
			picker : tarInp,
			top : 1,
			max : max,
			min : min
		});
	},
	alert : function(text,width){
		if(!text) return false;
		if(!width) width = 200;
		PFT.Util.STip("success",'<p style="width:'+width+'px">'+text+'</p>');
	},
	//添加规则
	addRule : function(e){
		this.renderRule();
	},
	//删除规则
	deleteRule : function(e){
		e.stopPropagation();
		var that = this;
		var tarBtn = $(e.currentTarget);
		if(tarBtn.hasClass("disable")) return false;
		var or_html = tarBtn.html();
		var parent = tarBtn.parents(".ruleItem");
		var id = parent.attr("data-id");
		if(!confirm("确定要删除此项设置吗？")) return false;
		if(!id){
			parent.remove();
			this.alert("删除成功");
		}else{
			PFT.Util.Ajax(that.controler("delete"),{
				type : "post",
				params : {
					id : id
				},
				loading : function(){
					tarBtn.addClass("disable").html('<img style="position:relative; width:18px; top:4px" src="'+PFT.LOADING_IMG_GIF+'"/>');
				},
				complete : function(){
					tarBtn.removeClass("disable").html(or_html);
				},
				success : function(res){
					res = res || {};
					if(res.code==200){
						parent.remove();
						that.alert("删除成功");
					}else{
						alert(res.msg || PFT.AJAX_ERROR_TEXT);
					}
				}
			})
		}
	},
	//更新,添加,保存, 规则
	updateRule : function(e){
		var that = this;
		var tarBtn = $(e.currentTarget);
		var or_text = tarBtn.html();
		if(tarBtn.hasClass("disable")) return false;
		var parent = tarBtn.parents(".ruleItem");
		var id = parent.attr("data-id");
		var api = id ? that.controler("update") : that.controler("add");

		var pageNameInp = parent.find(".pageNameInp");
		var name = $.trim(pageNameInp.val());
		if(!name) return alert("请填写页面名称");
		var linkAddrInp = parent.find(".linkAddrInp");
		var identifier = $.trim(linkAddrInp.val());
		if(!identifier) return alert("请填写页面链接地址");
		var status = parent.find(".rTit .checkbox").hasClass("active") ? 1 : 0;

		var type = parent.find(".stopGroup .active").attr("data-type");
		var config = {};
		if(type==2){
			config["queryLimit"] = parent.find(".setLine .queryLimit").hasClass("active") ? 1 : 0;
			config["reportData"] = parent.find(".setLine .reportData").hasClass("active") ? 1 : 0;
			config["clickLoad"] = parent.find(".setLine .clickLoad").hasClass("active") ? 1 : 0;
		}
		var beginHour = "00:00:00";
		var endHour = "00:00:00";

		var params = {
			name : name,
			identifier : identifier,
			type : type,
			status : status,
			config : config,
			beginHour : beginHour,
			endHour : endHour
		};
		if(id) params["id"] = id;

		PFT.Util.Ajax(api,{
			type : "post",
			params : params,
			loading : function(){
				tarBtn.addClass("disable").html("请稍后..");
			},
			complete : function(){
				tarBtn.removeClass("disable").html(or_text);
			},
			success : function(res){
				res = res || {};
				if(res.code==200){
					that.alert("保存成功");
					var id = res.data.id;
					parent.attr("id","ruleItem_"+id).attr("data-id",id);
				}else{
					alert(res.msg || PFT.AJAX_ERROR_TEXT);
				}
			}
		})
	},
	//获取规则列表
	getRuleList : function(){
		var that = this;
		var listUl = this.ruleContainer;
		PFT.Util.Ajax(this.controler("getRules"),{
			type : "get",
			params : {
				page : 1,
				pageSize : 100
			},
			loading : function(){
				listUl.html(Loading_Text);
			},
			complete : function(){
				listUl.html("");
			},
			success : function(res){
				res = res || {};
				var list = res.data.list;
				if(res.code==200 && list){
					that.renderRule(list);
				}else{
					alert(res.msg || PFT.AJAX_ERROR_TEXT)
				}
			}
		})
	},
	//获取全局设置
	getGlobalRule : function(){
		var that = this;
		var api = this.controler("getGlobalRule");
		PFT.Util.Ajax(api,{
			type : "get",
			loading : function(){},
			complete : function(){},
			success : function(res){
				res = res || {};
				if(res.code==200){
					var data = res.data;
					that.__Cache["global"] = data;
					var status = data.status;
					var date = data.config || {};
					var beginDate = date.beginDate || "";
					var endDate = date.endDate || "";
					var beginTime = data.beginHour ? data.beginHour.split(":") : [];
					var endTime = data.endHour ? data.endHour.split(":") : [];
					status==1 ? that.switchBox.addClass("on") : that.switchBox.removeClass("on");
					that.beginTimeInp.val(beginDate);
					that.endTimeInp.val(endDate);
					if(typeof beginTime[0]!=="undefined") that.beginTimeSelect_hour.val(beginTime[0]);
					if(typeof beginTime[1]!=="undefined") that.beginTimeSelect_mine.val(beginTime[1]);
					if(typeof endTime[0]!=="undefined") that.endTimeSelect_hour.val(endTime[0]);
					if(typeof endTime[1]!=="undefined") that.endTimeSelect_mine.val(endTime[1]);
				}else{
					alert(res.msg || PFT.AJAX_ERROR_TEXT);
				}
			}
		})
	},
	//保存全局设置
	saveGlobalRule : function(){
		var that = this;
		var api = this.controler("getGlobalRule");
		var _global = this.__Cache.global;
		if(!_global) _global = this.__Cache.global = {};
		_global["status"]  = this.switchBox.hasClass("on") ? 1 : 0;
		_global["config"] = {};
		_global["config"]["beginDate"] = this.beginTimeInp.val();
		_global["config"]["endDate"] = this.endTimeInp.val();
		_global["beginHour"] = this.beginTimeSelect_hour.val()+":"+this.beginTimeSelect_mine.val()+":00";
		_global["endHour"] = this.endTimeSelect_hour.val()+":"+this.endTimeSelect_mine.val()+":00";
		PFT.Util.Ajax(api,{
			type : "post",
			params : _global,
			loading : function(){},
			complete : function(){},
			success : function(res){
				res = res || {};
				if(res.code==200){
					that.alert("保存成功");
				}else{
					alert(res.msg || PFT.AJAX_ERROR_TEXT);
				}
			}
		})
	},
	//渲染规则 list = []
	renderRule : function(list){
		list = list || [];
		var _default = {
			"id": "",
			"name" : "",
			"identifier": "",
			"status": "1",
			"type": "1",
			"config": {
				"queryLimit":0, //是否查询限制,1限制,0不限制
				"reportData":0, //是否限制导出
				"clickLoad":0   //是否点击加载
			},
			"beginHour": "00:00:00",
			"endHour": "00:00:00",
			"update_time": "1473672199"
		};
		if(!list || list.length==0) list[0] = _default;
		var _list = [];
		for(var i=0; i<list.length; i++){
			(function(i){
				_list.push(PFT.Util.Mixin(_default,list[i] || {}));
			})(i)
		}

		var html = this.template({data:list});

		this.ruleContainer.append(html);

	}
});

$(function(){
	new Main();
})