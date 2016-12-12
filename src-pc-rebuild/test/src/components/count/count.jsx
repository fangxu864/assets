import React, { PropTypes } from 'react';
import {connect} from "dva";
import styles from "./style.less";
function Count({count,test,dispatch}){
    return(
      <div className={styles.normal}>
        <div>{test.a}</div>
        <div className={styles.record}>Highest Record: {count.record}</div>
        <div className={styles.current}>{count.current}</div>
        <div className={styles.button}>
          <button onClick={() => { dispatch({type: 'count/add'}); }}>+</button>
        </div>
      </div>
    )
}
Count.propTypes = {

};

export default connect(function(state){
  return{
      count : state.count,
      test : state.test
  }
})(Count);

