/**
 * Created by Administrator on 15-7-27.
 */
var Core =  RichBase.extend({
	statics : {
		oData : null,
		STAGE_BOX_WIDTH : 50,
		STAGE_BOX_HEIGHT : 50,
		LAYOUT : { //坐位布局方式
			"0" : "倒序",     //倒序
			"3" : "正序",     //正序
			"1" : "奇数在左",  //从中间到两边 奇数在左
			"2" : "奇数在右"   //从中间到两边 奇数在右
		},
		//状态
		STATUS : {
			"normal" : {
				name : "正常",
				status_id : "0"
			},
			"reserve" : {
				name : "预留",
				status_id : "1",
				icon : "&#xe68c;",
				color : "#cd3de2"
			},
			"lock" : {
				name : "锁定",
				status_id : "2",
				icon : "&#xe62d;",
				color : "#3eba40"
			},
			"saled" : {
				name : "已出售",
				status_id : "3",
				icon : "&#xe68c;",
				color : "#e94424"
			},
			"cannel" : {
				name : "已取消",
				status_id : "4"
			},
			"forbid_sale" : {
				name : "不可售",
				status_id : "5",
				icon : "&#xe654;",
				color : "#6f6f6f"
			}
		},
		getStatusKeyByID : function(id){
			var key = "";
			if(typeof id==="undefined") return key;
			var status = this.STATUS;
			for(var i in status){
				var st = status[i];
				var st_id = st["status_id"];
				if(st_id==id){
					key = i;
					break;
				}
			}
			return key;
		},
		url : {
			getByVenueId : "call/jh_show_dev.php",
			getByRoundId : "call/jh_round.php"
		}
	},
	__VenusSeatData : {},
	getColArray : function(col,layout){
		var result = [];
		if(!col) return result;
		var layout = typeof layout=="undefined" ? "1" : layout;
		col = Number(col);
		return this["layout_"+layout] ? this["layout_"+layout](col) : null;
	},
	//倒序
	layout_0 : function(col){
		var result = [];
		for(var i=col; i>=1; i--){
			result.push(i);
		}
		return result;
	},
	//正序
	layout_3 : function(col){
		var result = [];
		for(var i=1; i<=col; i++){
			result.push(i);
		}
		return result;
	},
	//从中间到两边 奇数在左
	layout_1 : function(col){
		var result = [];
		//间隔
		if((col%2)>0){ //奇数
			for(var c=col; c>=1; c-=2) result.push(c);
			for(var c=2; c<=col-1; c+=2) result.push(c);
		}else{ //偶数
			for(var c=col-1; c>=1; c-=2) result.push(c);
			for(var c=2; c<=col; c+=2) result.push(c);
		}
		return result;
	},
	//从中间到两边 奇数在右
	layout_2 : function(col,blank){
		var result = [];
		if((col%2)>0){ //奇数
			for(var c=col-1; c>=2; c-=2) result.push(c);
			for(var c=1; c<=col; c+=2) result.push(c);
		}else{ //偶数
			for(var c=col; c>=2; c-=2) result.push(c);
			for(var c=1; c<=col; c+=2) result.push(c);
		}
		return result;
	},
	getSeatByVenueId : function(venueId,opt){
		var that = this;
		if(!venueId) return false;
		var fn = new Function;
		var opt = opt || {};
		var url = this.statics.url.getByVenueId;
		var loading = opt.loading || fn;
		var removeLoading = opt.removeLoading || fn;
		var success = opt.success || fn;
		var timeout = opt.timeout || fn;
		var error = opt.error || fn;
		var unLogin = opt.unLogin || fn;
		var adaptData = function(res){
			var areas = res.areas;
			for(var i in areas){
				var area = areas[i];
				var seats = area["seats"];
				for(var s in seats){
					var seat = seats[s];
					if(!seat["col_id"] || seat["col_id"]=="0") seat["col_id"] = seat["col_num"];
					if(!seat["row_id"] || seat["row_id"]=="0") seat["row_id"] = seat["row_num"];
					if(!seat["status"]) seat["status"] = "0";
				}
			}
			return res;
		};
		PFT.Ajax({
			url : url,
			type : "get",
			dataType : "json",
			data : {
				action : "get_venue_seat",
				venue_id : venueId
			},
			loading : function(){ loading()},
			removeLoading : function(){ removeLoading()},
			timeout : function(){ timeout()},
			serverError : function(){ error()}
		},function(res){
			var code = res.code;
			if(code==0){
				unLogin(res);
			}else{
//				var res = adaptData(res);
				that.__VenusSeatData = res.areas;
				success(res);
			}
		})
	},
	getSeatByRoundId : function(roundId,opt){
		if(!roundId) return false;
		var fn = new Function;
		var opt = opt || {};
		var url = this.statics.url.getByRoundId;
		var loading = opt.loading || fn;
		var removeLoading = opt.removeLoading || fn;
		var success = opt.success || fn;
		var timeout = opt.timeout || fn;
		var error = opt.error || fn;
		var unLogin = opt.unLogin || fn;
		PFT.Ajax({
			url : url,
			type : "get",
			dataType : "json",
			data : {
				action : "ROUND_SEAT_GET",
				round_id : roundId
			},
			loading : function(){ loading()},
			removeLoading : function(){ removeLoading()},
			timeout : function(){ timeout()},
			serverError : function(){ error()}
		},function(res){
			var code = res.code;
			if(code==0){
				unLogin(res);
			}else{
				success(res);
			}
		})
	}
});

module.exports = Core;

//
//var stageBox = {
//	id : "",       //坐位id
//	row_id : "",   //坐位排数(该坐位在第几排(物理位置))
//	col_id : "",   //坐位列数(该坐位在第几列(物理位置))
//	row_num : "",  //坐位号里的第几排
//	col_num : "",  //坐位号里的第几列
//	seat : "",     //坐位号
//	state : ""     //该坐位的状态
//};
//
