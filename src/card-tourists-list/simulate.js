

var Mock = require("mockjs");	

var simulate = {

    init : function(){


        //模拟后端数据
        Mock.mock('http://1.cn', {
            'name'	   : '[@name](/user/name)()',
            'age|1-100': 100,
            'color'	   : '[@color](/user/color)'
        });

        

    }



}





module.exports = simulate;
