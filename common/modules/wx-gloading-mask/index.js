/**
 * Author: huangzhiyang
 * Date: 2016/5/30 17:08
 * Description: ""
 */
require("./style.css");
module.exports = {
	open : function(callback){
		var gmaskLayer = document.getElementById("gmaskLayer");
		if(gmaskLayer){
			gmaskLayer.className = gmaskLayer.className+" show";
		}else{
			gmaskLayer = document.createElement('div');
			gmaskLayer.setAttribute("id","gmaskLayer");
			gmaskLayer.className = "gmaskLayer show";
			gmaskLayer.innerHTML = '<div class="gLoadingBox" style="margin-top:-4.5rem"><div class="gLoading load1"></div></div>';
			document.body.appendChild(gmaskLayer);
		}
		callback && callback();
	},
	close : function(callback){
		var gmaskLayer = document.getElementById("gmaskLayer");
		if(gmaskLayer.classList){
			gmaskLayer.classList.remove("show");
		}else{
			var cls = gmaskLayer.className.split(",");
			cls = cls.replace(/[,]*show/,"");
			gmaskLayer.className = cls;
		}
		callback && callback();
	}
}