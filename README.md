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


