module.exports = function(componentName){
    var Path = require("path");
    var path = Path.join(process.cwd(),"./dist/" + componentName + "/");
    
    var filename = componentName.toLowerCase().replace("-","_");

    var libraryPrefix = "PUI_";
    var librayrName = libraryPrefix + componentName.toLowerCase().replace(/-|_/g," ").replace(/\b(\w)(\w*)/g, function($0, $1, $2) {
        return $1.toUpperCase() + $2.toLowerCase();
    }).replace(" ","");
    

    filename = filename + ".all.js";


    var output = {
        path : path,
        filename : filename,
        library : librayrName,
        libraryTarget : "umd"
    };


    return output;


}