/**
 * Author: huangzhiyang
 * Date: 2016/5/26 19:50
 * Description: ""
 */
var SRC_DIR = "./src";
var fileinclude = require("gulp-file-include");
var gulpWatch = require("gulp-watch");
var gulp = require("gulp");
var fs = require("fs");
var htmlEntrys = (function(){
	var result = [];
	fs.readdirSync(SRC_DIR).forEach(function(project_name){
		fs.readdirSync(SRC_DIR+"/"+project_name).forEach(function(dir){
			if(dir=="view"){
				fs.readdirSync(SRC_DIR+"/"+project_name+"/"+dir).forEach(function(htmlfile){
					var pre_htmlfile = htmlfile.substr(0,htmlfile.length-5);
					if(pre_htmlfile==project_name){
						result.push(SRC_DIR+"/"+project_name+"/"+dir+"/"+htmlfile)
					}
				})
			}
		})
	})
	return result;
})();
var runHtmlInclude = function(entry){
	gulp.src(entry).pipe(fileinclude({
		prefix: '@@',
		basepath: '@file'
	})).pipe(gulp.dest("./views"));
};
gulp.task("html-include",function(){
	runHtmlInclude(htmlEntrys)
})

gulp.task("html-watch",function(){
	gulpWatch(["./src/**/view/*.html","./common/view/*.html"],function(e){
		gulp.start("html-include");
	})
})
gulp.task("default",["html-include","html-watch"]);
