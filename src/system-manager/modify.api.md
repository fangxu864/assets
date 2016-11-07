## 用户信息修改接口

### 重构chmob.php文件
涉及文件：
D:\dev_12301\www\html\new\d\tpl\account_info_today.html:
D:\dev_12301\www\html\new\d\tpl\account_info_dt.html:
D:\dev_12301\www\html\new\d\tpl\account_info.html:
D:\dev_12301\www\html\new\d\shops\gmem_Data.html:

**原请求URL：** 
- ` http://www.12301.cc/chmob.php

**新请求URL：** 
- ` http://www.12301.cc/r/Member_MemberInfo/{action}/

**新旧URL参数对应关系** 
| 原URL      | 新URL               | 说明              |
| :--------  | :------------------ |------------------ |
| act=chA    | action=changeAlipay |修改支付宝账号     |
| act=chM    | action=changeMobile |修改手机号         |
| act=chH    | action=checkMobile  |验证手机号是否可用 |

**请求方式：**
- POST 


#### 1. 验证手机号是否可用 - action=checkMobile
**参数：**

| 参数名    | 类型   | 说明      |
| :-------- | :----- | --------- |
| * mobile  | string | 手机号码  |


** 响应：**

``` 
 {
    "code":200, // 200：成功，406：参数错误
    "data":{},
    "msg":"参数错误"  //错误信息
 }
```

#### 2. 修改手机号 - action=changeMobile
**参数：**

| 参数名    | 类型   | 说明           |
| :-------- | :----- | -------------- |
| * mobile  | string | 手机号码       |


** 响应：**

``` 
 {
    "code":200, // 200：成功，201：修改失败, 406：参数错误
    "data":{},
    "msg":"手机号已被占用"  //错误信息
 }
```


#### 3. 修改支付宝账号 - action=changeAlipay
**参数：**

| 参数名       | 类型     | 说明      |
| :-------- | :----- | -------------- |
| * alipay      | string | 支付宝帐号 |


** 响应：**

``` 
 {
    "code":200, // 200：成功，201：修改失败，406：支付宝账号不能为空，407：验证码错误
    "data":{},
    "msg":"验证码错误"  //错误信息
 }
```




