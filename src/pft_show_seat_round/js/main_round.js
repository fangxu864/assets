/**
 * Created by Administrator on 15-8-27.
 */
var mCore = require("./core.js");
var Core = new mCore();
var Stage = null,
	mStage = require("./stage.js");
var Drag = null,
	mDrag = require("./drag.js");
var ColHead = null,
	mColHead = require("./colHead.js");
var RowHead = null,
	mRowHead = require("./rowHead.js");
var mAreaLine = require("./areaLine.js");
var AreaLine = new mAreaLine();
var isEmptyObject = function(obj){
	for(var i in obj) return false;
	return true;
};
var Main = RichBase.extend({
	EVENTS : {
		"click" : {
			"#saveBtn" : "submit"
		}
	},
	init : function(){
		var that = this;
		Stage = new mStage({container:$("#seatUlWrap")});
		Drag = new mDrag({container:$("#seatUlWrap")});
		ColHead = new mColHead({container:$("#colHead"),allow_modify:false});
		RowHead = new mRowHead({container:$("#rowHead"),allow_modify:false});
		Drag.on("mousemove",function(data){
			var isDrag = data.isDrag;
			var x = data.x;
			var y = data.y;
			var lockX = data.lockX;
			var lockY = data.lockY;
			if(!isDrag) return false;
			if(!lockX) ColHead.scroll(x);
			if(!lockY) RowHead.scroll(y);
		});
		this.fetchVenueData();
		this.buildTopStatusList();
		this.on("fetchVenueData.complete",function(data){
			that.fetchRoundData();
		})
		this.on("fetchRoundData.success",function(data){
			//获取各个分区的座位剩余数
			AreaLine.calculateSeatCount(data);
		})
	},
	updateHeadVal : function(opt){
		var col = opt.col;
		var row = opt.row;
		var layout = opt.layout;
		$("#creatSeatBtn").attr("data-col",col).attr("data-row",row).attr("data-layout",layout);
	},
	//拉取数据初始页面-场馆数据
	fetchVenueData : function(){
		var that = this;
		Core.getSeatByVenueId($("#hidInp_venueId").val(),{
			loading : function(){
				$("#pageMasker").show();
			},
			removeLoading : function(){
//				$("#pageMasker").hide();
			},
			unLogin : function(){
				alert("登录已过期，请重新登录");
				window.location.href = "http://www.12301.cc/dlogin_n.html";
			},
			success : function(res){
				var row = res.row_num ? Number(res.row_num) : 0;
				var col = res.col_num ? Number(res.col_num) : 0;
				var layout = res.layout;
				var areas = res.areas;
				var col_head = res.col_head ? res.col_head.split(",") : [];
				var row_head = res.row_head ? res.row_head.split(",") : [];
				$("#venueTitle").text(res.venue_name);
				if(!areas) return false;
				Stage.ContextMenu.buildAreaGroupMenu(areas);
				AreaLine.build(areas);
				if(!row || !col || !layout) return false;
				that.updateHeadVal({col:col,row:row,layout:layout});
				row && that.setRowCount(row);
				col && that.setColCount(col);
				layout && that.setLayoutVal(layout);
				Stage.render({row:row,col:col,layout:layout});
				ColHead.render({col:col,layout:layout,col_head:col_head});
				RowHead.render({row:row,row_head:row_head});
				Drag.refresh({container:$("#seatUlWrap")});
				setTimeout(function(){
					for(var i in areas){
						var area = areas[i];
						var areaid = area["zone_id"];
						var areaColor = $("#areaList_li_"+areaid).attr("data-color");
						var seats = area["seats"];
						for(var s in seats){
							var index = s*1+1;
							var seat = seats[s];
							var col_id = seat["col_id"];
							var row_id = seat["row_id"];
							var col_num = seat["col_num"];
							var row_num = seat["row_num"];
							if(!col_id || (col_id=="0")){
								col_id = index%col;
								if(col_id==0) col_id=row;
							}
							if(!row_id || (row_id=="0")){
								row_id = Math.ceil(index/col);
								if(row_id==0) row_id=row;
							}
							var status = seat["status"];
							var status_key = mCore.getStatusKeyByID(status);
							var id = seat["id"];
							var seatNum = seat["seat"];
							var tarBox = $("#stageBox_"+row_id+"_"+col_id);
							var icon = mCore.STATUS[status_key]["icon"];
							if(seatNum!==($("#row-head-box-"+row_id).attr("data-row")+"-"+$("#col-head-box-"+col_id).attr("data-col"))){
								tarBox.find(".t").text(seatNum).show();
							}
							tarBox.attr("data-state",status)
								.attr("data-orignstate",status)
								.attr("data-id",id)
								.attr("data-areaid",areaid)
								.attr("data-col",col_num)
								.attr("data-row",row_num)
								.attr("data-seat",seatNum)
								.css({backgroundColor:areaColor});
							if(icon){
								var st = mCore.STATUS[status_key];
								var color = st["color"];
								var background = st["background"];
								var fontSize = st["fontSize"];
								var style = [];
								if(color) style.push('color:'+color);
								if(background) style.push('backgroundColor:'+background);
								if(fontSize) style.push('fontSize:'+fontSize);
								style = style.length ? style.join(";") : "";
								tarBox.find(".state").show().html('<span class="sicon"><i style="'+style+'" class="iconfont">'+icon+'</i></span>');
							}else{
								tarBox.find(".state").hide().html("");
							}
						}
					}
					that.fire("fetchVenueData.complete",res);
				},10)
			}
		});
	},
	//获取场次座位信息
	fetchRoundData : function(){
		var that = this;
		var stageUl = $("#stageUl");
		Core.getSeatByRoundId($("#hidInp_roundId").val(),{
			loading : function(){ $("#pageMasker").show()},
			removeLoading : function(){ $("#pageMasker").hide()},
			success : function(res){
				var collection = res.collection;
				for(var i in collection){
					var coll = collection[i];
					var seatId = coll["seat_id"];
					var status = coll["status"];
					if(seatId && status){
						that.setSeatStatusBySeatId(seatId,status);
					}
				}
				that.fire("fetchRoundData.success",res);
			},
			unLogin : function(){
				alert("登录状态过期，请重新登录");
				window.location.href = "http://www.12301.cc/dlogin_n.html";
			},
			timeout : function(){ alert("请求超时，请稍后重试")},
			serverError : function(){ alert("请求失败，请稍后重试")}
		})
	},
	//设置某个座位的状态 by 座位id
	setSeatStatusBySeatId : function(seatId,status_val,callback){
		var that = this;
		if(!seatId || !status_val) return false;
		var stageUl = $("#stageUl");
		var status_key = mCore.getStatusKeyByID(status_val);
		var status = mCore.STATUS[status_key];
		var icon = status["icon"];
		var color = status["color"];
		var background = status["background"];
		var fontSize = status["fontSize"];
		var style = [];
		if(color) style.push('color:'+color);
		if(background) style.push('backgroundColor:'+background);
		if(fontSize) style.push('fontSize:'+fontSize);
		style = style.length ? style.join(";") : "";
		//if(icon){
		//	stageUl.children().filter(function(){
		//		return ($(this).attr("data-id") == seatId);
		//	}).attr("data-roundstate",status_val).find(".state").show().html('<span class="sicon"><i style="'+style+'" class="iconfont">'+icon+'</i></span>');
		//}else{
		//	stageUl.children().filter(function(){
		//		return ($(this).attr("data-id") == seatId);
		//	}).attr("data-roundstate",status_val).find(".state").hide();
		//}
		if(icon){
			stageUl.children().filter(function(){
				return ($(this).attr("data-id") == seatId);
			}).attr("data-state",status_val).attr("data-orignstate",status_val).find(".state").show().html('<span class="sicon"><i style="'+style+'" class="iconfont">'+icon+'</i></span>');
		}else{
			stageUl.children().filter(function(){
				return ($(this).attr("data-id") == seatId);
			}).attr("data-state",status_val).attr("data-orignstate",status_val).find(".state").hide();
		}
		callback && callback();
	},
	//保存数据到服务器
	submit : function(that,e){
		var round_id = $("#hidInp_roundId").val();
		var stageUl = $("#stageUl");
		var submitBtn = $("#saveBtn");
		var data = {};
		data["action"] = "ROUND_SEAT_SET";
		data["round_id"] = round_id;
		data["zones"] = {};

		stageUl.children().each(function(){
			var box = $(this);
			var areaid = box.attr("data-areaid");
			var seatid = box.attr("data-id");
			var state = box.attr("data-roundstate");
			if(!state){
				state = box.attr("data-state");
			}
			//if(state=="4") state=0;
			var orignState = box.attr("data-orignstate");
			//if(orignState=="4") orignState=0;

			if(areaid==-1) return true;

			//var oldState = that.getOriginState(seatid);

			if(orignState==state) return true; //如果sate没有被用户改动过，则不提动以节省数据传输量

			if(seatid && state && state!="-1"){
				var area = data["zones"][areaid] ? data["zones"][areaid] : (data["zones"][areaid]={});
				//if(state=="4" || state=="5") state = 0;
				area[seatid] = state;
			}
		})

		if(isEmptyObject(data.zones)) return alert("您尚未对座位做出修改");

		PFT.Ajax({
			url : mCore.url.getByRoundId,
			type : "POST",
			dataType : "json",
			data : data,
			ttimeout : 3 * 60 * 1000,
			loading : function(){ submitBtn.text("正在保存...").addClass("loading")},
			removeLoading : function(){submitBtn.text("保存").removeClass("loading")},
			timeout : function(){ alert("请求超时，请稍后重试")},
			serverError : function(){ alert("请求失败，请稍后重试")}
		},function(res){
			var code = res.code;
			var msg = res.msg || "保存出错，请稍后重试";
			if(code==200){
				PFT_GLOBAL.U.Alert("success",'<p style="width:160px">保存成功</p>',1000,function(){
					var venue_id = $("#hidInp_venueId").val();
//					venue_id && (window.location.href="pft_show.html?m=rounds&rid="+venue_id)
				});
			}else if(code==0){
				alert("登录过期，请重新登陆");
			}else{
				alert(msg);
			}
		})
	},
	getRowCount : function(){
		var val = $("#rowInp").val() || 0;
		return Number(val);
	},
	getColCount : function(){
		var val = $("#colInp").val() || 0;
		return Number(val);
	},
	getLayoutVal : function(){
		return $("#topFormGroup").find("input.layoutRadio:radio:checked").attr("data-layout");
	},
	setRowCount : function(count){
		if(typeof count=="undefined") return false;
		$("#rowInp").val(count);
	},
	setColCount : function(count){
		if(typeof count=="undefined") return false;
		$("#colInp").val(count);
	},
	setLayoutVal : function(val){
		if(typeof val=="undefined") return false;
		$("#topFormGroup").find(".layoutRadio").removeAttr("checked");
		$("#radioLayout_"+val).trigger("click");
	},
	buildTopStatusList : function(){
		var status = mCore.STATUS;
		var html = "";
		for(var i in status){
			var st = status[i];
			var st_id = st["status_id"];
			var st_name = st["name"];
			var icon = st["icon"];
			if(!icon) continue;
			var color = st["color"];
			var background = st["background"];
			var fontSize = st["fontSize"];
			var style = [];
			if(color) style.push('color:'+color);
			if(background) style.push('backgroundColor:'+background);
			if(fontSize) style.push('fontSize:'+fontSize);
			style = style.length ? style.join(";") : "";
			html += '<li data-state="'+st_id+'" class="item item_'+i+'"><i style="'+style+'" class="iconfont">'+icon+'</i><span class="t">'+st_name+'</span></li>';
		}
		$("#statusUl").html(html);
	},
	refresh : function(){
		var row = this.getRowCount();
		var col = this.getColCount();
		var layout = this.getLayoutVal();
		Stage.render({row:row,col:col,layout:layout});
		ColHead.render({col:col,layout:layout});
		RowHead.render({row:row});
		Drag.refresh({container:$("#seatUlWrap")});
	},

	//通过seatid  查找该座位对应的原始状态(state，页面初始化时，数据刚拉取下来时的状态)
	getOriginState : function(seatid){
		if(!seatid) return null;
		var oData = Core.__CacehMergeData;
		var status = oData[seatid];
		if(!status) return null;
		return status;
	}
});
module.exports = Main;
