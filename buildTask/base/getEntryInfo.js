var Path = require("path");
<<<<<<< HEAD
var getProcessArgv = require("./base/getProcessArgv");
var adaptProjectName = function(projectName){
    return projectName.replace(/-|\//g,"_");
};


var getEntryInfo = function(){
=======
var Config = require("../../config.js");
var Root = Config.root;
var getProcessArgv = require("./getProcessArgv");
var adaptProjectName = function(projectName){
    var name = projectName + "";
    return name.replace(/-|\//g,"_");
};


var getEntryInfo = function(srcRoot){
>>>>>>> a6534b3f4e8655b9fb0ac85f47c37ca823962059
    var entry = {}
    var Args = getProcessArgv();
    if(Args.length==0) return false;
    var project = Args[0];
    var entryKey = adaptProjectName(project).replace(/\.js|index\./g,"").replace(/^\S/,function(s){
        return s.toLowerCase();
    });
    var projectPath = "";
    if(project.split("/").length==1){
<<<<<<< HEAD
        projectPath = Path.join(__dirname,project,"index.js");
    }else{
        projectPath = Path.join(__dirname,project);
    }
    entry[entryKey] = projectPath;
=======
        projectPath = Path.join(Root,srcRoot,project,"index.js");
    }else{
        projectPath = Path.join(Root,srcRoot,project);
    }

    entry["key"] = entryKey,
    entry["path"] = projectPath;

>>>>>>> a6534b3f4e8655b9fb0ac85f47c37ca823962059
    return entry;
};

module.exports = getEntryInfo;