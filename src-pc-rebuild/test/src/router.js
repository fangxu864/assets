import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'dva/router';

const IndexPage = require("./pages/index");

export default function({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={IndexPage} />
    </Router>
  );
};
