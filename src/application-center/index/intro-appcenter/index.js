

require("./index.css");


var appIntro = {


	init : function(){

		this.temp = '<div id="introMask"></div>' + 
					'<div id="introHelper"></div>';


		this.pic = '<img src="http://static.12301.cc/assets/build/images/appcenter/miniyun.jpg">';	

		$("body").append(this.temp);			
		$("#introHelper").append(this.pic);

	}



}


module.exports = appIntro;





















