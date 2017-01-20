import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'dva/router';

import IndexPage from './pages/index/index';
import TerminalPage from './pages/terminal/terminal';

export default function({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={IndexPage} />
      <Route path="terminal" component={TerminalPage} />
    </Router>
  );
};

