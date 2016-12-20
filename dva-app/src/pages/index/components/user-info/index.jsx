require("./index.scss");
import Loading from "COMPONENTS/loading";
function UserInfo(userInfo){
    const {info,isLoading,code,msg,dispatch} = userInfo;
    const {shopName,accountName,mobile,lastLoginTime} = info;

    return(
        <div className="userInfoBox">
            {do{
                if(isLoading){
                    <Loading/>
                }else if(code==200){
                    <div>{shopName}</div>
                }else{
                    {msg}
                }
            }}
        </div>
    )
}
UserInfo.propTypes = {};

export default UserInfo;
