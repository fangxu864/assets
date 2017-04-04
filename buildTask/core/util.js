var fs = require("fs");
var request = require("request");
var gulp = require("gulp");
var sftp = require("gulp-sftp");
var path = require("path");

module.exports = {
    mixin : function(to,from){
        var toString = Object.prototype.toString;
        var isObject = function(obj){ return toString.call(obj)==="[object Object]" };
        var isArray = function(obj){ return toString.call(obj)==="[object Object]" };
        var isObjectOrArray = function(obj){ return (isObject(obj) || isArray(obj)) };
        var _mix = function(to,from){
            if(!isObjectOrArray(to) || !isObjectOrArray(from)) return to;
            for(var i in from){
                if(isObject(from[i])){
                    if(typeof to[i]==="undefined"){
                        to[i] = from[i];
                    }else{
                        _mix(to[i],from[i]);
                    }
                }else if(isArray(from[i])){
                    for(var s=0,len=from[i].length; s<len; s++){
                        _mix(to[i][s],from[i][s]);
                    }
                }else{
                    to[i] = from[i];
                }
            }
            return to;
        };


        return _mix(to,from);


    },
    remote : {
        download : function(opt){
            var src = opt.src;
            if(!src) throw new Error("ȱ�����ص�ַ");
            var output = opt.output;
            if(!output) throw new Error("ȱ���ļ����ŵ�ַ");
            var callback = opt.callback || function(){};
            var encoding = opt.encoding || "utf8";
            request(src,function(err,res,body){
                var body = res.body;
                var out = fs.createWriteStream(output,{encoding:encoding});
                out.write(body);
                out.end();
                callback(err,res,body);
            });
        },
        /**
         * �ϴ�ָ���ļ���ָ��������
         * @param opt
         * opt.file          ���ϴ��ļ�src         ����
         * opt.port         �˿ں�               ��ѡ   Ĭ��22
         * opt.user         ��¼Զ���������û���   ����
         * opt.password     ��¼Զ������������     ����
         * opt.remotePath   Զ���������ĸ�Ŀ¼��   ��ѡ   Ĭ�� "./"
         */
        upload : function(opt){

            var root = process.cwd();

            var file = opt.file;
            var env = opt.env;
            var port = opt.port || 22;
            var user = opt.username;
            var password = opt.password;
            var remotePath = opt.remotePath;
            var __Host = {
                test : {
                    host : "192.168.20.138",
                    remotePath : "/var/www/static/assets/build"
                },

                release : {
                    host : "121.43.119.39",
                    remotePath : "/data/static_dev/assets/build"
                },

                production : {
                    host : "121.40.69.184",
                    remotePath : "/databak/www/static/assets/build"
                },

                image : {
                    host : "121.40.69.184",
                    remotePath : "/databak/www/static/assets/build/images"
                },

                iconfont : {
                    host : "121.40.69.184",
                    remotePath : "/databak/www/static/assets/build/iconfont"
                },

                lib : {
                    host : "121.40.69.184",
                    remotePath : "/databak/www/static/assets/build/lib"
                }
            };


            var host = __Host[env];

            if(!host) return console.error("unknow host");

            var params = {
                host: host.host,
                port: port,
                user: user,
                password: password,
                remotePath: path.join(host.remotePath,remotePath)
            };

            gulp.src(path.join(root,file)).pipe(sftp(params))
        }
    }
}