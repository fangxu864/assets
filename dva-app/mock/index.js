'use strict';
const TIMEOUT_NUM = 1000;
const MapApi = function(Api){
    let result = {};
    for(var path in Api){
        let api = Api[path];
        let type = api.type;
        let response = api.response;
        result[`${type} ${path}`] = function(req,res){
            response = typeof response=="function" ? response(req) : response;
            setTimeout(function () {
                res.json(response);
            },TIMEOUT_NUM);
        }
    }
    return result;
};
var Api = {
    "/r/UserInfo/getUserInfo/" : {
        type : "GET",
        response : function(req){
            return{
                code : 200,
                data : {
                    shopName : "慢慢的店铺",
                    accountName : "慢慢",
                    mobile : "1231234132",
                    lastLoginTime : "2016-04-10 10:23:45",
                    effectDate : "2016-12-10 10:23:45"
                },
                msg : ""
            }
        }
    }
};



module.exports = MapApi(Api);
