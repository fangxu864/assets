/**
 * Author: huangzhiyang
 * Date: 2016/5/20 17:25
 * Description: ""
 */
//webpack����ʱ��ͨ���жϴ���Ĳ���(-local / -test / -dev / -p)ִ�в�ͬ�Ĵ����ʽ
//-local:���ؿ���
//-test :��������
//-dev  :Ԥ��������
//-p    :��������
module.exports = function(){
	var argv = process.argv;
	var env = argv[argv.length-1];
	var project_name = "";
	if(env.indexOf("-")<0){ //��������д�������һ���������Ǵ� "-" ˵�����һ��������ָ�������Ŀ��
		project_name = argv[argv.length-1];
		env = argv[argv.length-2];
	}
	env = env.replace("-","");
	var EXT = {  //build����ļ�����׺
			local : "local",   //���ؿ�������ʹ��
			test  : "test",    //�������Ի���ʹ��
			dev   : "dev",     //Ԥ��������ʹ��
			myProduct  : "prod"      //��������ʹ��
		}[env] || "default";
	console.log("project_name="+project_name);
	console.log("webpack run "+EXT);
	return{
		env : EXT,
		project_name : project_name
	};
};