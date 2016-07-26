###1、安装编译环境 到lnodejs官网(https://nodejs.org/)下载nodejs并安装,推荐下载v4.x版本，
比较稳定。nodejs安装完后默认已经帮你安装了npm(你可以把它看成是nodejs的内建模块)，
这个时候你需要先手动修改npm源地址，否则npm源在国外，国内网络访问很慢，而且经常出现各种问题。

###2、修改npm镜像地址，有3种方法：(这里我们默认使用淘宝镜像，也是最常用的)
#方法一：
在命令行里执行： npm config set registry https://registry.npm.taobao.org
// 配置后可通过下面方式来验证是否成功
npm config get registry

#方法二：
编辑 C:\Users\Administrator\.npmrc 加入下面内容：registry = https://registry.npm.taobao.org

#方法三：
安装cnpm，命令行执行：npm install -g cnpm --registry=https://registry.npm.taobao.org
以后所有你需要安装模块时，npm install module_name只要改成cnpm install module_name即可,
如安装express：cnpm install express


###3、安装依赖模块
nodejs环境安装好后，可以开始前端资源编译了。首页需要全局安装两个工具：webpack,gulp。命令行执行：
npm install webpack gulp -g (如果你用cnpm，cnpm install webpack gulp -g)
接下来，到clone http://git.12301.io/huangzhiyang166/assets项目到本地，
建议clone到D:\dev_12301\www\static\目录内。
接着 cd D:\dev_12301\www\static\assets\ 然后，
npm install 或cnpm install (由于一次性安装较多模块，这个过程可能需要几分时间)


###4、编译前端资源
依赖模块安赱好后，就可以进行前端资源的编译了。首先，assets其实就是一个nodejs模块，
所以建议先看一下项目根目录下的package.json。留意其中最重要的字段：scripts，以common组为例，用法如下：
##common-start：
使用命令行执行 npm run common-start，即把common子项目编译到本地开发环境，
编译后会得到两个两组.all文件放在./build/local下：
js/pft.common.pc.all.js(pc端全局公用js文件)
css/pft.common.pc.all.css(pc端全局公用css)
js/pft.common.mb.js(mobile端全局公用js)
css/pft.common.mb.css(mobile端全局公用css)
##common-test:
使用命令行执行 npm run common-test，即把common子项目编译到内网测试环境，目录：./build/test
##common-release:
使用命令行执行 npm run common-release，即把common子项目编译到预发布环境，目录：./build/release
##common-production:
使用命令行执行 npm run common-production，即把common子项目编译到生产环境，目录：./build/production


###scripts字段总结如下：
scripts里包含多对键值对(以后会越来越多)，
每4对一组，分别可以编译到本地开发环境(local)，内网测试环境(test)，预发布环境(release)，生产环境(production)
键名命名格式：项目名-编译到哪个环境，如：common-start 把common项目编译到本地开发环境


