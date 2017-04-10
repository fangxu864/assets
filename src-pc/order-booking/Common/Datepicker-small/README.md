##本模块为价格日历组件

###1.引入datePricePicker
```
var DatePricePicker = require("./Common/Datepicker-small/index.js");
```

###2.实例化datePricePicker
```
var datePricePicker = new DatePricePicker();
```

###3.主方法是show()
```
 datePricePicker.show( initDate ,{ //日历均为字符串，格式为 XXXX-XX-XX ,initDate表示初始化日期，若无则默认为今日
            relyInp: _this,     //依托的input
            max:'2017-05-20',    //最大日期
            min: '2017-03-02'     //最小日期 设置日期小于今天会重置到今天
        });
 ```

###4.订阅dataPick事件（点击某一日期时触发）
```
datePicker.on("datePick",function (date) {
            console.log(date)
    })
```