/**
 * Created by Administrator on 15-10-21.
 */
var Searchor = RichBase.extend({
	statics : {
		getParams : function(){
			var params = {};
			var keyword = this.getKeyword();
			var ptype = this.getPtype();
			var provid = this.getProvid();
			var cityid = this.getCityid();
			var topic = this.getTopic();
			params["ltitle"] = keyword;
			params["ptype"] = ptype;
			params["provice"] = provid;
			params["city"] = cityid;
			params["topic"] = topic;
			return params;
		},
		getKeyword : function(){
			return $("#searchInp").val();
		},
		getPtype : function(){
			return $("#ptypeParmUl").children(".active").attr("data-ptype") || "";
		},
		getProvid : function(){
//			return $("#proviceParamUl").children(".active").attr("data-provice") || "";
			return $("#pSelectTrigger").attr("data-province") || "";
		},
		getCityid : function(){
//			return $("#cityParamUl").children(".active").attr("data-city") || "";
			return $("#cSelectTrigger").attr("data-city") || "";
		},
		getTopic : function(){
			return $("#topicParamUl").children(".active").attr("data-topic") || "";
		}
	},
	EVENTS : {
		"click" : {
			".advanceSearchBox .toggleBtn" : "onAdanceSearchMoreClick",
			".advanceSearchBox .item" : "onAdanceSearchItemClick",
			".searchBtn" : "onSearchBtnClick",
			".recoverSearchBtn" : "onRecoverSearchBtnClick"
		}
	},
	init : function(opt){
		this.container = opt.container;
		var moreSearchTrigger = this.moreSearchTrigger = $("#moreSearchTrigger");
		var advanceSearchBox = this.advanceSearchBox = $("#advanceSearchBox");
	},
	initSearchItem : function(data){
		var themes = data.themes;
		var provs = data.provices;
		var dthemes = {};
		var dprovs = {};
		for(var i in themes){
			dthemes[i] = {};
			dthemes[i]["name"] = i;
			dthemes[i]["count"] = themes[i];
		}
		for(var i in provs){
			dprovs[i] = {};
			dprovs[i]["name"] = provs[i]["name"];
		}
		var provsHtml = this.builtSearchItem({
			title : "所在省份",
			param : "provice",
			data : dprovs
		});
//		var citysHtml = this.builtSearchItem({
//			title : "所在城市",
//			param : "city",
//			data : citys
//		});
		var tmemesHtml = this.builtSearchItem({
			title : "旅游主题",
			param : "topic",
			data : dthemes
		});
		this.advanceSearchBox.children(".con").append(tmemesHtml);
		this.initSelect(data);
	},
	initSelect : function(data){
		var that = this;
		var data = this.statics.Provice_City_Cache = data.provices || {};
		var provs = [{province:"",text:"不限"}];
		var getCitysByProvid = function(id){
			var res = [{city:"",text:"不限"}];
			if(!data[id]) return res;
			var citys = data[id]["citys"];
			for(var i in citys){
				var d = citys[i];
				var js = {};
				js["city"] = i;
				js["text"] = d.name;
				res.push(js);
			}
			return res;
		};
		for(var i in data){
			var d = data[i];
			var js = {};
			js["province"] = i;
			js["text"] = d.name;
			provs.push(js);
		}
		this.pSelect = new PFT.UI.Select({
			triggerInp : $("#pSelectTrigger"),
			iconBtn : $("#pSelectTriggerIcon"),
			paramId : "province",
			isFilter : false,
			tpl : function(){
				return '<li class="ui-select-option" data-province="<%=province%>"><span class="t"><%=text%></span></li>'
			},
			filter : function(data,keyword){},
			data : provs
		})
		this.cSelect = new PFT.UI.Select({
			triggerInp : $("#cSelectTrigger"),
			iconBtn : $("#cSelectTriggerIcon"),
			paramId : "city",
			isFilter : true,
			tpl : function(){
				return '<li class="ui-select-option" data-city="<%=city%>"><span class="t"><%=text%></span></li>'
			},
			filter : function(data,keyword){
				var res = [];
				for(var i in data){
					var d = data[i];
					var text = d["text"];
					if(text.indexOf(keyword)>-1) res.push(d);
				}
				return res;
			},
			data : []
		})
		this.pSelect.on("option.click",function(data){
			var provinceId = data.id;
			var citys = getCitysByProvid(provinceId);
			data.tarOption.addClass("active").siblings().removeClass("active");
			that.cSelect.setData(citys);
			that.cSelect.updateListUl();
		})
	},
	onAdanceSearchMoreClick : function(that,e){
		var tarBtn = $(e.currentTarget);
		tarBtn.toggleClass("on");
		tarBtn.prev().toggleClass("on");
	},
	onAdanceSearchItemClick : function(that,e){
		var tarItem = $(e.currentTarget);
		if(tarItem.hasClass("active")) return false;
		tarItem.addClass("active").siblings().removeClass("active");
	},
	onSearchBtnClick : function(that,e){
		that.fire("search",that.statics.getParams());
	},
	onRecoverSearchBtnClick : function(that,e){
		that.resetAllSearch();
		that.fire("reset");
	},
	resetAllSearch : function(){
		$("#searchInp").val("");
		$("#ptypeParmUl").children(".first").addClass("active").siblings().removeClass("active");
//		$("#proviceParamUl").children(".first").addClass("active").siblings().removeClass("active");
//		$("#cityParamUl").children(".first").addClass("active").siblings().removeClass("active");
		$("#topicParamUl").children(".first").addClass("active").siblings().removeClass("active");
		this.pSelect.refresh();
	},
	builtSearchItem : function(opt){
		var title = opt.title;
		var param = opt.param;
		var data = opt.data;
		var html = "";
		if(data && Object.prototype.toString.call(data)=="[object Object]" && !PFT.Help.isEmptyObj(data)){
			html += '<div class="line"><div class="inCon"><div class="lt">'+title+'</div><ul id="'+param+'ParamUl" class="listUl '+param+'ParamUl">';
			html += '<li class="item first active"><a href="javascript:;" data-'+param+'="">全部</a></li>';
			for(var i in data){
				var d = data[i];
				var name = d["name"];
				html += '<li class="item" data-'+param+'="'+i+'"><a href="javascript:;"><span class="name">'+name+'</span></a></li>';
			}
			html += '</ul></div><a class="toggleBtn" href="javascript:;"><span class="t">更多</span><i class="iconfont down">&#xe673;</i><i class="iconfont up">&#xe695;</i></a></div>';
		}
		return html;
	}
});
module.exports = Searchor;