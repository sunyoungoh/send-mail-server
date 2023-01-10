import chalk from 'chalk';
import axios from 'axios';
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from 'toad-scheduler';
import { getToday, getThreedaysAgo } from './../utils/getDays';

const instance = axios.create({
  baseURL: process.env.BASE_URL,
});

const scheduler = new ToadScheduler();

export const tenbytenAutoSend = () => {
  const task = new AsyncTask(
    'tenbyten order',
    async () => {
      const config = {
        params: {
          brandId: process.env.TT_ID,
          startdate: getThreedaysAgo(),
          enddate: getToday(),
        },
        headers: {
          Authorization: `bearer ${process.env.TT_APIKEY}`,
        },
      };

      // 신규 주문 확인
      const newOrder = await instance.get('/tenbyten/orders', config);
      console.log('신규 주문 내역', newOrder.data);

      // 배송 준비 중 주문 확인
      const data = await instance.get('/tenbyten/orders/ready', config);
      const readyOrder = data.data;
      console.log('배송 준비 중 주문 내역', readyOrder);
      console.log('data', data);
      console.log('readyOrder.length', readyOrder.length);
      // 배송 준비 중 주문이 있으면 메일 발송
      if (readyOrder.length) {
        const reg = /\S+@+\S+\.+[a-zA-Z]{2,3}/;
        readyOrder.map(async item => {
          // 주문메모에 이메일 있는지 체크
          const email = reg.test(item.itemRequireMemo)
            ? item.itemRequireMemo.match(reg)[0]
            : item.ordererEmail;

          // 메일 정보
          const mailData = {
            store: '텐바이텐/영로그',
            items: [
              {
                itemId: item.itemId,
                itemOption: item.itemOption,
              },
            ],
            toEmail: email,
          };
          // 메일 발송
          const { status } = await instance.post('mail', mailData);

          // 메일 발송 성공하면 송장 등록
          if (status == 200) {
            // 발송 등록 정보
            const dispatchData = {
              orderSerial: item.orderSerial,
              detailIdx: item.detailIdx,
              details: {
                ordererId: item.ordererId,
                detailIdx: item.detailIdx,
                ordererName: item.ordererName,
                toEmail: mailData.toEmail,
                itemId: item.itemId,
                itemOption: item.itemOption,
                requireMemo: item.itemRequireMemo,
                ordererPhone: item.ordererCellPhone,
                ordererEmail: item.ordererEmail,
                orderDate: item.orderDate,
                price: item.price,
              },
            };
            // 송장 등록
            const { data } = await instance.post(
              '/tenbyten/orders/orderconfirm',
              dispatchData,
              {
                headers: {
                  Authorization: `bearer ${process.env.TT_APIKEY}`,
                },
              }
            );
            console.log(
              `${chalk.white
                .bgHex('##ffdd61')
                .bold(`**자동발송 결과** ${data.code}`)}`
            );
          }
        });
      }
    },
    err => {
      console.log(err);
    }
  );

  const job = new SimpleIntervalJob({ minutes: 1 }, task);

  scheduler.addSimpleIntervalJob(job);
};
