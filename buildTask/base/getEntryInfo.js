var Path = require("path");
var getProcessArgv = require("./base/getProcessArgv");
var adaptProjectName = function(projectName){
    return projectName.replace(/-|\//g,"_");
};


var getEntryInfo = function(){
    var entry = {}
    var Args = getProcessArgv();
    if(Args.length==0) return false;
    var project = Args[0];
    var entryKey = adaptProjectName(project).replace(/\.js|index\./g,"").replace(/^\S/,function(s){
        return s.toLowerCase();
    });
    var projectPath = "";
    if(project.split("/").length==1){
        projectPath = Path.join(__dirname,project,"index.js");
    }else{
        projectPath = Path.join(__dirname,project);
    }
    entry[entryKey] = projectPath;
    return entry;
};

module.exports = getEntryInfo;