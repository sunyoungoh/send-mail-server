import chalk from 'chalk';
import axios from 'axios';
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from 'toad-scheduler';
import { getToday, getThreedaysAgo } from './../utils/getDays';

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV == 'production'
      ? process.env.BASE_URL
      : 'http://localhost:3000',
});

const scheduler = new ToadScheduler();

/**
 * 배송메모에서 이메일 있으면 이메일 반환 / 없으면 주문자 이메일 반환
 * @param {string} shippingMemo - 배송메모
 * @param {string} ordererEmail - 주문자 이메일
 * @returns
 */
const getEmail = (shippingMemo, ordererEmail) => {
  const reg = /\S+@+\S+\.+[a-zA-Z]{2,3}/;
  return reg.test(shippingMemo) ? shippingMemo.match(reg)[0] : ordererEmail;
};

/**
 * 메일 발송
 * @param {string} store - 입점처
 * @param {object[]} items - 파일 정보
 * @param {string} toEmail - 빋는 사람
 */
const sendMail = async (store, items, toEmail) => {
  const mailData = { store: store, items: items, toEmail: toEmail };
  const res = await instance.post('mail', mailData);
  return res;
};

/**
 * 메일 전송 결과 chalk로 console.log 출력
 * @param {string} color - 배경색
 * @param {string} store - 입점처
 * @param {string} ordererName - 주문자
 * @param {string} result - 전송결과
 */
const sendResultLog = (color, store, ordererName, result) => {
  console.log(
    `${chalk.white
      .bgHex(color)
      .bold(
        `** ${store} 자동 발송 결과 : ${ordererName}님 메일 전송 ${result}**`
      )}`
  );
};

/**
 * 텐바이텐 주문 자동 확인 발송
 */
export const tenbytenAutoSend = () => {
  const tenbytenTask = new AsyncTask(
    'tenbyten order',
    async () => {
      const token = `bearer ${process.env.TT_APIKEY}`;
      const config = {
        params: {
          brandId: process.env.TT_ID,
          startdate: getThreedaysAgo(),
          enddate: getToday(),
        },
        headers: {
          Authorization: token,
        },
      };

      // 신규 주문 확인
      const newOrder = await instance.get('/tenbyten/orders', config);
      console.log(`텐바이텐 신규 주문 내역 ${newOrder.data.length}건`);

      // 배송 준비 중 주문 확인
      const { data } = await instance.get('/tenbyten/orders/ready', config);
      const readyOrder = data;
      console.log('텐바이텐 배송 준비 중 주문 내역', readyOrder);

      // 배송 준비 중 주문이 있으면 메일 발송
      if (readyOrder.length) {
        readyOrder.map(async item => {
          const email = getEmail(item.itemRequireMemo, item.ordererEmail);
          // 메일 발송
          const { status } = await sendMail(
            '텐바이텐/영로그',
            [
              {
                itemId: item.itemId,
                itemOption: item.itemOption,
              },
            ],
            email
          );
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
                  Authorization: token,
                },
              }
            );
            sendResultLog(
              '#fc5f7b',
              '텐바이텐',
              dispatchData.details.ordererName,
              data.code
            );
          }
        });
      }
    },
    err => {
      console.error(err);
    }
  );

  const tenbytenJob = new SimpleIntervalJob({ minutes: 15 }, tenbytenTask);
  scheduler.addSimpleIntervalJob(tenbytenJob);
};

/**
 * 네이버 주문번호(orderId)별 주문 리스트 생성
 *  @param {object[]} orderList - 주문 리스트 (productOrderId별로 각각 나눠져있음)
 */
const createOrderListByOrderId = orderList => {
  // 주문번호를 키값으로 객체 생성
  var groupedObj = orderList.reduce((obj, order) => {
    obj[order.orderId] = obj[order.orderId] || [];
    obj[order.orderId].push(order);
    return obj;
  }, {});
  // 배열로 변환
  var groupedArr = Object.keys(groupedObj).map(function (key) {
    return { orderId: key, orderInfo: groupedObj[key] };
  });
  // 주문번호로 묶은 orderList 생성
  const uniOrderList = groupedArr.map(order => {
    let items = [];
    order.orderInfo.map(item => items.push(item.items));
    return {
      orderId: order.orderId,
      paymentDate: order.orderInfo[0].paymentDate,
      items: items,
      ordererId: order.orderInfo[0].ordererId,
      ordererName: order.orderInfo[0].ordererName,
      shippingMemo: order.orderInfo[0].shippingMemo,
    };
  });
  return uniOrderList;
};

export const naverAutoSend = () => {
  const naverTask = new AsyncTask(
    'naver order',
    async () => {
      // 신규 주문 확인
      const { data } = await instance.get('/naver/orders/new');
      const newOrder = data;
      console.log(`네이버 신규 주문 ${newOrder.length}건`);

      // 신규 주문 있으면 주문 상세내역 조회 후 메일 발송
      if (newOrder.length) {
        // 상품 주문번호 맵 생성
        const productOrderIds = newOrder.map(item => item.productOrderId);
        // 상품 주문 상세내역 조회
        let orderList = await instance.get('/naver/detail', {
          params: { productOrderId: productOrderIds },
        });
        orderList = orderList.data;
        console.log('상품 주문 상새내역 조회 리스트', orderList);

        if (orderList.length) {
          // 주문번호별 주문 리스트 생성
          const uniOrderList = createOrderListByOrderId(orderList);

          uniOrderList.map(async item => {
            const email = getEmail(item.shippingMemo, '');
            // 배송메모에 이메일이 있으면 메일 발송 (없을 경우엔 프론트에서 직접 확인 후 발송)
            if (email) {
              // 메일 발송
              const { status } = await sendMail('영로그', item.items, email);
              // 메일 발송 성공하면 송장 등록
              if (status == 200) {
                let dispatchResult = '';
                if (item.items.length == 1) {
                  let { status } = await instance.post(
                    `/naver/dispatch/${item.items[0].productOrderId}`
                  );
                  dispatchResult = status == 200 ? 'success' : 'error';
                } else {
                  // 상품이 여러개일때
                  let dispatchResults = await Promise.all(
                    item.items.map(async item => {
                      let { status } = await instance.post(
                        `/naver/dispatch/${item.productOrderId}`
                      );
                      return status;
                    })
                  );
                  dispatchResult = dispatchResults.every(val => val == 200)
                    ? 'success'
                    : 'error';
                }
                sendResultLog(
                  '#4ab63e',
                  '네이버',
                  item.ordererName,
                  dispatchResult
                );
              }
            }
          });
        }
      }
    },
    err => {
      console.error(err);
    }
  );

  const naverJob = new SimpleIntervalJob({ minutes: 15 }, naverTask);
  scheduler.addSimpleIntervalJob(naverJob);
};
