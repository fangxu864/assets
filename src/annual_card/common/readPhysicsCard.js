/**
 * Author: huangzhiyang
 * Date: 2016/6/24 17:28
 * Description: ""
 */
function readPhysicsCard(opt){
	opt = opt || {};
	this.id = opt.id;
	if(!this.id) throw Error("缺少id");
	this.readObj = document.getElementById(this.id);
	//<object classid="clsid:b1ee5c7f-5cd3-4cb8-b390-f9355defe39a" width="0" height="0" id="readCardObj"></object>
}
readPhysicsCard.prototype = {
	read : function(){
		var readCardObj = this.readObj;
		if(!readCardObj){
			alert("请使用IE浏览器读物理卡号");
			return "";
		}
		if(typeof readCardObj.open!="number" && typeof readCardObj.ICReaderRequest!="string"){
			alert("请使用IE浏览器并确认浏览器已安装GuoHe_ICReader_ActiveX插件");
			return "";
		}
		readCardObj.open();
		var val = readCardObj.ICReaderRequest();
		return val || "";
	}
};
module.exports = readPhysicsCard;