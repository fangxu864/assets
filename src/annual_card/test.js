/**
 * Author: huangzhiyang
 * Date: 2016/6/21 11:45
 * Description: ""
 */
var readwuKa = function(that,e){
	var helloBossma = that.helloBossma;
	if(!helloBossma){
		alert("请使用IE浏览器读物理卡号");
		return false;
	}
	if(typeof helloBossma.open!="number" && typeof helloBossma.ICReaderRequest!="string"){
		alert("请使用IE浏览器并确认浏览器已安装GuoHe_ICReader_ActiveX插件");
		return false;
	}
	helloBossma.open();
	var val = helloBossma.ICReaderRequest();
	$("#phy_no_inp").val(val);
}