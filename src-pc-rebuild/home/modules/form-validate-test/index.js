/**
 * Author: huangzhiyang
 * Date: 2017/1/12 15:49
 * Description: ""
 */

var Tpl = require("./index.xtpl");
var Validator = require("COMMON/Components/Validator/v2.0");
console.log(Validator.Rules);
module.exports = function(parent){

	var container = $('<div id="ValidateBox" class="ValidateBox modBox"></div>').appendTo(parent);

	var Main = PFT.Util.Class({
		debug : false,
		container : container,
		EVENTS : {
			"click .btn" : "onBtnClick"
		},
		init : function(){
			this.container.html(Tpl);

			this.validator = Validator({
				container : "#testFormContainer",
				field : [{
					target : ".textInp",
					rule : "require",
					event : "blur",
					ok : function(result){
						console.log(result);
					},
					fail : function(result){
						console.log(result);
					}
				},{
					target : ".mobileInp",
					rule : "require,mobile",
					event : "blur",
					ok : function(result){
						console.log(result)
					},
					fail : function(result){
						console.log(result)
					}
				}]
			})



			// var res = this.validator.valid();
			// console.log(res)


		},
		onBtnClick : function(e){
			var res = this.validator.valid();
			console.log(res);
		}
	});


	return new Main;
};