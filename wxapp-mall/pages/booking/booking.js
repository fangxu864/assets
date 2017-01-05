//index.js
//获取应用实例
var Common = require("../../utils/common.js");
var app = getApp();
Page({
    data: {
		isReady : false,
        date : Common.getToday(),
        title : "产品预订页",
		aid : "",
		pid : "",
		totalMoney : 0,
		contacttel : "",
		ordername : "",
		ticketList : [{
			pid : "",
			aid : "",
			title : "票名称111",
			buy_up : "10",
			buy_low : "1",
			jsprice : 23,
			tprice : 23,
			store : 100,
			value : 1
		},{
			pid : "222",
			aid : "322",
			title : "票名称222",
			buy_up : "4",
			buy_low : "2",
			jsprice : 23,
			tprice : 23,
			store : 5,
			value : 0
		}]
    },
    onReady : function(){
        let that = this;
		let data = this.data;
		let pid = data.pid;
		let aid = data.aid;
        wx.setNavigationBarTitle({
          title: that.data.title
        })

		//wx.getStorage({
		//	key : "SSS",
		//	success : function(res){
		//		console.log(res)
		//	},
		//	fail : function(err){
		//		console.log("fail")
		//		console.log(err)
		//	}
		//})


		if(pid && aid){
			this.queryBookingInfo(pid,aid);
		}else{
			wx.showModal({
				title : "提示",
				content: "缺少pid或aid",
				showCancel : false
			})
		}
    },
	onLoad: function (option) {
		this.setData({
			aid : option.aid || "3385",
			pid : option.pid || "11138"
		})
	},
	onShow : function(){ },
	onHide : function(){ },
	onCountBtnTap : function(e){
		let dataset = e.currentTarget.dataset;
		let type = dataset.type;
		let value = dataset.value * 1;
		let store = dataset.store * 1;
		let buyup = dataset.buyup * 1;
		let buylow = dataset.buylow * 1;
		let isMain = dataset.ismain;
		let ticketId = dataset.id;
		if(type=="add"){
			if(value>=store && store!=-1){
				return wx.showModal({
					title: '提示',
					content: "库存不足",
					showCancel : false
				})
			}
			if(value>=buyup && buyup!=-1){
				return wx.showModal({
					title: '提示',
					content: "限购"+buyup+"张",
					showCancel : false
				})
			}

			value = value +1;
			if(value<buylow) value = buylow;


		}else if(type=="minus"){
			if(value<=buylow && value!=-1 && isMain){
				return wx.showModal({
					title: '提示',
					content: buylow+"张起订",
					showCancel : false
				})
			}
			if(value<0){
				return wx.showModal({
					title: '提示',
					content: "票数不能为负数",
					showCancel : false
				})
			}
			if(value==0 && isMain){
				return wx.showModal({
					title: '提示',
					content: "主票票数不能为0",
					showCancel : false
				})
			}

			value = value-1;
			//如果非主票，且票数小于最少起购数，则直接把数据置为0
			if(!isMain && value<buylow) value = 0;
		}

		let newTicketList = this.data.ticketList.map(function(ticket){
			let pid = ticket.pid;
			let aid = ticket.aid;
			if(ticketId==(pid+"-"+aid)){
				ticket["value"] = value;
			}
			return ticket;
		});

		this.setData({ticketList:newTicketList});

		this.calTotalMoney();

	},
	onContacttelInpBlur : function(e){
		var detail = e.detail;
		var value = detail.value;
		if(value.length!=11 && !isNaN(value)){

		}else{

		}
		console.log(this.data.contacttel)
	},
	onOrderNameInpBlur : function(e){
		console.log(this.data.ordername)
	},
    bindDateChange : function(result){
		var date = result.detail.value;
		this.setData({date : date});

		let pids = this.data.ticketList.map(function(item){
			return item.pid;
		}).join("-");

		this.queryPriceAndStore(pids,this.data.aid,date);

    },
	//初始化时请求产品详情
	queryBookingInfo : function(pid,aid){
		let that = this;
		Common.request({
			url : "/r/Mall_Product/getBookInfo/",
			data : {
				pid : pid,
				aid : aid
			},
			loading : function(){
				Common.showLoading()
			},
			complete : function(){
				Common.hideLoading();
			},
			success : function(res){
				that.setData({
					isReady : true
				})
			}
		})
	},
	//请求库存价格
	queryPriceAndStore : function(pids,aid,date){
		let that = this;
		Common.request({
			debug : 1,
			url : "",
			data : {
				pids : pids,
				aid : aid,
				date : date
			},
			loading : function(){
				Common.showLoading("正在请求库存价格..");
			},
			complete : function(){
				Common.hideLoading();
			},
			success : function(res){
				var data = {
					111 : {
						price : "0.34",
						store : 5
					}
				};

				let ticketList = that.data.ticketList;
				let newTicketList = [];

				for(let i in data){
					let result = data[i];
					let price = result.price;
					let store = result.store;
					ticketList.forEach(function(ticket){
						let pid = ticket.pid;
						if(i==pid){
							newTicketList.push(that.updateTicketPriceStore(ticket,price,store));
						}else{
							newTicketList.push(ticket);
						}
					})
				}

				that.setData({ticketList:newTicketList});
				that.calTotalMoney();

			}
		})
	},
	//日历切换时，把请求回来的数据跟现有数据对比，更新ticketList
	updateTicketPriceStore : function(ticket,price,store){
		let value = ticket.value;

		ticket["tprice"] = price;  //更新价格
		ticket["store"] = store;  //更新库存

		if(store!=-1){
			if(store<value){ //如果当前的票数已经大于新的库存值,则票数需重置,此时无须考虑buyup值，因为任何时候程序都会保证value<=buyup
				value = store;
				ticket["value"] = value;
			}
		}



		return ticket;

	},

	//计算总金额
	calTotalMoney : function(){
		var total = this.data.ticketList.reduce(function(prev,current,currentIndex){
			return (prev.value*1 * prev.tprice*1) + (current.value*1 * current.tprice*1);
		});
		this.setData({totalMoney:total});
	}

})
