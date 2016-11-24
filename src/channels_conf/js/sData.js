/**
 * Created by Administrator on 15-6-26.
 */
var sData = (function(){
	// var Data = {
		// "lid_sid" : {
			// "title" : "",
			// "tids" : {
				// "tid1" : {
					// tname : "",
					// uprice : "",
					// jsprice : "",
					// pid : "",
					// aid : "",
					// lid : "",
					// tid : ""
				// },
				// "tid2" : {
					// tname : "",
					// uprice : "",
					// jsprice : "",
					// pid : "",
					// aid : "",
					// lid : "",
					// tid : ""
				// }
			// }
		// }
	// };
	var Data = {};
	var cbs = [];
	return{
		get : function(){
			return Data;
		},
		set : function(lid_sid,tid,opt,callback){
			if(!lid_sid) return false;
			var landData = null;
			console.log(lid_sid)
			console.log(tid)
			console.log(opt)
			console.log(callback)
			var tidData, tData, title, tname, lid, aid, pid, uprice, jsprice, count;
			if(opt){ //添加
				active = opt.active;
				if(!tid) return false;
				landData = Data[lid_sid] ? Data[lid_sid] : (Data[lid_sid]={});
				tidData = landData["active"] ? landData["active"] : (landData["active"]={});
				tData = tidData[tid] ? tidData[tid] : (tidData[tid]={});
				tData["acitve"] = active;
			}else{ //删除
				var empty = true;
				landData = Data[lid_sid];
				if(!landData["active"]) return false;
				if(!tid){
					landData["active"] = {};
				}else{
					landData["active"][tid] = {};
					delete landData["active"][tid];
				}
				for(var i in landData["active"]){
					empty = false;
					break;
				}
				if(empty){
					Data[lid_sid] = {};
					delete Data[lid_sid];
				}
			}
			(typeof callback=="function") && callback(Data);
			for(var i in cbs){
				cbs[i] && (typeof cbs[i]=="function") && cbs[i](Data);
			}
		},
		setCount : function(lid_sid,tid,count){
			if(!lid_sid || !tid) return false;
			var landData = Data[lid_sid];
			if(landData){
				var tids = landData.tids;
				if(tids){
					var tic = tids[tid];
					if(tic){
						tic["count"] = count;
					}
				}
			}
		},
		on : function(type,fn){
			if(type=="change" && typeof fn=="function"){
				cbs.push(fn);
			}
		},
		adapt : function(data){
			for(var i in data){
				var od = data[i];
				var lid_sid = i;
				var tickets = od["ticket"];
				if(Data[lid_sid]){
					var tids = Data[lid_sid]["tids"];
					for(var t in tickets){
						var tic = tickets[t];
						var tid = tic["tid"];
						if(tids[tid]){
							tic["isSelected"] = 1;
						}
						else{
							alert("mei")
						}
					}
				}
			}
			return data;
		}
	}

})();

