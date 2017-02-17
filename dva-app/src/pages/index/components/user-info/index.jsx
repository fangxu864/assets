import "./index.scss";
import React from "react";
import Loading from "COMPONENTS/loading";
function UserInfo(props){
    const {info,isLoading,code,msg,dispatch} = props;
    const {dname,accountName,mobile,lastLoginTime} = info;

    return(
        <div className="userInfoBox">
            {do{
                if(isLoading){
                    <Loading/>
                }else if(code==200){
                    <div>{dname}</div>
                }else{
                    {msg}
                }
            }}
        </div>
    )
}
UserInfo.propTypes = {};

export default UserInfo;
