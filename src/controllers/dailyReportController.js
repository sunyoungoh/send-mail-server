import dotenv from 'dotenv';
import axios from 'axios';
const schedule = require('node-schedule');
const TelegramBot = require('node-telegram-bot-api');

dotenv.config();

const instance = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    'Accept-Encoding': '*',
  },
});

/**
 * 데일리 리포트 텔레그램 발송
 */
const pushTelegram = (count, amount) => {
 const amountWithComma = amount.toLocaleString('ko-KR');
 
  const msg = `<b>📮 이번달 판매량 일일 리포트 📮</b>\n
  - 총 주문개수: ${count}
  - 총 판매금액: ${amountWithComma}원`;

  const token = process.env.TELE_BOT_TOKEN;
  const chatId = process.env.TELE_CHAT_ID;
  const telebot = new TelegramBot(token);
  telebot.sendMessage(chatId, msg, { parse_mode: 'HTML' });
};

/**
 * 텐바이텐 데일리 리포트 (월별판매액)
 */
export const tenbytenDailyReport = () => {
  const job = schedule.scheduleJob(
    '0 0 21 * * *',
    async () => {
      // 판매 내역 DB 데이터 받아오기
      const { data } = await instance.get('/tenbyten/orders/orderconfirm');

      // 월별 판매내역 리스트
      const today = new Date();
      const monthlyOrderList = data.filter(
        item =>
          new Date(item.orderDate).getMonth() == today.getMonth() &&
          new Date(item.orderDate).getFullYear() == today.getFullYear()
      );

      // 판매개수
      const monthlyOrderListCount = monthlyOrderList.length;

      // 판매금액 총합 구하기
      const amount = monthlyOrderListCount
        ? monthlyOrderList
            .map(item => item.price)
            .reduce((prev, curr) => prev + curr)
        : 0;

      // 텔레그램으로 전송
      pushTelegram(monthlyOrderListCount, amount);

      err => {
        console.error(err);
      };
    }
  );
};
