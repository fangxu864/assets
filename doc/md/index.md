
## 开发规范
> 1. 文件夹命名不允许用驼峰或 "_" ，一律采用 "project" 或 "project-name"
> 2. css命名一律采用驼峰写法：如scrollWrap，不推荐scroll_wrap或scroll-wrap
> 3. 每一个项目或模块下，默认的入口文件名：index.js，置于项目的根目录下，默认css入口文件：index.scss，默认模板入口文件：index.xtpl
> 4. require common里的公共组件或方法时，必须写在文件开头且赋值给变量时，首字母必须大写

```js
//推荐写法：
var ParseTemplate = PFT.Util.ParseTemplate;
var ParseTemplate = require("COMMON/js/util.ParseTemplate");
var Datepicker = require("COMMON/modules/datepicker");

//不推荐写法：
var parseTemplate = require("COMMON/js/util.ParseTemplate");
var parse_template = require("COMMON/js/util.ParseTemplate");
var date-picker = require("COMMON/modules/datepicker");

```







## 安装
### 安装编译环境
到[nodejs官网](https://nodejs.org/) 下载nodejs并安装,推荐下载v4.x版本，比较稳定。
nodejs安装完后默认已经帮你安装了npm(你可以把它看成是nodejs的内建模块)，
这个时候你需要先手动修改npm源地址，否则npm源在国外，国内网络访问很慢，而且经常出现各种问题。

### 修改npm镜像地址
有3种方法：(这里我们默认使用淘宝镜像，也是最常用的)

#### 在命令行里执行
```js
npm config set registry https://registry.npm.taobao.org
// 配置后可通过下面方式来验证是否成功
npm config get registry
```

#### 修改npmrc文件
在 C:\Users\Administrator\.npmrc 加入：`registry = https://registry.npm.taobao.org`

#### 安装cnpm
命令行执行：`npm install -g cnpm --registry=https://registry.npm.taobao.org`
以后所有你需要安装模块时，npm install module_name只要改成cnpm install module_name即可,
如安装express：`cnpm install express`


### 安装依赖
```js
npm install webpack gulp -g //全局安装webpack gulp
```

### clone项目到本地
```js
clone http://git.12301.io/huangzhiyang166/assets //建议 clone到D:\dev_12301\www\static\目录内
```

### 启动
```js
cd D:\dev_12301\www\static\assets\
npm install //由于一次性安装较多模块，这个过程可能需要几分时间
```

## 如何编译
依赖模块安赱好后，就可以进行前端资源的编译了。首先，assets其实就是一个nodejs模块，
所以建议先看一下项目根目录下的package.json。留意其中最重要的字段：scripts，以common组为例，用法如下：
> common-start：
命令行执行 `npm run common-start`，即把common子项目编译到本地开发环境，
编译后会得到两个两组.all文件放在./build/local下：
js/pft.common.pc.all.js(pc端全局公用js文件)
css/pft.common.pc.all.css(pc端全局公用css)
js/pft.common.mb.js(mobile端全局公用js)
css/pft.common.mb.css(mobile端全局公用css)

> common-test:
使用命令行执行 `npm run common-test`，即把common子项目编译到内网测试环境，目录：./build/test

> common-release:
执行 `npm run common-release`，即把common子项目编译到预发布环境，目录：./build/release

> common-production:
执行 `npm run common-production`，即把common子项目编译到生产环境，目录：./build/production


## scripts字段
scripts里包含多对键值对(以后会越来越多)，
每4对一组，分别可以编译到本地开发环境(local)，内网测试环境(test)，预发布环境(release)，生产环境(production)
键名命名格式：项目名-编译到哪个环境，如：common-start 把common项目编译到本地开发环境


## assets目录结构说明
```js
--assets
    |
    |-- build
    |     |
    |     |-- lib  存放一些公用的类库或第三方插件，如jq,backbone,vue等
    |     |
    |     |-- images 存放图片
    |     |
    |     |-- local        本地开发环境build后的代码(.all文件)都放在这里，里面又分为两个子目录css，js
    |     |     |
    |     |     |-- css    npm run xxx-start后，会生成两个文件：xxx.all.css及xxx.all.js。其中，css放在这里
    |     |     |
    |     |     |-- js     npm run xxx-start后，会生成两个文件：xxx.all.css及xxx.all.js。其中，js放在这里
    |     |
    |     |-- test         内网环境build后的代码
    |     |     |
    |     |     |-- css    存放xxx.all.css
    |     |     |
    |     |     |-- js     存放xxx.all.js
    |     |
    |     |-- release      预生产环境build后的代码
    |     |     |
    |     |     |-- css    存放xxx.all.css
    |     |     |
    |     |     |-- js     存放xxx.all.js
    |     |
    |     |-- production   生产环境build后的代码
    |           |
    |           |-- css    存放xxx.all.css
    |           |
    |           |-- js     存放xxx.all.js
    |
    |-- common  公用模块，组件，基类文件
    |     |
    |     |-- Api         与后端ajax交互的api路径都定义在这里
    |     |    |
    |     |    |--   api.base.js
    |     |    |
    |     |    |--   api.mb.js   mobile端api
    |     |    |
    |     |    |--   api.pc.js   pc端api
    |     |
    |     |-- busi   通用底层业务逻辑(还未实现)
    |     |
    |     |-- css    通用css，基类
    |     |    |
    |     |    |-- base  sass的基类文件  变量定量、sass mixin、iconfont等
    |     |    |
    |     |    |-- pft-common-pc    平台页面全局框架css布局样式  由./common/pft.common.pc.js构建时引入
    |     |    |
    |     |    |-- sheral   一个优秀的第三方sass框架 可以具体业务代码开发时，引入其中某一模块，加快css开发
    |     |    |
    |     |    |-- tobe     一个优秀的第三方sass框架 可以具体业务代码开发时，引入其中某一模块，加快css开发
    |     |
    |     |-- js     通用工具函数方法集  通过npm run common-start可以把这些方法build进PFT.Util命名空间内
    |     |
    |     |-- modules  通用模块，组件库
    |     |
    |     |-- pft.common.base.js   构建common时的基类，pc,mobile两端共用
    |     |
    |     |-- pft.common.mb.js     mobile端的基类
    |     |
    |     |-- pft.common.pc.js     pc端的基类
    |     |
    |     |-- pft.common.pc.base.js   被pft.common.pc.js引用
    |
    |
    |
    |-- src           pc端项目源码
    |
    |-- src_mobile    mobile端项目源码
    |
    |-- task-webpack  webpack构建脚本
    |
    |--.babelrc       babel插件的配置文件 忽删改

```

## 如何开始一个新项目
1) 移动端项目请在scr_mobile下新建文件夹，pc端项目请在src下新建文件夹。 文件夹名统一为项目名称
   避免用驼峰或"_"写法，请统一用中横线"-"，如：my-new-project

2) 项目目录划分统一按照如下方式：

   my-new-project (简单的项目)
   		|
   		|--index.js           项目的入口文件
   		|
   		|--index.scss         css文件，在index.js中第一行引入：require("./index.scss")
   		|
   		|--index.xtpl         模板文件，在index.js中引入：var Tpl = require("./index.xtpl") 非必须，根据项目需求而定
   		|
   		|--webpack.config.js  此项目打包时webpack的配置文件


   	my-new-project (如果此项目比较大，则建议按照模块化方式来写)
   	    |
   	    |--index.js            项目的主入口文件
   	    |
   	    |--index.scss          主样式文件
   	    |
   	    |--sub-entry.js        可以是另一模块入口文件
   	    |
   	    |--module-name         子模块(文件夹)  在主入口文件index.js中引入此模块：var ModuleName = require("./module-name");
   	    |      |
   	    |      |--index.js     子模块入口文件
   	    |      |
   	    |      |--index.scss   子模块css样式
   	    |      |
   	    |      |--index.xtpl   子模块模板文件
   	    |
   	    |
   	    |--webpack.config.js   此项目打包时webpack的配置文件

3) 配置项目根目录下，webpack.config.js

   建议从其它项目copy一份，然后修改其中的入口entry字段即可

   webpack.config.js配置说明：

    //webpack.congif.js
    var env = require("../../task-webpack/getNodeENV");
	var path = require("path");
	var plugins = require("../../task-webpack/getPlugins")(env);
	var output = require("../../task-webpack/getOutput")(env);
	var config = require("../../task-webpack/config")({
		entry : {
			// 只要修改此处配置即可
			// entry键值对形式，键名用来指定webpack build后生成的文件名
			// 如此处，build后最终生成的文件名为：dealsummary.all.js  dealsummary.all.css
			// 键值即为此项目的主入口文件的路径
			"dealsummary" : "./src/deal_summary/index.js"
		},
		output : output,
		plugins : plugins
	});
	module.exports = config;

4) 在assets根目录下的package.json中scripts字段中，添加webpack build时的命令行脚本：

   xxx-为项目名

> 1. 构建到本地开发环境：
   npm run xxx-start: "set NODE_ENV=develop && webpack --color --progress --watch --config ./src/my-new-project/webpack.config.js"

> 2. 构建到内网测试环境:
   npm run xxx-test: "set NODE_ENV=test && webpack --color --progress --config ./src/my-new-project/webpack.config.js"

> 3. 构建到预生产环境:
   npm run xxx-release: "set NODE_ENV=release && webpack --color --progress --config ./src/my-new-project/webpack.config.js"

> 4. 构建到生产环境:
   npm run xxx-production: "set NODE_ENV=production && webpack --color --progress --config ./src/my-new-project/webpack.config.js"


   构建完后会自动在build目录的相应环境目录下生成一个xxx.all.js及xxx.all.css文件

   如：

   命令行运行npm run xxx-start后，会在build/local/js下生成一个xxx.all.js，在build/local/css下生成一个xxx.all.css

   命令行运行npm run xxx-test后，会在build/test/js下生成一个xxx.all.js，在build/test/css下生成一个xxx.all.css

   命令行运行npm run xxx-release后，会在build/release/js下生成一个xxx.all.js，在build/release/css下生成一个xxx.all.css

   命令行运行npm run xxx-production后，会在build/production/js下生成一个xxx.all.js，在build/production/css下生成一个xxx.all.css




# PFT全局方法
所有的全局方法都挂载到PFT下

## Util
全局工具类方法集，对应assets目录下的：./common/js/util.ajax.js、./common/js/util.class.js..

### Ajax
> 1. 对$.ajax做了一层封装，日常开发中请使用PFT.Util.Ajax()取代$.ajax() 
> 2. 目录：./common/js/util.ajax.js 
> 3. 调用：PFT.Util.Ajax() 

|参数|类型|说明|默认值|
|:----|:----|:----|:----|
|url|string|api接口地址|必传|
|option|object|自定义配置|可选|
|option.type|string|ajax请求方法，GET或POST|POST|
|option.dataType|string|定义反回数据的类型|json|
|option.params|object|传递给后端的参数|{}|
|option.ttimeout|number|请求超时设置|120*1000|
|option.loading|function|请求发起时回调|function(){}|
|option.success|function|请求成功回调|function(){}|
|option.timeout|function|请求超时回调|function(){}|
|option.serverError|function|请求出错回调|function(){}|

示例：

```js

PFT.Util.Ajax("http://api.12301.cc",{
    type : "GET",
    dataType : "json",
    params : {
        id : "aaaa",
        username : "sdfsdf"
    },
    ttimeout : 10 * 1000,  //设置请求超时时长
    loading : function(){
        //正在请中...
    },
    complete : function(){
        //请求完成
    },
    success : function(res){
        var code = res.code;
        if(code==200){
            //do something...
        }else{
            alert(res.msg || PFT.AJAX_ERROR)
        }
    },
    timeout : function(){ alert("请求起时") },
    serverError : function(){ alert("请求出错)}
})

```

### Class
> 1. 全局页面初始化模块，建议用此方法来组织代码 
> 2. 目录：./common/js/util.class.js 
> 3. 调用：PFT.Util.Class(); 

**此方法创建一个模块(类)，来源于alloyTeam早期的 [Spirit项目](http://alloyteam.github.io/Spirit/modules/JM/index.html#base)，基于它的底层基类Class，其中我加入了订阅发布机制**

```js

//a.js
var A = PFT.Util.Class({
    container : $("#container"),  //此模块最外层容器 建议使用id选择器
    EVENTS : {                    //这个模块上的所有事件都在这里绑定，实质是通过事件委托，将所有事件绑定到container上,减少内存消耗
        "click .submitBtn" : "onSubmitBtnClick",
        "blur .textInp" : "onTextInpBlur",
    },
    init : function(opt){         //这个类的初始化方法，当new这个类(模块时)会自动执行这个方法,opt参数为外部new时传入
        this.name = opt.name;
        this.age = opt.age;

    },
    onSubmitBtnClick : function(e){
        console.log(e);
        console.log(this); //this指向这个类的实例

        this.trigger("submit.btn.click",{e:e,otherParams:1});

    },
    onTextInpBlur : function(e){

    },
    sayName : function(){
        console.log(this.name);
    }
});


//b.js
var A = require("./a.js");

var a = new A({  
    name : "aaa",
    age : 12
});

a.sayName()  //"aaa";

var B = PFT.Util.Class({
    container : $("body"),
    init : function(){
        //B模块订阅了A模块的submit.btn.click
        //A模块的submitBtn被点击时，B块就可以执行一些业务逻辑
        //A模块只是把submitBtn被点击的消息发出去(向外界广播)，但不会关心哪些模块订阅了这个消息，
        //也就是说，A模块并不知道B模块的存在
        //其它模块可以自由选择是否订阅A模块
        a.on("submit.btn.click",function(data){
            console.log(data.e);
            console.log(data.otherParams)
        })
    }
})

//上面的代码有个弊端，没有做到A B模块的解耦，对于A模块来说，它并不知道B模块的存在，
//但是B模块却依赖A模块，这种B模块把A模块注入到自身内部(依赖注入)的方式有好有坏
//坏处在于，当某天负责A模块的同学把A模块删了，或者A模块自身出错了，B模块会受到影响
//所以这里提供另一种方式：引入第三方C模块，专门用于AB模块间的通信

//c.js

var A = require("./a.js");
var B = require("./b.js");
var C = PFT.Util.Class({
    init : function(){
        var a = new A();
        var b = new B();

        a.on("submit.btn.click",function(){
            
            //当A模块submitBtn被点击时，B模块执行逻辑
            //这样A B模块就完全解耦了
            b.hander();

        })


    }
})


```


### ParseTemplate
> 1. 模板引擎，从underscore.js中单独提取出来，使用方法同underscore完全一致
> 2. 目录：./common/js/util.parseTemplate.js
> 3. 调用：PFT.Util.ParseTemplate(data,cxt);

**此方法非常重要，现在所有的html模板解析都是直接调用此方法**

|参数|类型|说明|默认值|
|:----|:----|:----|:----|
|data|object|要传入模板的数据|必填|
|cxt|object|在模板里也可以执行一些js代码，如<%this.submit()%>，此时this就是cxt传进来的|可省，一般不常用|

```js

//index.xtpl
<% _.each(list,function(item){
    <li><%=item.title%></li>
}) %>

//index.js
var indexTpl = require("./index.xtpl");           //获取模板(字符串)
var template = PFT.Util.ParseTemplate(indexTpl);  //预解析模板，缓存在template中   template是一个方法
var htmlStr = template({
    list : [{
        id : 11,
        title : "标题11"
    },{
        id : 22,
        title : "标题22"
    }]
});

$("#container").html(htmlStr);


```

### UrlParse
> 1. 解析浏览器地址栏里的所有参数，并将结果序列化成js对象
> 2. 目录：./common/js/util.url.parse.query.js
> 3. 调用：PFT.Util.UrlParse();

|参数|类型|说明|默认值|
|:----|:----|:----|:----|
|url|string|url字符串|可选，默认为当前页面的window.location.href|

```js

#假设当前所在页面：http://www.12301.cc/plist.html?page=1&pageSize=15

var urlParams = PFT.Util.UrlParse();

console.log(urlParams)  // urlParams => {page:1, pageSize:15}


```

### LoadingPc
> 1. 生成loading图及文字，用于pc端
> 2. 目录：./common/js/util.loading.pc.js
> 3. 调用：不在全局PFT.Util下，需要自行require

**这个方法**

|参数|类型|说明|默认值|
|:----|:----|:----|:----|
|text|string|loading时显示的文字|可选，默认为"努力加载中..."|
|opt|object|附加参数|可选，默认为{}|
|opt.tag|string|定义标签类型,三者之间选其一：div,li,tr|可选，默认为"div"|
|opt.colspan|number|当tag为td或tr时，定义这个loading所占的列数|可选，默认为1|
|opt.width|number or string|定义这个loading所占的宽度，传数字时，默认是px，传字符串时，默认是百分比|可选，默认为"100%"|
|opt.height|number|定义这个loading所占的高度，只能传数字|可选，默认为150|
|opt.loadingImg|object|定义loading图片相关设置|可选，默认为{}|
|opt.loadingImg.width|number|定义loading图片的宽度|可选，默认为24|
|opt.loadingImg.top|number|定义loading图片垂直方向的偏移量|可选，默认为0|

**调用此方法会得到一个html字符串，可以调用$("#id").html(LoadingStr),把这段字符串塞到任意的dom节点**

```js

var LoadingPC = require("COMMON/js/util.loading.pc.js");
var LoadingStr = LoadingPC("正在加载...",{
    tag : "tr",
    colspan : 6,
    width : 500,
    height : 200
});


PFT.Util.Ajax(url,{
    type : "post",
    params : {},
    loading : function(){
        $("#container").html(LoadingStr);
    },
    complete : function(){
        $("#container").html("");
    }
})


```




