var Path = require("path");
var Config = require("../../config.js");
var Root = Config.root;
var getProcessArgv = require("./getProcessArgv");
var adaptProjectName = function(projectName){
    var name = projectName + "";
    return name.replace(/-|\//g,"_");
};


var getEntryInfo = function(srcRoot){
    var entry = {}
    var Args = getProcessArgv();
    if(Args.length==0) return false;
    var project = Args[0];
    var entryKey = adaptProjectName(project).replace(/\.js|index\./g,"").replace(/^\S/,function(s){
        return s.toLowerCase();
    });
    var projectPath = "";
    if(project.split("/").length==1){
        projectPath = Path.join(Root,srcRoot,project,"index.js");
    }else{
        projectPath = Path.join(Root,srcRoot,project);
    }

    entry["key"] = entryKey,
    entry["path"] = projectPath;

    return entry;
};

module.exports = getEntryInfo;