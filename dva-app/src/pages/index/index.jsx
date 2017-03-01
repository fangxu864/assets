import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';

import UserInfo from "./components/user-info";

function IndexPage({location,dispatch,userInfo,appUsed}) {
    const userInfoProp = {
        ...userInfo,
        dispatch : dispatch
    };
    return(
        <div id="indexPage" className="page index indexPage">
            <UserInfo {...userInfoProp}></UserInfo>

            <Link to="/terminal">票券验证</Link>

        </div>
    );
}

IndexPage.propTypes = {};

export default connect(function(state){
    return{
        userInfo : state.userInfo,
        appUsed : state.appUsed
    }
})(IndexPage);
