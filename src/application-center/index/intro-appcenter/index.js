

require("./index.css");


var appIntro = {


	init : function(){

		this.temp = '<div id="introMask"></div>' + 
					'<div id="introHelper"></div>';


		this.pic = '<img src="http://static.12301.cc/assets/build/images/appcenter/miniyun.jpg">';	

		$("body").append(this.temp);			
		$("#introHelper").append(this.pic);

		var a = $(".app-list1 li").eq(2);
		a.css({

			"z-index" : "999",
			"position" : "relative"

		});


	}



}


module.exports = appIntro;





















