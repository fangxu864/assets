/**
 * Created by Administrator on 15-12-4.
 */
require("./index.scss");
var QueryDisList = require("./modules/query.list.js");
$(function(){
	setTimeout(function(){new QueryDisList({container:$("#pageRightArea")});},500)
})
