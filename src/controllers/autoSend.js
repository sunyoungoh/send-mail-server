import chalk from 'chalk';
import dotenv from 'dotenv';
import axios from 'axios';
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from 'toad-scheduler';
import { getToday, getThreedaysAgo } from './../utils/getDays';
import { getEncodeKey } from '../utils/crypto.js';

dotenv.config();

const instance = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    'Accept-Encoding': '*',
  },
});

const scheduler = new ToadScheduler();

/**
 * 배송메모에서 이메일 있으면 이메일 반환 / 없으면 주문자 이메일 반환
 * @param {string} shippingMemo - 배송메모
 * @param {string} ordererEmail - 주문자 이메일
 * @returns {string} email
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
 * @param {object} orderInfo - 주문정보
 */
const sendMail = async (store, items, toEmail, orderInfo) => {
  const mailData = {
    store: store,
    items: items,
    toEmail: toEmail,
    autoSend: true,
    orderInfo: {
      ordererName: orderInfo.ordererName,
      shippingMemo: orderInfo.shippingMemo || 'X',
      paymentDate: new Date(orderInfo.paymentDate).toLocaleString('ko-kr'),
    },
  };
  const res = await instance.post('/mail', mailData);
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
        `** ${store} 자동 발송 결과 : ${ordererName}님 메일 전송 ${result} **`
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
      const encodeKey = getEncodeKey(process.env.TT_APIKEY);
      const config = {
        params: {
          brandId: process.env.TT_ID,
          startdate: getThreedaysAgo(),
          enddate: getToday(),
        },
        headers: {
          Authorization: encodeKey,
        },
      };

      // 신규 주문 확인
      await instance.get('/tenbyten/orders', config);

      // 배송 준비 중 주문 확인
      const { data } = await instance.get('/tenbyten/orders/ready', config);
      const readyOrder = data;

      readyOrder.length &&
        (console.log(
          `==== 텐바이텐 배송 준비 중 주문 <${readyOrder.length}>건 ====`
        ),
        console.log('텐바이텐 배송 준비 중 주문 내역', readyOrder));

      // 배송 준비 중 주문이 있으면 메일 발송
      if (readyOrder.length) {
        readyOrder.map(async item => {
          console.log(item);
          const email = getEmail(item.itemRequireMemo, item.ordererEmail);
          const itemInfo = [
            {
              itemId: item.itemId,
              itemOption: item.itemOption,
            },
          ];
          // 메일 발송
          const { status } = await sendMail(
            '텐바이텐/영로그',
            itemInfo,
            email,
            {
              ordererName: item.ordererName,
              shippingMemo: item.itemRequireMemo,
              paymentDate: item.orderDate,
            }
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
                toEmail: email,
                itemId: item.itemId,
                itemOption: item.itemOption,
                requireMemo: item.itemRequireMemo,
                ordererPhone: item.ordererCellPhone,
                ordererEmail: item.ordererEmail,
                orderDate: new Date(item.orderDate),
                price: item.price,
              },
            };
            // 송장 등록
            const { data } = await instance.post(
              '/tenbyten/orders/orderconfirm',
              dispatchData,
              {
                headers: {
                  Authorization: encodeKey,
                },
              }
            );
            sendResultLog(
              '#ffdd61',
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

  const tenbytenJob = new SimpleIntervalJob({ minutes: 10 }, tenbytenTask);
  scheduler.addSimpleIntervalJob(tenbytenJob);
};

/**
 * 네이버 주문번호(orderId)별 주문 리스트 생성
 *  @param {object[]} orderList - 주문 리스트 (productOrderId별로 각각 나눠져있음)
 */
const createOrderListByOrderId = orderList => {
  // 주문번호를 키값으로 객체 생성
  const groupedObj = orderList.reduce((obj, order) => {
    obj[order.orderId] = obj[order.orderId] || [];
    obj[order.orderId].push(order);
    return obj;
  }, {});

  // 배열로 변환
  const groupedArr = Object.keys(groupedObj).map(key => {
    return { orderId: key, orderInfo: groupedObj[key] };
  });

  // 주문번호로 묶은 orderList 생성
  const uniOrderList = groupedArr.map(order => {
    const items = [];
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

/**
 * 네이버 주문 자동 확인 발송
 */
export const naverAutoSend = () => {
  const naverTask = new AsyncTask(
    'naver order',
    async () => {
      // 신규 주문 확인
      const { data: newOrder } = await instance.get('/naver/orders/new');
      newOrder.length &&
        console.log(`==== 네이버 신규 주문 <${newOrder.length}>건 ====`);

      // 신규 주문 있으면 주문 상세내역 조회 후 메일 발송
      if (newOrder.length) {
        // 상품 주문번호 맵 생성
        const productOrderIds = newOrder.map(item => item.productOrderId);

        // 상품 주문 상세내역 조회
        const { data: orderList } = await instance.get('/naver/detail', {
          params: { productOrderId: productOrderIds },
        });
        console.log('상품 주문 상새내역 조회 리스트', orderList);

        if (orderList.length) {
          // 주문번호별 주문 리스트 생성
          const uniOrderList = createOrderListByOrderId(orderList);
          uniOrderList.map(async item => {
            // 주문메모에서 이메일 양식만 가져오기
            let email = getEmail(item.shippingMemo, '');
            //  아이디가 없고 개발모드면 아이디 크롤링하여 이메일 조회
            if (email == '' && process.env.NODE_ENV == 'development') {
              console.log('배송메모가 없으므로 이메일을 크롤링합니다.');
              const {
                data: { ordererId },
              } = await instance.get(
                `/naver/orderer/${item.items[0].productOrderId}`
              );
              // 주문자 아이디 크롤링 성공 시
              if (ordererId) {
                email = `${ordererId}@naver.com`;
              }
              console.log('크롤링한 이메일', email);
            }

            // 배송메모 이메일이나 크롤링 이메일이 확인되면 메일 발송
            if (email) {
              // 메일 발송
              const { status } = await sendMail('영로그', item.items, email, {
                ordererName: item.ordererName,
                shippingMemo: item.shippingMemo,
                paymentDate: item.paymentDate,
              });
              // 메일 발송 성공하면 송장 등록
              if (status == 200) {
                let dispatchResult = '';
                // 상품이 하나일 때
                if (item.items.length == 1) {
                  const { status } = await instance.post(
                    `/naver/dispatch/${item.items[0].productOrderId}`
                  );
                  dispatchResult = status == 200 ? 'success' : 'error';
                } else {
                  // 상품이 여러개일 때
                  const dispatchResults = await Promise.all(
                    item.items.map(async item => {
                      const { status } = await instance.post(
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

  const naverJob = new SimpleIntervalJob({ minutes: 2 }, naverTask);
  scheduler.addSimpleIntervalJob(naverJob);
};
