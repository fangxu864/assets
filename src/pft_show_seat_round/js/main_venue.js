/**
 * Created by Administrator on 15-7-27.
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
var Main = RichBase.extend({
	EVENTS : {
		"click" : {
			"#creatSeatBtn" : "onCreatSeatBtnClick",
			"#saveBtn" : "submit"
		}
	},
	init : function(){
		Stage = new mStage({container:$("#seatUlWrap")});
		Drag = new mDrag({container:$("#seatUlWrap")});
		ColHead = new mColHead({container:$("#colHead")});
		RowHead = new mRowHead({container:$("#rowHead")});
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
		this.fetchData();
	},
	onCreatSeatBtnClick : function(that,e){
		var col = that.getColCount();
		var row = that.getRowCount();
		var layout = that.getLayoutVal();
		that.updateHeadVal({col:col,row:row,layout:layout});
		that.refresh();
	},
	updateHeadVal : function(opt){
		var col = opt.col;
		var row = opt.row;
		var layout = opt.layout;
		$("#creatSeatBtn").attr("data-col",col).attr("data-row",row).attr("data-layout",layout);
	},
	//拉取数据初始页面
	fetchData : function(){
		var that = this;
		Core.getSeatByVenueId($("#hidInp_venueId").val(),{
			loading : function(){
				$("#pageMasker").show();
			},
			removeLoading : function(){
				$("#pageMasker").hide();
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
								col_id = col_num;
							}
							if(!row_id || (row_id=="0")){
								row_id = Math.ceil(index/col);
								if(row_id==0) row_id=row;
								row_id = row_num;
							}
//							console.log("col_id="+col_id+" row_id="+row_id)
							seat["col_id"] = col_id;
							seat["row_id"] = row_id;
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
				},10)
			}
		});
	},
	//保存数据到服务器
	submit : function(that,e){

		var result = window.confirm("此操作将改变分区的座位数，可能造成已设分销库存和超出总库存，确定操作？");
		if(!result) return false;

		var boxs = $("#stageUl").children();
		var data = {};
		var submitBtn = $("#saveBtn");
		var creatSeatBtn = $("#creatSeatBtn");
		var adaptData = function(data){
			var areas_re = [];
			for(var i in data["areas"]){
				var area = data["areas"][i];
				areas_re.push(area);
			}
			data["areas"] = areas_re;
			return data;
		};
		data["venue_id"] = $("#hidInp_venueId").val();
		data["venue_name"] = $("#venueTitle").text();
		data["row_num"] = creatSeatBtn.attr("data-row");
		data["col_num"] = creatSeatBtn.attr("data-col");
		data["layout"] = creatSeatBtn.attr("data-layout");
		data["areas"] = {};
		data["col_head"] = (function(){
			var arr = [];
			$("#colHead .listUl").children().each(function(){
				var tarBox = $(this);
				var col = tarBox.text();
				arr.push(col);
			})
			return arr.join(",");
		})();
		data["row_head"] = (function(){
			var arr = [];
			$("#rowHead .listUl").children().each(function(){
				var tarBox = $(this);
				var row = tarBox.text();
				arr.push(row);
			})
			return arr.join(",");
		})();
		var areas = data["areas"];
		boxs.each(function(){
			var box = $(this);
			var areaid = box.attr("data-areaid");
			if(areaid==-1) return true;
			var area = areas[areaid] || (areas[areaid]={});
			var seats = area["seats"] || (area["seats"]=[]);
			if(!area["zone_name"]) area["zone_name"] = $("#areaList_li_"+areaid).find(".t").text();
			if(!area["zone_id"]) area["zone_id"] = areaid;
			var ids = box.attr("id");
			ids = ids.substring("stageBox_".length).split("_");
			var id = box.attr("data-id");
			var row_num = box.attr("data-row");
			var col_num = box.attr("data-col");
			var row_id = ids[0];
			var col_id = ids[1];
			var seat = box.attr("data-seat");
			var state = box.attr("data-state");
			seats.push({
				id : id,
				row_num : row_num,
				col_num : col_num,
				row_id : row_id,
				col_id : col_id,
				seat : seat,
				status : state
			})
		});
		//转换数据到旧格式
		//data = adaptData(data);
//		console.log(data);
//		return false;
		PFT.Ajax({
			url : mCore.url.getByVenueId,
			type : "post",
			dataType : "json",
			data : {
				action : "set_seat",
				data : PFT.Help.JSON.stringify(data)
			},
			loading : function(){
				submitBtn.text("正在保存...").addClass("loading");
				$("#pageMasker").show();
			},
			removeLoading : function(){
				submitBtn.text("保存").removeClass("loading");
				$("#pageMasker").hide();
			},
			timeout : function(){ alert("请求超时，请稍后重试")},
			serverError : function(){ alert("请求失败，请稍后重试")}
		},function(res){
			if(res.status=="fail" && res.code==0){ //登录过期
				alert("登录过期，请重新登陆");
			}else if(res.status=="success"){
				PFT_GLOBAL.U.Alert("success",'<p style="width:120px">保存成功</p>',1000,function(){
					window.location.href="pft_show.html?m=venue_list";
				});
			}else{
				var msg = res.msg || "保存失败，请稍后重试";
				PFT_GLOBAL.U.Alert("fail",'<p style="width:200px">'+msg+'</p>');
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
	refresh : function(){
		var row = this.getRowCount();
		var col = this.getColCount();
		var layout = this.getLayoutVal();
		Stage.render({row:row,col:col,layout:layout});
		ColHead.render({col:col,layout:layout});
		RowHead.render({row:row});
		Drag.refresh({container:$("#seatUlWrap")});
	}
});
var main = new Main();
