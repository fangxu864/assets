/**
 * Author: huangzhiyang
 * Date: 2017/1/9 12:27
 * Description: ""
 */

var fs = require("fs");
var request = require("request");
var gulp = require("gulp");
var sftp = require("gulp-sftp");
var path = require("path");

var Util = {
	/**
	 * ����ָ���ļ�������
	 * @param opt
	 * opt.src      Ŀ���ļ���ַ                                      ����
	 * opt.output   �����سɹ������ļ�Ҫ�ŵ��ĸ�·���£�����·�����ļ�����  ����
	 * opt.encoding �ļ��ַ�����                                      ��ѡ
	 * callback     ��������ʱ�Ļص�                                   ��ѡ
	 */
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
	 * opt.host         Զ��������ַ          ����
	 * opt.port         �˿ں�               ��ѡ   Ĭ��22
	 * opt.user         ��¼Զ���������û���   ����
	 * opt.password     ��¼Զ������������     ����
	 * opt.remotePath   Զ���������ĸ�Ŀ¼��   ��ѡ   Ĭ�� "./"
	 */
	upload : function(opt){

		var root = process.cwd();

		var file = opt.file;
		var host = opt.host;
		var env = opt.host;
		var port = opt.port || 22;
		var user = opt.user;
		var password = opt.password;
		var remotePath = opt.remotePath;
		var __Host = {
			test : {
				host : "192.168.20.138",
				remotePath : "/var/www/static/assets/build",
				username : hostConfig.test.username,
				password : hostConfig.test.password
			},

			release : {
				host : "121.43.119.39",
				remotePath : "/data/static_dev/assets/build",
				username : hostConfig.release.username,
				password : hostConfig.release.password
			},

			production : {
				host : "121.40.69.184",
				remotePath : "/databak/www/static/assets/build",
				username : hostConfig.production.username,
				password : hostConfig.production.password
			},

			image : {
				host : "121.40.69.184",
				remotePath : "/databak/www/static/assets/build/images",
				username : hostConfig.production.username,
				password : hostConfig.production.password
			},

			iconfont : {
				host : "121.40.69.184",
				remotePath : "/databak/www/static/assets/build/iconfont",
				username : hostConfig.production.username,
				password : hostConfig.production.password
			},

			lib : {
				host : "121.40.69.184",
				remotePath : "/databak/www/static/assets/build/lib",
				username : hostConfig.production.username,
				password : hostConfig.production.password
			}
		};


		var Host = __Host[host];

		if(Host){
			user = __Host[host]["username"];
			password = __Host[host]["password"];
			host = Host.host;
			remotePath = path.join(Host.remotePath,remotePath);
		}

		gulp.src(path.join(root,file)).pipe(sftp({
			host: host,
			user: user,
			port: port,
			password: password,
			remotePath: remotePath
		}))
	}
};




module.exports = Util;