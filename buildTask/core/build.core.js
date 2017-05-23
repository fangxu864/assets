var gulp = require("gulp");
var webpackStream = require("webpack-stream");
var chalk = require("chalk");
var Path = require("path");
var inquirer = require("inquirer");

var Util = require("./util");
var Remote = Util.remote;
var getEntryInfo = require("./getEntryInfo");
var getOutputInfo = require("./getOutput");
var getLoader = require("./getLoader");
var getPlugin = require("./getPlugin");
var getBaseConfig = require("./getBaseConfig");


module.exports = function(opt){
    opt = Util.mixin({
        env : "local",
        isMobile : false
    },opt);
    var env = opt.env;
    var isMobile = !!opt.isMobile;
    var entryInfo = getEntryInfo();
    var outputInfo = getOutputInfo(env,isMobile);

    var loaders = getLoader();
    var plugins = getPlugin({
        minify : (env=="local" || env=="test") ? false : true,
        path :  outputInfo.path.css,
        filename : outputInfo.filename + ".css"
    });

    var config = getBaseConfig({
        debug : env=="local" ? true : false,
        watch : env=="local" ? true : false,
        entry : entryInfo.fullPath,
        output : {
            path : outputInfo.path.js,
            filename : outputInfo.filename + ".js"
        },
        loaders : loaders,
        plugins : plugins
    });


    gulp.src(entryInfo.fullPath)
        .pipe(webpackStream(config))
        .pipe(gulp.dest(outputInfo.path.js))
        .on('end', function(){

            console.log(chalk.green(`编译成功! \n`));

            if(env=="local") return false;

            var filename = entryInfo.key;
            var outJs = Path.join(outputInfo.path.js,outputInfo.filename+".js");
            var outCss = Path.join(outputInfo.path.css,outputInfo.filename+".css");

            console.log(`${outJs} \n`);
            console.log(`${outCss} \n`);

            var choices = ["no, just exist",outJs, outCss, "both"];
            var uploadFile = inquirer.prompt({
                type: "list",
                name: "file",
                message: "which file are you want to upload?",
                choices: choices
            });

            

            uploadFile.then(function(data){
                var file = data.file;
                if(file==choices[0]) return false;
                var username = inquirer.prompt({
                    type : "input",
                    name : "username",
                    message : "please entry username: "
                });

                username.then(function(data){
                    var username = data.username;
                    var pwd = inquirer.prompt({
                        type : "input",
                        name : "password",
                        message : "please entry password: "
                    });
                    pwd.then(function(data){
                        var password = data.password;
                        if(file=="both"){ //两个都传
                            var p1 = {
                                env : env,
                                file : outJs,
                                username : username,
                                password : password,
                                remotePath : "/js"
                            };
                            var p2 = {
                                env : env,
                                file : outCss,
                                username : username,
                                password : password,
                                remotePath : "/css"
                            };
                            Remote.upload(p1,function(){
                                Remote.upload(p2);
                            });
                        }else{ //只传其中某个
                            var remotePath = file == choices[1] ? "/js" : "/css"; 
                            var params = {
                                env : env,
                                file : file,
                                username : username,
                                password : password,
                                remotePath : remotePath
                            };
                            Remote.upload(params);
                        }
                    })
                })

            })
    
        })
}