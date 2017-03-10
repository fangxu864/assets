

var Mock = require("mockjs");	

var simulate = {

    init : function(){

        //模拟操作员列表

        Mock.mock('http://operator.cn', {
            "code|200" : 1,
            "data" : {
                "list|1-20" : [{
                    "operator|1-2" : "操作"
                }]
            },
            "msg" : "" 
        });





        //模拟后端数据
        Mock.mock('http://1.cn', {
            'name'	   : '[@name](/user/name)()',
            'age|1-100': 100,
            'color'	   : '[@color](/user/color)'
        });

        

    }



}





module.exports = simulate;
