/**
 * Author: huangzhiyang
 * Date: 2016/9/12 15:03
 * Description: ""
 */
require("./index.scss");
var UtilClass = require("COMMON/js/util.class");
var ParseTemplate = require("COMMON/js/util.parseTemplate");
var tpl = require("./index.xtpl");

var Defaults = {
	count : 7
};


var Pagination = UtilClass({
	init : function(opt){
		opt = $.extend({},Defaults,opt);
		var container = opt.container;
		if(!container) return alert("缺少container参数");
		this.__Count = opt.count;
		this.container = typeof container=="string" ? $(container) : container;

	},
	template : ParseTemplate(tpl),
	EVENTS : {

	},
	/**
	 * 主方法
	 * @param opt {current:10,total:15}
	 * current:当前页数
	 * total:总页数
	 */
	render : function(opt){
		if(opt==null) return this.container.html("").hide();
		opt = opt || {};
		var current = opt.current;
		var total = opt.total;
		if(total==0 || current>total) return this.container.html("").hide();

		var resultData = this._adapt(current,total);

		var html = this.template({data:resultData});

		this.container.html(html);

	},
	_adapt : function(current,total){
		var __Count = this.__Count;
		var result = [];
		var __push = function(val,ifCurrent){
			result.push({
				val : val,
				current : ifCurrent,
				first : val==1,
				last : val==total
			});
		};



		if(total<=__Count){ //小于等于__Count页全部显示

			for(var i = 1; i<=__Count; i++) __push(i,i==current ? true : false);

		}else{ //大于__Count页

			//1 2 3 4 5 6 7                      7  4
			//1 2 3 4 5 6 7 8 9                  9  5
			//1 2 3 4 5 6 7 8 9 10 11            11 6
			//....                               (n-1)/2+1
			var fix = (total-1)/2+1;
			if(current<=fix){
				for(var a=1; a<=current; a++) __push(a,a==current ? true : false);
				for(var b=current+1; b<current+fix; b++) __push(b,b==current ? true : false);
				__push("dot",false);
				__push(total,current==total ? true : false);
			}else{
				if(current<=total-fix){
					__push(1,current==1 ? true : false);
					__push("dot",false);
					for(var c=(current-fix); c<=current; c++) __push(c,c==current ? true : false);
					for(var d=(current+1); d<current+fix; d++) __push(d,d==current ? true : false);
					__push("dot",false);
					__push(total,current==total ? true : false);
				}else{

				}
			}

		}

		console.log(result);

		return result;

	}
});

module.exports = Pagination;