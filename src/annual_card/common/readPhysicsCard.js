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
}
readPhysicsCard.prototype = {
	read : function(){
		var readCardObj = this.readObj;
		if(!readCardObj){
			alert("请使用IE浏览器读物理卡号");
			return false;
		}
		if(typeof readCardObj.open!="number" && typeof readCardObj.ICReaderRequest!="string"){
			alert("请使用IE浏览器并确认浏览器已安装GuoHe_ICReader_ActiveX插件");
			return false;
		}
		readCardObj.open();
		var val = readCardObj.ICReaderRequest();
		return val;
	}
};
module.exports = readPhysicsCard;