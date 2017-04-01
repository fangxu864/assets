##本模块为酒店选择详情显示组件

###1.本模块是个单例，主方法render()
```
var hotelDateList = require("./Common/hotelDateList/index.js");

    hotelDateList.render({
        container:$(".hotel-date-list-box");
        data: [{},{},{}]
    });

    //data格式为[
                     {
                         date: '2017-04-01',
                         storage: 66 ,
                         price: 666
                     },
                     {
                         date: '2017-04-02',
                         storage: 55 ,
                         price: 666
                     }
                 ]
```