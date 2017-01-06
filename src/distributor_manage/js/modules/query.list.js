/**
 * Created by Administrator on 15-12-7.
 */
var Common = require("./common.js");
var common = new Common();
var Api = require("./api.js");
var api = new Api();
var Filter = require("./filter.js");
var PaginationX = require("COMMON/modules/pagination-x");
var NavigationBar = require("./navigationbar.js");
var QueryDisList = RichBase.extend({
	EVENTS : {
		"change" : {
			".selectBsae" : "onselectBsae"
		},
		"click" : {
			".group_move" : "group",
			".closeBtn" : "close",
			".delete" : "ondelete",
			".revise" : "onrevise",
			".cancel" : "oncancel",
			".submit" : "onsubmit",
			".delete_group" : "ondelete_group",
			".groupAdd" : "ongroupAdd",
			"#suchBtn" : "suchBtn",
			".che_all" : "che_all",
			".che_cancal" : "che_cancal",
			".group_all_move" : "group_all_move",
			".ticTypeToggleBtn" : "onTicTypeToggleBtnClick"
		}
	},
	onTicTypeToggleBtnClick : function(that,e){
			var tarBtn = $(e.currentTarget);
			var group = tarBtn.attr("group");
			var tipBox = $(".group_"+group);
			tipBox.parent().slideToggle();
			tarBtn.toggleClass("on");
	},
	init : function(){
		var that = this;
		this.filter = new Filter();
		this.navigationBar = new NavigationBar();
		this.pagination = new PaginationX({
			container : "#pagination_wrap",  //必须，组件容器id
			count : 7,                //可选  连续显示分页数 建议奇数7或9
			showTotal : true,         //可选  是否显示总页数
			jump : true	              //可选  是否显示跳到第几页
		});
		this.pagination.on("page.switch",function(toPage,currentPage,totalPage){
			// toPage :      要switch到第几页
			// currentPage : 当前所处第几页
			// totalPage :   当前共有几页
			that.pagination.render({current:toPage,total:totalPage});
			that.fetch(toPage)
		})

		this.api = new Api();
		this.tpl = $("#listTpl").html();
		this.Gtpl = $("#GroupTpl").html();
		this.Ptpl = $("#PagelistTpl").html();
		this.container_ = $("#listContainer");
		this.groudlist = $("#groud_list");
		this.alertBox = $("#alertBox");
		this.NameBox = $("#NameBox");
		this.groud_name = $("#groud_input");
		this.gMasker = $("#gMasker");
		this.leaderName = $("#leaderName");
		this.navigationBar.on("navigation",function(data){
            that.fetch(data.new_page);
        })
        this.navigationBar.on("navisub",function(data){
            that.fetch(data.new_page);
        })
        this.navigationBar.on("navipage",function(data){
            that.disfetch(data.new_page,data.group_id,data.page_size);
        })
        this.navigationBar.on("navili",function(data){
            that.disfetch(data.new_page,data.group_id,data.page_size);
        })
        this.filter.on("searchBtn",function(data){
            that.fetch(); 
        })
        this.filter.on("uploadd",function(data){
            that.upload_local();
        })
		this.fetch();
		this.prov_city_select();
	},
	upload_local : function(){
		var data = this.filter.getParams();
		PFT.Ajax({
				url : "admin/pppp.php",
				type : "get",
				dataType : "json",
				data : data
		},function(res){
			window.open('partner_dt.php?act=get_distributors&do=load_excel&'+res.lists+'', '_blank');
		})
	},
	
	che_all : function(that,e){
		var target = $(e.currentTarget);
		$(".set_check").each(function(){
			var did = $(this).attr("did");
			$(this).attr("checked","checked");
		})	
	},
	
	che_cancal : function(that,e){
		var target = $(e.currentTarget);
		$(".set_check").each(function(){
			$(this).attr("checked",null);	
		})
	},
	group_all_move : function(that,e){
		var result = [];
		$(".set_check").each(function(){
			if ($(this).is(':checked')) {
				result.push($(this).val())
			}	
		})
		var did = result.join(",");
		if(did){
			var tarBtn = $(e.currentTarget);
			var g_name = "未分组进行批量";
			var group = "0";
			that.gMasker.show();
			that.alertBox.show();
			that.alertBox.find("#groud_list").attr("did",did);
			that.alertBox.find("#groud_list").attr("from",group);
			that.alertBox.find("#groud_list").attr("type","many");
			that.alertBox.find(".change_name").html(g_name);
		}else{
			alert("您尚未选择需要批量操作的分销商！")
		}
	},
	prov_city_select : function(){
		var provs = PFT.Config.Provinces;
		var initArea = $("#area").children("input").val().split("|");
		var initProvid = initArea[0];
		var initCityid = initArea[1];
		var pSelect = $("#d_province");
		var cSelect = $("#d_city");
		var phtml = "";
		var getCityByProv = (function(){
			var citys = {};
			return function(provid){
				if(!provid) return false;
				if(citys[provid]) return cSelect.html(citys[provid]);
				PFT.Ajax({
					url : "call/getAreas.php?act=getCity&area_deeppath=2",
					type : "",
					dataType : "json",
					data : {
						parentId : provid
					}
				},function(res){
					var html = "";
					html += '<option value="" data-cityid="">请选择市（县）</option>'
					for(var i in res){
						var city = res[i];
						var cityid = city["area_id"];
						var cityname = city["area_name"];
						
						html += '<option value="'+cityid+'" data-cityid="'+cityid+'">'+cityname+'</option>'
					}
					citys[provid] = html;
					cSelect.html(html);
					setTimeout(function(){
						if(initCityid) cSelect.val(initCityid);
					},10)
				})
			}
		})();
		phtml += '<option value="" data-provid="">请选择省份</option>';
		for(var i in provs){
			var p = provs[i];
			var provid = p["area_id"];
			var prov = p["area_name"];
			phtml += '<option value="'+provid+'" data-provid="'+provid+'">'+prov+'</option>';
		}
		pSelect.html(phtml);
		pSelect.on("change",function(e){
			var $this = $(this);
			var val = $this.val();
			getCityByProv(val);
		})
		if(initProvid){
			pSelect.val(initProvid);
			getCityByProv(initProvid);
		}else{
			pSelect.trigger("change");
		}
	},
	
	disfetch : function(page,group_id,page_size){
		var that = this;
		var page = page || 1;
		var Params = this.filter.getParams();
		api.disfetchList(page,group_id,page_size,Params,{
			loading : function(){
				that.PageList("loading");
			},
			removeLoading : function(){
				that.PageList("removeLoading");
			},
			success : function(res){
				that.PageList("success",res);
			},
			empty : function(res){
				that.PageList("empty",res);
			},
			unlogin : function(){
				alert("未登录或登录状态已过期，请重新登录");
			},
			fail : function(res){ alert("请求出错请刷新重试")},
			timeout : function(res){ alert("请求超时请刷新重试")},
			serverError : function(res){ alert("请求出错请刷新重试")}
		});
	},
	
	fetch : function(page,queryParam){
		var that = this;
		var page = page || 1;
		var queryParam = queryParam || this.filter.getParams();
		api.fetchList(page,queryParam,{
			loading : function(){
				that.renderList("loading");
				that.navigationBar.hide();
				that.pagination.container.hide();
			},
			removeLoading : function(){
				that.renderList("removeLoading");
				that.pagination.container.show();
				// that.navigationBar.show();
			},
			success : function(res){
				that.renderList("success",res);
				that.navigationBar.render({current_page:res.current_page,total_page:res.total_page});
				that.pagination.render({current:parseInt(res.current_page),total:res.total_page});
			},
			empty : function(res){
				that.renderList("empty",res);
				that.navigationBar.render({current_page:page,total_page:1});
			},
			unlogin : function(){
				alert("未登录或登录状态已过期，请重新登录");
			},
			fail : function(res){ alert("请求出错请刷新重试")},
			timeout : function(res){ alert("请求超时请刷新重试")},
			serverError : function(res){ alert("请求出错请刷新重试")}
		});
	},
	fetch_change : function(page,queryParam){
		var that = this;
		var page = page || 1;
		var queryParam = queryParam || {};
		api.fetchList(page,queryParam,{
			loading : function(){
				that.renderList("loading");
				that.navigationBar.hide();
			},
			removeLoading : function(){
				that.renderList("removeLoading");
				// that.navigationBar.show();
			},
			success : function(res){
				
				that.renderList("success",res);
				that.navigationBar.render({current_page:res.current_page,total_page:res.total_page});
			},
			empty : function(res){
				that.renderList("empty",res);
				that.navigationBar.render({current_page:page,total_page:1});
			},
			unlogin : function(){
				alert("未登录或登录状态已过期，请重新登录");
			},
			fail : function(res){ alert("请求出错请刷新重试")},
			timeout : function(res){ alert("请求超时请刷新重试")},
			serverError : function(res){ alert("请求出错请刷新重试")}
		});
	},	
	renderList : function(type,data){
		if(type=="loading"){
			this.container_.children("tbody").remove();
			this.container_.children("thead").after('<tbody class="group groupLine unGroup"><tr><td colspan="4" style="padding:150px 0"><img style="vertical-align:middle; margin-right:2px;" src="'+common.loadingImg+'" alt=""/>正在加载数据...</td></tr></tbody>');
		}else if(type=="removeLoading"){
			this.container_.children("tbody").remove();
			this.container_.children("thead").after("")
		}else if(type=="empty"){
			this.container_.children("tbody").remove();
			this.container_.children("thead").after('<tbody class="group groupLine unGroup"><tr><td colspan="4" style="padding:150px 0">查无匹配分销商...</td></tr></tbody>');
		}else if(type=="success"){
			var tpl = this.tpl;
			var Gtpl = this.Gtpl;
			var template = _.template(tpl);
			var Gtemplate = _.template(Gtpl);
			var html = template({res:data});
			var Ghtml = Gtemplate({res:data});
			this.container_.children("tbody").remove();
			this.container_.children("thead").after(html);
			this.groudlist.html(Ghtml);
		}
	},
	PageList : function(type,data){
		if(type=="loading"){
		
		}else if(type=="empty"){
			
		}else if(type=="success"){
			var re = data.data;
			var gid = re["0"]["group_id"];
			var current_page = re["0"]["current_page"];
			var group_total_page = re["0"]["group_total_page"];
			var Ptpl = this.Ptpl;
			var Ptemplate = _.template(Ptpl);
			var Phtml = Ptemplate({res:data});
			$("#group_"+gid).html(Phtml);
			$(".num_"+gid).html(current_page);

		}
	},
	onselectBsae : function(that,e){
		var tarBtn = $(e.currentTarget);
		var to_ = tarBtn.val();
		var did_ = tarBtn.parent().parent().find("#groud_list").attr("did");
		var from_ = tarBtn.parent().parent().find("#groud_list").attr("from");
		var type = tarBtn.parent().parent().find("#groud_list").attr("type");
		if(to_=="0"){
			var flag = confirm('将分销商从分组中移除，该分销商将不再跟随分组的价格配置。是否继续？');
			if(flag){
				if(type=="many"){
					var data = {
						act : "move_group_many",
						to :to_,
						source : from_,
						did :did_
					}
				}else{
					var data = {
						act : "move_group",
						to :to_,
						source : from_,
						did :did_
					}
				}
				that.groupOpera(data);
			}else{
				that.gMasker.hide();
				that.alertBox.hide();
				return false;
			}
		}else{
			if(type=="many"){
				var data = {
					act : "move_group_many",
					to :to_,
					source : from_,
					did :did_
				}
			}else{
				var data = {
					act : "move_group",
					to :to_,
					source : from_,
					did :did_
				}
			}
			that.groupOpera(data);
		}
	},
	group : function(that,e){
		var tarBtn = $(e.currentTarget);
		var did = tarBtn.attr("did");
		var g_name = tarBtn.attr("g_name");
		var group = tarBtn.attr("group");
		that.gMasker.show();
		that.alertBox.show();
		that.alertBox.find("#groud_list").attr("did",did);
		that.alertBox.find("#groud_list").attr("from",group);
		that.alertBox.find(".change_name").html(g_name);

	},
	groupOpera : function(data){
		var that = this;
		var page = Number($("#whichPageInp").html());
		api.groupMove(data,{
			loading : function(){
				that.renderList("loading");
			},
			removeLoading : function(){
				that.renderList("removeLoading");
			},
			success : function(res){
				
				that.alertBox.hide();
				that.gMasker.hide();
				that.fetch_change(page);
			},
			empty : function(res){
				that.renderList("empty",res);
			},
			unlogin : function(){
				alert("未登录或登录状态已过期，请重新登录");
			},
			unfail : function(res){
				var flag = confirm('您尚未配置该分组的价格，如果将分销商移动到该分组，将清空该分销商之前配置好的价格。是否继续？');
				if(flag){
					var to_ = $(".selectBsae").val();
					var did_ = $("#groud_list").attr("did");
					var from_ = $("#groud_list").attr("from");
					var data = {
						act : "move_group",
						to :to_,
						source : from_,
						did :did_,
						confirm : "1"
					}
					that.groupOpera(data);
				}else{
					that.gMasker.hide();
					that.alertBox.hide();
					location.reload();
				}
			},
			fail : function(res){ alert(res.msg); location.reload()},
			timeout : function(res){ alert("请求超时请刷新重试")},
			serverError : function(res){ alert("请求出错请刷新重试")}
		});
	},
	groupName : function(tarBtn,that,data){
		var that = this;
		var page = Number($("#whichPageInp").html());
		api.groupName(data,{
			loading : function(){
				that.renderList("loading");
			},
			removeLoading : function(){
				that.renderList("removeLoading");
			},
			success : function(res){
				alert(res.msg);
				that.NameBox.hide();
				that.gMasker.hide();
				that.fetch(page);
			},
			empty : function(res){
				that.renderList("empty",res);
			},
			unlogin : function(){
				alert("未登录或登录状态已过期，请重新登录");
			},
			fail : function(res){
				alert(res.msg);
				that.NameBox.hide();
				that.gMasker.hide();
				that.fetch(page);
				},
			timeout : function(res){ alert("请求超时请刷新重试")},
			serverError : function(res){ alert("请求出错请刷新重试")}
		});
	},
	deletegroup : function(tarBtn,that,data){
		var that = this;
		var page = Number($("#whichPageInp").html());
		var group = tarBtn.attr("group");
		api.deletegroup(data,{
			loading : function(){
				that.renderList("loading");
			},
			removeLoading : function(){
				that.renderList("removeLoading");
			},
			success : function(res){
				alert(res.msg);
				that.fetch(page);
			},
			empty : function(res){
				that.renderList("empty",res);
			},
			unlogin : function(){
				alert("未登录或登录状态已过期，请重新登录");
			},
			fail : function(res){
				alert(res.msg);
				that.fetch(page);
				},
			timeout : function(res){ alert("请求超时请刷新重试")},
			serverError : function(res){ alert("请求出错请刷新重试")}
		});
	},
	ondelete : function(that,e){
		var tarBtn = $(e.currentTarget);
		var did = tarBtn.attr("did");
		var dtype = "0";
		var data ={
			id : did,
			dtype : dtype
		}
		that.deleteOpera(tarBtn,that,data);
	},
	deleteOpera : function(tarBtn,that,data){
		var that = this;
		var page = Number($("#whichPageInp").html());
		var dname = tarBtn.attr("dname");
		var confirmTitle = "解除与【"+dname+"】的合作关系，并删除相关产品，分销价和分销库存配置！（若想重新建立合作关系，可到“添加分销商”页面。确定删除？）"
		//if(confirm("若想重新建立合作关系，可到“添加分销商”页面。确定删除？")){
		if(confirm(confirmTitle)){
			api.groupdelete(data,{
				success : function(res){
					tarBtn.parent().parent().parent().remove();
					that.fetch(page);
					return false
				},
				
				unlogin : function(){
					alert("未登录或登录状态已过期，请重新登录");
				},
				fail : function(res){ alert("请求出错请刷新重试")},
				timeout : function(res){ alert("请求超时请刷新重试")},
				serverError : function(res){ alert("请求出错请刷新重试")}
			});
		}
	},
	
	onrevise : function(that,e){
		var tarBtn = $(e.currentTarget);
		var group = tarBtn.attr("group");
		that.NameBox.find("#groud_name").attr("did",group);
		that.leaderName.html("更改组名称");
		that.groud_name.val("");
		that.gMasker.show();
		that.NameBox.show();	
	},
	ongroupAdd : function(that,e){
		var tarBtn = $(e.currentTarget);
		that.NameBox.find("#groud_name").attr("did","-1");
		that.leaderName.html("组名称");
		that.groud_name.val("");
		that.gMasker.show();
		that.NameBox.show();	
	},
	ondelete_group : function(that,e){
		var tarBtn = $(e.currentTarget);
		var group = tarBtn.attr("group");
		var data ={
			act : "delete_group",
			gid : group
		}
		if(confirm("组内分销商将归入“未分组“，并保留已有配置")){
			that.deletegroup(tarBtn,that,data);
		}
		
		
	},
	onsubmit : function(that,e){
		var tarBtn = $(e.currentTarget);
		var did = Number(tarBtn.parent().parent().find("#groud_name").attr("did"));
		var group_name = that.groud_name.val();
		if(did=="-1"){
			var data ={
				act : "add_new_group",
				group_name : group_name
			}
		}else{
			var data ={
				act : "update_group",
				gid : did,
				group_name : group_name
			}
			
		}
		
		that.groupName(tarBtn,that,data);
	},
	oncancel : function(that,e){
		that.NameBox.hide();
		that.gMasker.hide();
	},
	close : function(that,e){
		that.alertBox.hide();
		that.gMasker.hide();		
	},
	suchBtn : function(that,e){
		location.reload();
	}
});
module.exports = QueryDisList;