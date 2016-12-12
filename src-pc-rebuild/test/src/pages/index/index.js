import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.css';
import Count from "../../components/count/count";
function IndexPage() {
  return (
      <Count/>
  );
}

IndexPage.propTypes = {
};


function mapPropsToState(state){
  return{
    count : state.count
  }
}
export default connect(mapPropsToState)(IndexPage);
