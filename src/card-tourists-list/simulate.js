

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
        //模拟列表数据
        Mock.mock('http://List.cn', {
            "code|200" : 1,
            "data" : {
                "list|15" : [{
                    //账号id
                    "account" : function(){
                        var id = parseInt( Math.random()*100000000 );
                        return id
                    }, 
                    //物理卡号
                    "physicsNo" : function(){
                        var solidID = parseInt( Math.random()*10000000000000 );
                        return solidID
                    }, 
                    "active" : "1489541447", //激活时间时间cuo
                    "activeOpid" :  "小小" ,
                    "remain|1-500" : 1, //余额  //单位是分
                    "recharge|1-10" : [{
                        'rechargeMoney|500-40000' : 1,    //充值金额 单位是分
                        'rechargeTime' : '1489541447', //充值时间 时间戳
                        'rechargeOpid' : '大大' 	  //充值操作人
                    }],
                    "status|1-2" : 1
                }]
                // ,
                // 'totalNum': '100',    //总条数
                // 'total': '5',    //总页数
                // 'page': '1'    //当前页
            }, 
            "msg" : "" 
        });


    }



}





module.exports = simulate;
