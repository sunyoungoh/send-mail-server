"use strict";

var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _chalk = _interopRequireDefault(require("chalk"));
var _detectPort = _interopRequireDefault(require("detect-port"));
var _mail = _interopRequireDefault(require("./routes/mail.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_dotenv.default.config();

// server setup
let port;
async function configServer() {
  port = process.env.PORT || (await (0, _detectPort.default)(process.env.PORT));
}
configServer();

// express setup
const app = (0, _express.default)();
app.use((0, _cors.default)());
app.use(_express.default.json());
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: true
}));

// api
app.use('/mail', _mail.default);
app.get('/', (req, res) => {
  res.send('send-mail-server 입니다!');
});

// start
app.listen(port, () => console.log(`${_chalk.default.white.bgHex('#41b883').bold(`SEND-MAIL-SERVER IS RUNNING ON http://localhost:${port}`)}`));