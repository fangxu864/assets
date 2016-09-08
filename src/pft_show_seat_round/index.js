/**
 * Author: huangzhiyang
 * Date: 2016/9/8 11:57
 * Description: ""
 */
require("./css/seat.css");
var Main = require("./js/main_round.js");
$(function(){
	new Main();
})


var test = function(){
	for(var i=0; i<10; i++){
		if(i>=5) return i;
	}
}
console.log(test());