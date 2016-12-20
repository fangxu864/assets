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
                    dname : "慢慢的店铺",
                    dtype : "1",
                    mobile : "1231234132",
                    account : "慢慢",
                    lastLoginTime : "2016-04-10 10:23:45",
                    effectDate : "2016-12-10 10:23:45",
                    abOrderNum : 23,
                    photoImg : "",
                    balance : 203.12
                },
                msg : ""
            }
        }
    }
};



module.exports = MapApi(Api);
