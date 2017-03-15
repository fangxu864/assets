

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
            "data" : [{
                "account" : function(){
                    var id = parseInt( Math.random()*100000000 );
                    return id
                }, //账户id
                "physicsNo" : function(){
                    var solidID = parseInt( Math.random()*10000000000000 );
                    return solidID
                }, //绑定的物理卡号
                "active" : "2016-08-09 15:00:11/小小", //激活时间/操作员
                "chargeMoney|500-5000" : 1, //充值金额
                "chargeTime|1-5" : ["2016-08-09 15:00:11/小小"], //充值时间/操作员
                "remainder|1-500" : 1, //余额
                "status" : function(){
                    var status = Math.random()*100;
                    if(status > 50){
                        status = "使用中";
                    }else{
                        status = "已退卡"
                    }
                    return status
                }
            }],
            "msg" : "" 
        });


    }



}





module.exports = simulate;
