var Base = require("./base");
var fs = require("fs");
var Path = require("path");
var gulp = require("gulp");
var webpackStream = require('webpack-stream');


var Args = process.argv.slice(2);
var ProjectRootDir = process.cwd();
var ComponentName = Args[0];
var ComponentDir = Path.join(ProjectRootDir,"/src/Component/"+ComponentName);
var entry = Path.join(ComponentDir,"/index.js");
var isComponentEntryExist = fs.existsSync(entry);



if(!isComponentEntryExist) return console.error("component is not exists or entry not exists");



var loaders = Base.getloader();
var output = Base.getoutput(ComponentName);
var Config = Base.getbaseconfig({
    entry : entry,
    output : output,
    plugins : Base.getplugin({
        minify : true,
        filename : output.filename.replace(".js",".css")
    }),
    loaders : loaders
});




gulp.src(Config.entry)
    .pipe(webpackStream(Config))
    .pipe(gulp.dest(output.path))
    .on('end', function(){
        console.log("compile finish");
    });


