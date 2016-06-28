/**
 * Author: huangzhiyang
 * Date: 2016/6/6 11:30
 * Description: ""
 */
var Api = require("../../../../common/api.js");
var infoItem_tpl = require("./info.item.html");
var rightsItem_tpl = require("./pck.right.item.tpl");
var Calendar = require("COMMON/modules/calendar");
var ProdSelectPop = require("../product-select-pop");
var Submit = require("../submit.js");
var Loading = require("COMMON/js/util.loading.pc.js");
var InfoManager = Backbone.View.extend({
	el : $("#slideUl"),
	events : {
		"focus .datePickerInp" : "onDatePickerInpFocus",
		"click .selectProd_picker" : "onSelectProdBtnClick",
		"click .deleteProdBtn" : "onDelectProdBtnClick",
		"click .addPckRightBtn" : "onAddPckRightBtnClick",
		"click .submitBtn" : "onSubmitBtnClick"
	},
	template : _.template(infoItem_tpl),
	rightsTemplate : _.template(rightsItem_tpl),
	initialize : function(){},
	init : function(opt){
		var that = this;
		var initData = this.initData = opt.initData;
		this.itemWidth = $("#infoManagerContainer").width();

		this.initList(initData);

		this.Calendar = new Calendar();

		this.ProdSelectPop = new ProdSelectPop({model:this.model});

		this.submit = new Submit();
		//如果提交保存时验证表单内有错误
		this.submit.on("submit.error",function(data){
			var pckId = data.pckId;
			var error = data.error;
			that.switchItem(pckId,function(){
				alert(error);
			});
		});

		//切换特权产品
		this.ProdSelectPop.on("switch.prod",function(data){
			var tid = data.tid;
			var ticketid = data.ticketid;
			var aid = data.aid;
			var prodName = data.prodName;
			var ticName = data.ticName;
			var tarItem = data.triggerItem;
			if($("#privItem_"+tid+"_"+ticketid+"_"+aid).length) return false;
			var html = that.renderPckRightList(tid,[{
				tid : ticketid,
				aid : aid,
				ltitle : prodName,
				title : ticName,
				use_limit : "-1"
			}]);
			tarItem.after(html);
			tarItem.remove();
		});
		//新增一个特权产品
		this.ProdSelectPop.on("add.prod",function(data){
			var tid = data.tid;
			var prodName = data.prodName;
			var ticketid = data.ticketid;
			var ticName = data.ticName;
			var aid = data.aid;
			if($("#privItem_"+tid+"_"+ticketid+"_"+aid).length) return alert("该产品已存在，请勿重得添加");
			var html = that.renderPckRightList(tid,[{
				tid : ticketid,
				ttitle : ticName,
				ltitle : prodName,
				aid : aid,
				use_limit : "-1"
			}]);
			$("#pckRightListUl_"+tid).append(html);
		})

	},
	//获取套餐列表，初始化slide item
	initList : function(initData){
		var that = this;
		var template = this.template;
		var html = "";
		var data = initData.data.attribute;
		var items = initData.data.otherTicket;
		for(var i in items){
			var d = null;
			var tid = items[i]["tid"];
			if(tid==that.model.getTid()){
				d = data;
				var priv = d.priv;
				d["priv"] = that.renderPckRightList(tid,priv);
				html += template({data:d});
			}else{
				html += '<li id="slideItem_'+tid+'" class="slideItem">';
				html += Loading("努力加载中..",{
					height : 1040,
					width : 798,
					id : "switchItemLoading_"+tid,
					css : {
						position : "absolute",
						top : 0,
						right : 0,
						left : 0,
						bottom : 0,
						background : "#fff"
					}
				})
				html += '</li>';
			}
		}
		this.$el.html(html).css({position:"relative"});
		this.refreshSlide();
	},
	onDatePickerInpFocus : function(e){
		var calendar = this.Calendar;
		var tarInp = $(e.currentTarget);
		var date = tarInp.val() || "2016-06-03";
		calendar.show(date,{
			picker : tarInp,
			top : 1
		})
	},
	//套餐特权-点击选择产品
	onSelectProdBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		var parent = tarBtn.parents(".pckRightItem");
		var tid = tarBtn.attr("data-tid");
		this.ProdSelectPop.open({tid:tid,triggerItem:parent,type:"switch"});
	},
	//套餐特权-点击删除产品
	onDelectProdBtnClick : function(e){
		if(!confirm("确定删除此特权产品吗？")) return false;
		var tarBtn = $(e.currentTarget);
		var tid = tarBtn.attr("data-id");
		tarBtn.parents(".pckRightItem").remove();
		if(!tid || tid<0) return false;
	},
	//套餐特权-点击新增一个产品-打开产品选择弹窗
	onAddPckRightBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		var pckId = tarBtn.attr("data-pckid");
		this.ProdSelectPop.open({
			tid : pckId,
			type : "add"
		});
	},
	//点击保存
	onSubmitBtnClick : function(e){
		var tarBtn = $(e.currentTarget);
		var pckId = tarBtn.attr("data-tid");
		if(tarBtn.hasClass("disable")) return false;
		var data = this.submit.serialize(pckId);
		if(data==null) return false;
		this.submitForm(data,tarBtn);
	},
	//提交保存数据
	submitForm : function(data,tarBtn){
		PFT.Util.Ajax(Api.Url.PackageInfo.updateTicket,{
			type : "post",
			params : data,
			loading : function(){ tarBtn.addClass("disable").text("请稍后...")},
			complete : function(){ tarBtn.removeClass("disable").text("保存")},
			success : function(res){
				res = res || {};
				var d = res.data || [];
				var data = d[0] || {};
				var code = data.code;
				var dd = data.data || {};
				var msg = dd.msg || PFT.AJAX_ERROR_TEXT;
				var tid = dd.tid;
				if(code==200){
					PFT.Util.STip("success",'<div style="width:200px">保存成功</div>');
					var tarNavItem = $("#pckTitListUl").children(".pckTitListUlItem").filter(".edit");
					var id = tarNavItem.attr("id").split("_");
					var urlParams = PFT.Util.UrlParse();
					tid && tarNavItem.attr("id",id[0]+"_"+tid);
					if(!urlParams.prod_id && tid){
						var _href = location.origin+location.pathname+"?sid="+urlParams.sid+"&prod_id="+tid;
						location.href = _href;
					}
				}else{
					alert(msg);
				}
			}
		})
	},
	//新增一个套餐详情
	createItem : function(id){
		var html = this.template({data:{tid:id}});
		this.$el.append(html);
		this.refreshSlide();
	},
	//删除一个套餐详情
	removeItem : function(tid){
		if(!tid) return false;
		$("#slideItem_"+tid).remove();
		this.refreshSlide();
		if(tid<0) return false;
		PFT.Util.Ajax(Api.Url.PackageInfo.deleteTicket,{
			type : "post",
			params : {
				tid : tid,
				status : 6
			},
			loading : function(){},
			complete : function(){},
			success : function(res){
				res = res || {};
				if(res.code==200){
					PFT.Util.STip("success",'<div style="width:200px">删除成功</div>');
				}else{
					alert(res.msg || PFT.AJAX_ERROR_TEXT);
				}
			}
		})
	},
	//切换到指定某个套餐
	switchItem : function(id,callback){
		var that = this;
		var tarItem = $("#slideItem_"+id);
		var width = this.itemWidth;
		var Cache = this.model.__Cache[id];
		if(!Cache && id>=0){
			that.model.fetchTicketInfo({
				tid : id,
				loading : function(){},
				complete : function(){ $("#switchItemLoading_"+id).remove()},
				success : function(res){
					var d = res.data.attribute;
					var priv = d.priv;
					d["priv"] = that.renderPckRightList(id,priv);
					var html = that.template({data:d});
					$("#slideItem_"+id).html(html);
				}
			})
		}
		this.$el.animate({left : -1 * tarItem.index() * width},300,function(){
			callback && callback();
		})
	},
	refreshSlide : function(callback){
		var items = this.$el.children();
		var width = this.itemWidth;
		var count = items.length;
		this.$el.width(width*count);
		callback && callback(items,width,count);
	},
	/**
	 * 渲染某个套餐的特权模块
	 * @param rights []
	 */
	renderPckRightList : function(tid,rights){
		return this.rightsTemplate({tid:tid,privilege:rights});
	},
	//获取套权商品列表里最大的index值
	getPckRightListIndexMax : function(pckId){
		var max = 0;
		$("#pckRightListUl_"+pckId).children().each(function(){
			var index = $(this).attr("data-index") * 1;
			if(index>max) max=index;
		})
		return max;
	}
});
module.exports = InfoManager;
