import './index.html';
import "./assets/_reset.scss";
import dva from "dva";

// 1. Initialize
import { browserHistory } from 'dva/router';


const app = dva({
    history: browserHistory,
});

require("./models")(app);

app.router(require('./router'));

app.start('#rootWrap');
