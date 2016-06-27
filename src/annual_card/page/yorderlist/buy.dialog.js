/**
 * Author: huangzhiyang
 * Date: 2016/6/21 10:22
 * Description: ""
 */
require("./annual_dialog.scss");
var SDialog = require("COMMON/modules/dialog-simple");
var dialogTpl = require("./dialog.xtpl");
var ReadCardObj = require("../../common/readPhysicsCard.js");
var Api = require("../../common/api.js");
var AnnualCardBuyDialog = function(){
	this.init();
};
AnnualCardBuyDialog.prototype = {
	hasReadCards : {},
	init : function(){
		var that = this;
		this.buyBtn_card = null;
		this.buyBtn_virtual = null;
		this.virtualStorage = null;
		this.cardNumberInp = null;
		this.hasReadCount = null;
		this.dialog = new SDialog({
			content : dialogTpl,
			drag : true,
			events : {
				"click #readCardBtn" : function(e){
					that.onReadCardBtnClick(e);
				}
			},
			onOpenBefore : function(){

			},
			onOpenAfter : function(){
				that.buyBtn_card = $("#buyBtn_card");
				that.buyBtn_virtual = $("#buyBtn_virtual");
				that.virtualStorage = $("#virtualStorageNum");
				that.cardNumberInp = $("#cardNumberInp");
				that.hasReadCount = $("#hasReadCount");
			},
			onCloseBefore : function(){

			},
			onCloseAfter : function(){

			}
		})
		setTimeout(function(){
			that.readCardObj = new ReadCardObj({id:"readCardObj"});
		},100)
	},
	onReadCardBtnClick : function(e){
		var card_number = this.readCardObj.read();
		if(card_number){
			if(!this.hasReadCards[card_number]){
				$("#cardNumberInp").val(card_number);
				var hasReadCount = $("#hasReadCount");
				hasReadCount.text(hasReadCount.text()*1+1);
				this.hasReadCards[card_number] = 1;
			}else{
				alert("此卡已刷过，请换另一张卡");
			}
		}else{
			alert("读卡失败");
		}
	},
	open : function(){
		this.dialog.open();
	},
	/**
	 * 获取某个产品的虚拟卡的库存
	 * @param pid  产品id
	 */
	getVirtualStorage : function(pid){

	}
};

$(function(){
	var annual = new AnnualCardBuyDialog();
	setTimeout(function(){
		annual.open();
	},500)
})
