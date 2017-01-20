import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';

import { AutoComplete } from 'antd';


function TerminalPage({location,dispatch}) {
    
    var dataSource = ["111111","22222222222","33333333"];
    var onSelect = function(e){
        console.log(e)
    };
    var handleChange = function(e){
        console.log(e);
    }
    return(
        <div>
            <div>票券验证</div>
            <AutoComplete
                dataSource={dataSource}
                style={{ width: 200 }}
                onSelect={onSelect}
                onChange={handleChange}
                placeholder="input here"
            />
        </div>
    );
}

TerminalPage.propTypes = {};

export default connect(function(state){
    console.log(state)
    return {}
})(TerminalPage);
