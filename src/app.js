import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chalk from 'chalk';
import detectPort from 'detect-port';
import mongoose from 'mongoose';

import mail from './routes/mail.js';
import naver from './routes/naver.js';
import tenbyten from './routes/tenbyten.js';

import { tenbytenAutoSend, naverAutoSend } from './controllers/autoSend';
import { tenbytenDailyReport } from './controllers/dailyReportController';

dotenv.config();

// server setup
let port;
async function configServer() {
  port = process.env.PORT || (await detectPort(process.env.PORT));
}
configServer();

// mongo db
const db = mongoose.connection;
mongoose.set('strictQuery', true);
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;

// express setup
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/mail', mail);
app.use('/naver', naver);
app.use('/tenbyten', tenbyten);

app.get('/', (req, res) => {
  res.send('send-mail-server 입니다!');
});

// Server start
app.listen(port, () =>
  console.log(
    `${chalk.white
      .bgHex('#a383e9')
      .bold(`SEND-MAIL-SERVER IS RUNNING ON ${process.env.BASE_URL}`)}`
  )
);

// 텐바이텐, 네이버 주문 자동 확인 및 발송
setTimeout(() => {
  console.log(
    `${chalk.white
      .bgHex('#ff9fd3')
      .bold(
        `${new Date().toLocaleTimeString(
          'ko-kr'
        )} | =========== 자동발송 시작! ===========`
      )}`
  );
  tenbytenAutoSend();
  naverAutoSend();
  tenbytenDailyReport();
}, 2000);
