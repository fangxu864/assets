import './index.html';
import "./assets/_reset.scss";
import dva from "dva";

// 1. Initialize
import { browserHistory } from 'dva/router';
const app = dva({
    history: browserHistory,
});
// 2. Plugins
//app.use({});

// 3. Model
//app.model(require('./models/example'));
require("./models")(app);

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#rootWrap');
