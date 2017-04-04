/**
 * @author huangzhiyang 348845730@qq.com
 * @date   2017-04-01
 * 
 * 获取webpack output信息
 * 
 * @return object
 * object[path]         output文件所在目录
 * object[filename]     output文件名
 * 
 * 
 */
var fs = require("fs");
var Path = require("path");
var Root = require("../../rootDir.js")();
var Argvs = require("./getArgv")();
var outputFileName = Argvs[1];
var entryInfo = require("./getEntryInfo")();


var outputDir = {
    local : Path.join(Root,"./build/local"),
    test : Path.join(Root,"./build/test"),
    release : Path.join(Root,"./build/release"),
    production : Path.join(Root,"./build/production")
};




module.exports = function(env,isMobile){
    var result = {
        path : {},
        filename : ""
    };
    var dir = outputDir[env];
    if(!dir) return console.error("output dir no exist");

    result.path.js = Path.join(dir,"js");
    result.path.css = Path.join(dir,"css");

    if(outputFileName){ //如果命令行有传入要自定义的output filename
        if(outputFileName.indexOf(".all")<=0) outputFileName += ".all";
        if(outputFileName.indexOf("mb.")!==0 && !!isMobile) outputFileName = "mb." + outputFileName;
        result.filename = outputFileName;
    }else{
        //如果命令行没有传入自定义的output filename
        //先读取入口文件同目录下的build.config.js文件
        try{
            var buildConfig = require(Path.join(entryInfo.path,"./build.config.js"));
            if(buildConfig && buildConfig.outputFilename){
                outputFileName = buildConfig.outputFilename;
                if(outputFileName.indexOf(".all")<=0) outputFileName += ".all";
                if(outputFileName.indexOf("mb.")!==0 && !!isMobile) outputFileName = "mb." + outputFileName;
                result.filename = outputFileName;
            }else{
                console.log("outputFilename un exist");
            }
        }catch(e){ //如果入口文件同级目录下没有build.config.js 的outputFilename字段
            //此时outputFilename 取入口文体夹名
            outputFileName = entryInfo.relativePath.replace(/\.\/|src-pc\/|src-mobile\//g,"");
            outputFileName = outputFileName.replace(/\/$/,"");
            outputFileName = outputFileName.replace(/-|\//g,"_");
            if(outputFileName.indexOf("mb.")!==0 && !!isMobile) outputFileName = "mb." + outputFileName;
            result.filename = outputFileName + ".all";
        }
        
    }


    return result

}
