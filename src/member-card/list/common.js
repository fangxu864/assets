module.exports = {
    Ajax_Type : "get",
    Ajax_Timeout : 10 * 1000,
    Api : {
        list : function(){
            return "call/jh_card.php?action=list";
        },
        changeState : function(){
            return "call/jh_card.php"
        }
    },
    Status : {
        "0" : {
            text : "正常",
            action :[{  //状态为正常的会员卡，可以有以下几个操作action
                text : "授信/预存",
                link : "repayment.html?did="
            },{
                text : "挂失",
                status : 1
            },{
                text : "禁用",
                status : 2
            }]
        },
        "1" : {
            text : "挂失中",
            action :[{
                text : "授信/预存",
                link : "repayment.html?did="
            },{
                text : "补卡",
                link : "member_card.html?fid="
            },{
                text : "恢复",
                status : 0
            }]
        },
        "2" : {
            text : "禁用",
            action :[{
                text : "授信/预存",
                link : "repayment.html?did="
            },{
                text : "启用",
                status : "0"
            }]
        },
        "4" : {
            text : "未使用",
            action :[{
                text : "授信/预存",
                link : "repayment.html?did="
            },{
                text : "挂失",
                status : 1
            },{
                text : "禁用",
                status : 2
            }]
        }
    }
}