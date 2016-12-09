import './index.html';
import './index.css';
import dva from 'dva';

// 1. Initialize
const app = dva();

// 2. Plugins
//app.use({});

var models = require("./models");
models(app);

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
