require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
import 'babel-polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {"keyword": ""};
	}

	render() {
		return (
			<div className="container">
				Hello, React!!
			</div>
		);
	}
}

const app = document.createElement('div');
document.body.appendChild(app);
ReactDOM.render(<App />, app);