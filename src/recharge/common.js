/**
 * Created by Administrator on 2017/5/19.
 */
var common = {

    /**
     * 当用户充值完成时，告知后端进行账户余额的检测，以确定是否继续进行账户余额的相关提示
     */
    checkAccountMoney: function () {
        $.get("/r/Member_ExpenseWarning/checkMoney");
    }
};

module.exports = common;