/**
 * Author: huangzhiyang
 * Date: 2016/6/14 15:55
 * Description: ""
 */
var Header = Backbone.View.extend({
	el : $("#card_headerContaienr"),
	events : {
		"click #createCardListBtn" : "onCreateCardListBtnClick"
	},
	MAX_COUNT : 50, //单次生成新卡的最大数量
	initialize : function(){
		this.cardCountInp = $("#cardCountInp");
		this.cardListUl = $("#cardList");
	},
	//点击生成卡号
	onCreateCardListBtnClick : function(e){
		var that = this;
		var count = $.trim(this.cardCountInp.val());
		if(!PFT.Util.Validate.typeInit0(count)) return alert("生成数量请填写正整数");
		if(count>this.MAX_COUNT) return alert("单次最多只能生成"+this.MAX_COUNT+"张");
		if(this.cardListUl.children(".cardItem").length) return alert("请先将已生成的卡保存，方可再次生成新卡");
		var result = [];
		for(var i=0; i<count; i++){
			result.push(that.createCardNumber());
		}
		this.trigger("create.card",{cards:result});
	},
	//点击关联实体卡
	onRelateSHCardBtnClick : function(e){
		console.log("click");
		this.trigger("onRelateSHCardBtnClick");
	},
	createCardNumber : function(){
		var result = [];
		//首位随机大写字母
		result.push(this.randomWord("letter",false,1,1));
		//2，3，4位随机英文或数字
		result.push(this.randomWord("both",false,1,1));
		result.push(this.randomWord("both",false,1,1));
		result.push(this.randomWord("both",false,1,1));
		//567位随机数字
		result.push(this.randomWord("number",false,1,1));
		result.push(this.randomWord("number",false,1,1));
		result.push(this.randomWord("number",false,1,1));

		var last = 0;
		for(var i in result){
			var r = result[i];
			if(PFT.Util.Validate.typeInit0(r)){
				last += r*1;
			}
		}
		last = last+"";
		last = last.substr(last.length-1);

		result.push(last);

		return result.join("");

	},
	/**
	 *  生成随机字母与数字组合
	 *  参考 https://gist.github.com/xuanfeng/b23ab28ab412254e1594
	 *  type : letter生成随机字母   number生成随机数字  both生成随机数字与字母组合
	 *  randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
	 */
	randomWord : function(type,randomFlag,min,max){
		var str = "",
			range = min,
			arr = [];
		if(type=="letter"){
			arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
		}else if(type=="number"){
			arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
		}else{
			arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
		}

		// 随机产生
		if(randomFlag){
			range = Math.round(Math.random() * (max-min)) + min;
		}
		for(var i=0; i<range; i++){
			var pos = Math.round(Math.random() * (arr.length-1));
			str += arr[pos];
		}
		return str;
	}
});
module.exports = Header;