var RootConfig = require("../config.js");
var Root = RootConfig.root;
var Base = require("./base");
var fs = require("fs");
var Path = require("path");
var gulp = require("gulp");
var webpackStream = require('webpack-stream');
var entryInfo = require("./base/getEntryInfo.js")("src-pc");
var entry = {};
entry[entryInfo.key] = entryInfo.path;
var isEntryExist = fs.existsSync(entryInfo.path);


if(!isEntryExist) return console.error("project is not exists or entry not exists");

var outputPath = Path.join(Root,"./build/local/");
var Config = Base.getbaseconfig({
    debug : true,
    watch : true,
    entry : entry,
    output : {
        path : Path.join(outputPath,"./js"),
        filename : "[name].all.js"
    },
    plugins : Base.getplugin({
        minify : false,
        path : Path.join(outputPath,"./css"),
        filename : "[name].all.css"
    }),
    loaders : Base.getloader()
});


gulp.src(entryInfo.path)
    .pipe(webpackStream(Config))
    .pipe(gulp.dest(Path.join(outputPath,"./js")))
    .on('end', function(){
        console.log("compile finish");
    });


