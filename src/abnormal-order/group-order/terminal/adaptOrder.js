/**
 * Created by Administrator on 16-4-27.
 */
var AdaptOrder = {
	/**
	 * 判断该订单是否支持分批验证
	 * @param order
	 * @returns {boolean} true:支持   false:不支持
	 */
	batch_check : function(order){
		if(!order) return alert("缺少order参数");
		var result = true;
		var order = order || {};
		var tickets = order.tickets;
		for(var i in tickets){
			var ticket = tickets[i];
			var batch_check = ticket.batch_check;
			//只要有一张票不支分批验证，则认定此订单不支持分批验证
			//除非所有票都支持分批验证，才可判定此订单支持分批验证
			if(batch_check==0){ // 1=支持分批  0=不支持
				result = false;
				break;
			}
		}
		return result;
	},
	/**
	 * 判断该订单退票时是否需要审核  如需审核就无法修改票数
	 * @param order
	 * @returns {boolean} true:需审核   false:不需审核
	 */
	refund_audit : function(order){
		if(!order) return alert("缺少order参数");
		var result = false;
		var order = order || {};
		var tickets = order.tickets;
		for(var i in tickets){
			var ticket = tickets[i];
			var refund_audit = ticket.refund_audit;
			//只要有一张票退票时需要审核，则认定此订单退票需审核
			//除非所有票都不需审核，才可判定此订单不需审核
			if(refund_audit==1){ //1=需审核  0=不需审核
				result = true;
				break;
			}
		}
		return result;
	},
	/**
	 * 判断此订单是否可以验证
	 * 判断一个订单是否可以验证，如果此订单内的，只要一张票可以验证，即判定此订单可以验证
	 * 除非此订单下的所有票都不能验证，才能判定此订单不可验证
	 * @param order  true:可验证   false:不能验证
	 */
	check_terminal : function(order){
		// 判断一个订单是否可以验证，如果此订单内的，只要一张票可以验证，即判定此订单可以验证
		// 除非此订单下的所有票都不能验证，才能判定此订单不可验证
		var result = false;
		var tickets = order.tickets || [];
		var paystatus = order.paystatus;
		var pay = order.pay; //票的支付状态
		for(var i in tickets){
			var ticket = tickets[i];
			var status = ticket.status;
			var tnum = ticket.tnum;
			if((status==0 || status==7 ) && (pay==0 || (pay==1 && paystatus==2)) && (tnum>0)){ // 只有 未使用 | 部分使用  的订单可以验证
				result = true;
				break;
			}
		}
		return result;
	},
	/**
	 * 在订单json里加入4个字段
	 *   batch_check: 是否支持分批验证       true=支持  false=不支持
	 *   can_check  : 判断此订单是否可以验证  ture=可以   false=不可以
	 *   readonly   : 是否可以修改票数       readonly=""->可以     readonly="readonly"->不可以
	 *   tip        : 当不能修改票数时，提示用户为什么不能修改票数
	 * @param order
	 * @returns {*}
	 */
	adapt : function(order){
		if(!order) return alert("缺少order参数");
		var batch_check = this.batch_check(order);
		var can_check = this.check_terminal(order);
		var ptype = order.ptype;
		if(!ptype) return alert("缺少ptype");
		var readonly = "";
		var tip = "";
		order["batch_check"] = batch_check; //判断此订单是否支持分批验证
		order["can_check"] = can_check;     //判断此订单是否可验证
		if(batch_check){//如果支持分批验证
			//所有类型的订单都可以修改票数
			readonly = "";
		}else{//不支持分批验证
			var refund_audit = this.refund_audit(order);
			if(ptype=="F"){ //如果是套票，都不能修改票数
				readonly = "readonly";
				tip = "套票产品，不支持修改票数";
			}else if(ptype=="C"){//酒店
				if(order.tickets.length>1){ //如果是酒店产品且是联票时(票类不止一种)也不能修改票数
					readonly = "readonly";
					tip = "酒店产品的联票订单不支持修改票数";
				}else{//如果是单票
					if(refund_audit){//退票需审核(即不可修改票数)
						readonly = "readonly";
						tip = "退票需审核，不支持修改票数";
					}else{//不需审核(可修改票数)
						readonly = "";
					}
				}
			}else{//其它类型的产品
				if(refund_audit){//退票需审核(即不可修改票数)
					readonly = "readonly";
					tip = "退票需审核，不支持修改票数";
				}else{//不需审核(可修改票数)
					readonly = "";
				}
			}
		}
		order["readonly"] = readonly;
		order["tip"] = tip;
		return order;
	}
};
module.exports = AdaptOrder;