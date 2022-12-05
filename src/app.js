import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chalk from 'chalk';
import detectPort from 'detect-port';
import mail from './routes/mail.js';

dotenv.config();
// server setup
let port;
async function configServer() {
  port = process.env.PORT || (await detectPort(process.env.PORT));
}
configServer();

// express setup
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/mail', mail);

app.get('/', (req, res) => {
  res.send('send-mail-server 입니다!');
});

// start
app.listen(port, () =>
  console.log(
    `${chalk.white
      .bgHex('#41b883')
      .bold(`SEND-MAIL-SERVER IS RUNNING ON http://localhost:${port}`)}`
  )
);
