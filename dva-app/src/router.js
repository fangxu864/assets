import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'dva/router';


import IndexPage from './pages/index/index.jsx';

export default function({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={IndexPage} />
    </Router>
  );
};
