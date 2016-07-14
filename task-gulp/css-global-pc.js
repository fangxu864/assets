/**
 * Author: huangzhiyang
 * Date: 2016/7/6 15:12
 * Description: ""
 */
'use strict';
var sass = require("gulp-sass");
var rename = require("gulp-rename");
var minify = require("gulp-minify-css");
var dir = {
	local : "./build/local/css/common",
	test : "./build/test/css/common",
	dev : "./build/release/css/common",
	prod : "./build/production/css/common"
};
var EXTNAME = ".css";
var SUFFIX = ".min";
var BASENAME = "pft.global.pc";
module.exports = function(gulp){
	gulp.task("css-global-pc",function(){
		for(var i in dir){
			var dest = dir[i];
			gulp.src("./common/css/pc-global/index.scss")
				.pipe(sass().on("error",sass.logError))
				.pipe(rename({
					basename: BASENAME,
					extname: EXTNAME
				}))
				.pipe(gulp.dest(dest))
				.pipe(minify())
				.pipe(rename({
					basename: BASENAME,
					suffix: SUFFIX,
					extname: EXTNAME
				}))
				.pipe(gulp.dest(dest))
		}
	})
	gulp.task("css-global-pc:watch",function(){
		gulp.watch("./common/css/**/*.scss",["css-global-pc"]);
	})
}
