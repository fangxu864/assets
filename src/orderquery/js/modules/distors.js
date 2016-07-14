/**
 * Created by Administrator on 15-12-3.
 */
var Api = require("./api.js");
var api = new Api();
var Common = require("./common.js");
var common = new Common();
var Distors = RichBase.extend({
	statics : {
		allDistors : null
	},
	loading : false,
	init : function(){
		this.container = $("#distorSelectPop");
		this.isAdmin = $("#isAdmin").val()==1 ? true : false;
	},
	fetch : function(){
		var that = this;
		var container = this.container;
		if(this.loading) return false;
		api.getDistors({
			loading : function(){
				that.loading = true;
				container.html('<div style="height:150px; line-height:150px; text-align:center;"><img style="vertical-align:middle" src="'+common.loadingImg+'" alt=""/> 正在加载...</div>')
			},
			removeLoading : function(){
				that.loading = false;
				container.html("");
			},
			unlogin : function(res){
				container.html('<div style="height:150px; line-height:150px; text-align:center;">登录状态已过期，请重新登录...</div>')
			},
			timeout : function(res){},
			serverError : function(res){},
			success : function(res){
				that.statics.allDistors = res;
				that.container.html(that.render(res));
			},
			fail : function(res){}
		})
	},
	show : function(){
		if(this.isAdmin) return false;
		var allDistors = this.statics.allDistors;
		this.container.show();
		if(allDistors){
			this.container.html(this.render(allDistors));
		}else{
			this.fetch();
		}
	},
	close : function(){ this.container.hide() },
	filter : function(keyword){
		if(!this.isAdmin){
			var resultData = this.filterData(keyword);
			var html = this.render(resultData);
			this.container.html(html);
		}else{ //如果是admin帐号
			var that = this;
			var container = this.container;
			if(this.loading) return false;
			container.show();
			PFT.Ajax({
				url : "call/jh_mem.php",
				type : "get",
				dataType : "json",
				data : {
					action : "fuzzyGetDname_c",
					dname : keyword,
					dtype : 1
				},
				loading : function(){
					that.loading = true;
					container.html('<div style="height:150px; line-height:150px; text-align:center;"><img style="vertical-align:middle" src="'+common.loadingImg+'" alt=""/> 正在加载...</div>')
				},
				removeLoading : function(){
					that.loading = false;
					container.html("");
				},
				timeout : function(res){},
				serverError : function(res){}
			},function(res){
				var html = "";
				if(res.length){
					html += '<dl class="group">'
					for(var i in res){
						var d = res[i];
						var dname = d["dname"];
						var id = d["id"];
						html += '<dd class="distorItem line" data-id="'+id+'">'+dname+'</dd>';
					}
					html += '</dl>';
				}else{
					html = '<dl class="group"><dd style="height:150px; line-height:150px; text-align:center">查无匹配结果...</dd></dl>';
				}
				container.html(html);
			})
		}
	},
	filterData : function(keyword){
		keyword = $.trim(keyword);
		var allDistors = this.statics.allDistors;
		if(!keyword) return allDistors;
		var result = {};
		var upperCaseKeyword = keyword.toUpperCase();
		if((keyword.length==1) && (/^[A-Za-z]/.test(keyword)) && allDistors[upperCaseKeyword]){
			result[upperCaseKeyword] = allDistors[upperCaseKeyword];
			return result;
		}
		for(var letter in allDistors){
			var arr = allDistors[letter];
			for(var i in arr){
				var id = arr[i]["id"]
				var dname = arr[i]["dname"];
				if(dname.indexOf(keyword)>-1){
					var group = result[letter] || (result[letter]=[]);
					group.push({id:id,dname:dname});
				}
			}
		}
		return result;
	},
	render : function(data){
		var that = this;
		var html = "";
		for(var letter in data){
			var arr = data[letter];
			html += '<dl class="group">'
			html += '<dt class="letter line">'+letter+'</dt>';
			for(var i in arr){
				var d = arr[i];
				var id = d["id"];
				var dname = d["dname"];
				html += '<dd class="distorItem line" data-id="'+id+'">'+dname+'</dd>';
			}
			html += '</dl>';
		}
		if(!html) html = '<dl class="group"><dd style="height:150px; line-height:150px; text-align:center">查无匹配结果...</dd></dl>';
		return html;
	}
});
module.exports = Distors;