//import React, { PropTypes } from 'react';
//import { Router, Route, IndexRoute, Link } from 'dva/router';
const React = window.React;
const PropTypes = React.PropTypes;
const Router = dva.router;
const Route = dva.router;
const IndexRoute = dva.router;
const Link = dva.router;
import IndexPage from './routes/IndexPage';

export default function({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={IndexPage} />
    </Router>
  );
};
