/**
 * Author: huangzhiyang
 * Date: 2016/12/19 14:06
 * Description: ""
 */
import request from "../../utils/request";
async function fetchInfo(){
    return request("/r/UserInfo/getUserInfo/");
}

export default {
    namespace : "userInfo",
    state : {
        isLoading : false,
        code : 0,
        msg : "",
        info : {
            dname : "慢慢的店铺",
            dtype : "1",
            mobile : "1231234132",
            account : "慢慢",
            lastLoginTime : "2016-04-10 10:23:45",
            effectDate : "2016-12-10 10:23:45",
            abOrderNum : 23,
            photoImg : "",
            balance : 203.12
        }
    },
    subscriptions: {
        setup({ dispatch, history }){
            dispatch({
                type : "fetchInfo",
                payload : {}
            })
        }
    },

    effects: {
        *fetchInfo({payload},{call,put}){
            yield put({type:"showLoading"});
            const {data} = yield call(fetchInfo);
            const code = data.code;
            const msg = data.msg;
            const info = data.data;
            if(code==200){
                yield put({
                    type : "querySuccess",
                    payload : {info,code}
                })
            }else{
                yield put({
                    type : "queryFail",
                    payload : {code,msg}
                })
            }
        }
    },

    reducers: {
        showLoading(state){
            return{ ...state, isLoading:true}
        },
        querySuccess(state,action){
            const {code,info} = action.payload;
            return{...state, isLoading:false, code:code, info:info}
        },
        queryFail(state,action){
            const {code,msg} = action.payload;
            return{ ...state, isLoading:false, code:code, msg:msg}
        },
        click(state,action){
            console.log(action);
            return state;
        }
    }
}
