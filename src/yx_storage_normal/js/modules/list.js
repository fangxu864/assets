/**
 * Created by Administrator on 16-2-3.
 */
var Api = require("./api.js");
var ListManager = require("./list_manager.js");
var List = RichBase.extend({
	init : function(opt){
		var that = this;
		this.container = $("#listContainerWrap");
		this.listUl = $("#listContainer");
		this.loadingBox = $("#listLoading");
		this.areaSelect = $("#areaSelect");
		this.errorBox = $("#errorStatusBox");
		this.switchBtn = $("#switchStorageBtn");
		this.tpl = require("../../tpl/list_item_tpl.html");
		this.listManager = new ListManager();
		this.getAreaList(function(res){
			setTimeout(function(){
				that.fetchList();
			},50)
		});
		this.switchBtn.on("click",function(e){
			var tarBtn = $(e.currentTarget);
			var type = tarBtn.hasClass("on") ? "close" : "open";
			if(tarBtn.hasClass("disable")) return false;
			Api.switchOpenOrClose(type,{
				loading : function(){
					tarBtn.addClass("disable");
				},
				removeLoading : function(){
					tarBtn.removeClass("disable");
				},
				success : function(res){
					tarBtn.toggleClass("on");
					var text = tarBtn.hasClass("on") ? "开启成功" : "关闭成功";
					PFT.Help.AlertTo("success",'<p style="width:180">'+text+'</p>');
				},
				fail : function(res){
					var msg = res.msg || "请求出错，请稍后重试";
					alert(msg);
				}
			})
		})
	},
	//获取分销商列表
	fetchList : function(){
		var that = this;
		var venus_id = Api.getVenusId();
		var area_id = Api.getAreaId();
		Api.fetchList(venus_id,area_id,{
			loading : function(){
				that.container.hide();
				that.errorBox.hide();
				that.loadingBox.show();
				$("#searchBtn").addClass("disable");
			},
			removeLoading : function(){
				that.loadingBox.hide();
				$("#searchBtn").removeClass("disable");
			},
			success : function(res){
				var data = res.data;
				var summary = data.summary || {};
				var status = summary.status;
				that.render(data,"success");
				if(status==1){ //开启分销商存
					that.switchBtn.addClass("on")
				}else{ //关闭
					that.switchBtn.removeClass("on")
				}
			},
			empty : function(res){that.render(null,"empty")},
			fail : function(res){that.render(res,"fail")},
			timeout : function(res){that.render(null,"timeout")},
			serverError : function(res){that.render(null,"serverError")}
		})
	},
	//获取分区
	getAreaList : function(callback){
		var that = this;
		Api.getAreaList({
			loading : function(){},
			removeLoading : function(){},
			success : function(res){
				var data = res.data || {};
				var areaList = data.area_list || [];
				if(!areaList.length) return alert("暂无该场馆对应的分区");
				var html = "";
				for(var i in areaList){
					var area = areaList[i];
					var id = area.id;
					var name = area.name;
					html += '<option value="'+id+'">'+name+'</option>';
				}
				that.areaSelect.html(html);
				callback && callback(res);
			},
			fail : function(res){
				var res = res || {};
				var msg = res.msg || "请求分区列表出错，请稍后重试";
				alert(msg);
			}
		})
	},
	render : function(data,type){
		var that = this;
		var tpl = this.tpl;
		var html = "";
		if(type=="success"){
			var list = data.list;
			var summary = data.summary;
			var total = summary.total*1;
			var reserve = summary.reserve*1;
			for(var i in list){
				var d = list[i];
				var total_num = d["total_num"];
				html += that.parseTemplate(tpl,d);
			}
			that.container.show();
			that.listUl.html(html);
			//总库存
			$("#total_total").text(summary.total);
			setTimeout(function(){
				that.listManager.setTotal_unallocated();
			},50)

		}else if(type=="empty"){
			that.container.hide();
			that.loadingBox.hide();
			that.errorBox.show().find(".t").text("无匹配条件分销商");
		}else if(type=="fail"){
			var msg = data.msg || "请求出错，请稍后重试";
			that.container.hide();
			that.loadingBox.hide();
			that.errorBox.show().find(".t").text(msg);
		}
	}
});

module.exports = List;
