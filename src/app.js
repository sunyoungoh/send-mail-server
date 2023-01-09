import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chalk from 'chalk';
import detectPort from 'detect-port';
import mongoose from 'mongoose';

import mail from './routes/mail.js';
import naver from './routes/naver.js';
import tenbyten from './routes/tenbyten.js';

import { tenbytenAutoSend } from './controllers/autoSend';

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

process.env.NODE_ENV =
  process.env.NODE_ENV &&
  process.env.NODE_ENV.trim().toLowerCase() == 'production'
    ? 'production'
    : 'development';
console.log(process.env.NODE_ENV);

// 텐바이텐 주문 자동 확인 및 발송
tenbytenAutoSend();

// Server start
app.listen(port, () =>
  console.log(
    `${chalk.white
      .bgHex('#41b883')
      .bold(`SEND-MAIL-SERVER IS RUNNING ON http://localhost:${port}`)}`
  )
);
