##本模块为联系人模块

###1.引入模块并实例化
```
var Contact = require("./Common/contact/index.js");
var contact = new Contact(relyObj); //relyObj为模块容器
```
###2.对外开放两个方法

#####（1）render(idNum) 根据传入所需身份证号个数进行渲染
```
contact.render(idNum); //本模块会根据传入的个数自动调整结构，默认idNum为0
```
#####（2）getData() 获取联系人模块的表单数据
```
contact.getData(); //return 一个数据对象
```