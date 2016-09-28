/**
 * Author: huangzhiyang
 * Date: 2016/9/7 11:48
 * Description: ""
 */
var FileSaver = require("file-saver");
console.log(new XMLHttpRequest())
function downloadFile(url, success) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = "blob";
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			document.getElementById("time").innerHTML = "下载耗时：" + (+ new Date - startTime) / 1000 + "s";
			if (success) success(xhr.response);
		}
	};

	var lastLoaded = 0, speed = 0, lastTime = + new Date, startTime = lastTime;
	var speedText = document.getElementById("speed");
	var loadedInfo = document.getElementById("loaded");
	var processBar = document.getElementById("processBar");

	xhr.addEventListener("progress", function(e){
		var currTime = + new Date;
		var currLoaded = e.loaded;
		var dT = currTime - lastTime;
		var dL = currLoaded - lastLoaded;

		lastTime = currTime;
		lastLoaded = currLoaded;

		speed = parseInt(dL / dT);
		speedText.innerHTML = speed;

		var percent = currLoaded / e.total;
		loadedInfo.innerHTML = "文件大小： " + parseInt(e.total / 1024 / 1024) + "M，已下载：" + (currLoaded / 1024 / 1024) + "M  <br />进度：" + parseInt(percent * 100) + "%";

		processBar.style.width = parseInt(percent * 100) + "%";

	});
	xhr.send(null);
}

//downloadFile('houhuiwuqi.mp3', function(blob) {
//	saveAs(blob, "后悔无期.mp3");
//});