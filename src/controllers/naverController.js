import bcrypt from 'bcrypt';
import axios from 'axios';
import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

const instance = axios.create({
  baseURL: 'https://api.commerce.naver.com',
});

const fetchClientData = async (req, res) => {
  // 전자서명 발급
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const timestamp = new Date().getTime();
  const password = `${clientId}_${timestamp}`;
  const hashed = bcrypt.hashSync(password, clientSecret);
  const clientSecretSign = Buffer.from(hashed, 'utf-8').toString('base64');

  return {
    client_id: clientId,
    timestamp: timestamp,
    client_secret_sign: clientSecretSign,
    grant_type: 'client_credentials', // 고정값
    type: 'SELF',
  };
};

const createToken = async (req, res) => {
  const clientData = await fetchClientData();
  try {
    const { data } = await instance.post(
      '/external/v1/oauth2/token',
      clientData,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    return `Bearer ${data.access_token}`;
  } catch (error) {
    console.log(error);
  }
};

export const getOrders = async (req, res) => {
  const token = await createToken();
  const { orderId } = req.params;
  try {
    const { data } = await instance.get(
      `/external/v1/pay-order/seller/orders/${orderId}/product-order-ids`,
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );
    res.status(200).json({ productOrderIds: data.data });
  } catch (error) {
    res.status(400).send('주문 정보를 조회할 수 없습니다.');
  }
};

// export const getOrderDetail = async (req, res) => {
//   const token = await createToken();
//   const { orderId } = req.params;
//   const productOrderIds = { productOrderIds: [orderId] };

//   try {
//     const { data } = await instance.post(
//       '/external/v1/pay-order/seller/product-orders/query',
//       productOrderIds,
//       {
//         headers: {
//           Authorization: token,
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//     const optionStr = data.data[0].productOrder.productOption;
//     let optionArr = '';
//     if (optionStr) {
//       optionArr = optionStr.split('/').map(item => {
//         item = item.replaceAll(' ', '');
//         const startIndex = item.indexOf(':');
//         return item.substring(startIndex + 1, item.length);
//       });
//     }

//     const orderDetail = {
//       ordererId: data.data[0].order.ordererId,
//       ordererName: data.data[0].order.ordererName,
//       productOrderId: data.data[0].productOrder.productOrderId,
//       productId: Number(data.data[0].productOrder.productId),
//       productOption: optionArr,
//       shippingMemo: data.data[0].productOrder.shippingMemo,
//     };

//     res.status(200).json(orderDetail);
//   } catch (error) {
//     console.log(error);
//     res.status(400).send('상품 주문 정보를 조회할 수 없습니다.');
//   }
// };

export const getOrderDetail = async (req, res) => {
  const token = await createToken();
  const { productOrderId } = req.query;

  const productOrderIds = { productOrderIds: productOrderId };

  try {
    const { data } = await instance.post(
      '/external/v1/pay-order/seller/product-orders/query',
      productOrderIds,
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );
    const orderList = data.data;
    const orderDetail = orderList.map(item => {
      const optionStr = item.productOrder.productOption;
      let options = '';
      if (optionStr) {
        options = optionStr.split('/').map(item => {
          item = item.replaceAll(' ', '');
          const startIndex = item.indexOf(':');
          return item.substring(startIndex + 1, item.length);
        });
      }
      options = Array.isArray(options) ? options.join() : options;
      return {
        orderId: item.order.orderId, // 주문번호
        paymentDate: item.order.paymentDate,
        ordererId: item.order.ordererId,
        ordererName: item.order.ordererName,
        items: {
          productOrderId: item.productOrder.productOrderId, // 상품주문번호
          itemId: Number(item.productOrder.productId), // 상품번호
          itemOption: options, // 옵션
        },
        shippingMemo: item.productOrder.shippingMemo,
      };
    });

    res.status(200).json(orderDetail);
  } catch (error) {
    console.log(error);
    res.status(400).send('상품 주문 정보를 조회할 수 없습니다.');
  }
};

export const dispatchProductOrders = async (req, res) => {
  const token = await createToken();
  const { orderId } = req.params;

  const now = new Date();
  const postData = {
    dispatchProductOrders: [
      {
        productOrderId: orderId,
        deliveryMethod: 'DIRECT_DELIVERY',
        deliveryCompanyCode: '',
        trackingNumber: '',
        dispatchDate: now,
      },
    ],
  };

  try {
    const { data } = await instance.post(
      '/external/v1/pay-order/seller/product-orders/dispatch',
      postData,
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(data);
    res.status(200).send('송장 등록을 성공하였습니다.');
  } catch (error) {
    console.log(error);
  }
};

export const getNewOrders = async (req, res) => {
  const token = await createToken();
  // productOrderStatus 상품주문상태 - PAYED 결제완료
  const now = new Date(); // 현재 날짜 및 시간
  const yesterday = new Date(now.setDate(now.getDate() - 1)); // 어제
  const payedOrders = [];

  try {
    const payed = await instance.get(
      `/external/v1/pay-order/seller/product-orders/last-changed-statuses`,
      {
        params: {
          lastChangedFrom: yesterday,
          lastChangedType: 'PAYED',
        },
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );
    const addressChanged = await instance.get(
      `/external/v1/pay-order/seller/product-orders/last-changed-statuses`,
      {
        params: {
          lastChangedFrom: yesterday,
          lastChangedType: 'DELIVERY_ADDRESS_CHANGED',
        },
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );

    if (payed.data.data) {
      payedOrders.push(...payed.data.data.lastChangeStatuses);
    }
    if (addressChanged.data.data) {
      payedOrders.push(...addressChanged.data.data.lastChangeStatuses);
    }
    res.status(200).json(payedOrders);
  } catch (error) {
    res.status(400).send('신규 주문 정보를 조회할 수 없습니다.');
  }
};

export const gerOrdererNaverId = async (req, res) => {
  const { productOrderId } = req.params;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  const commerce_id = process.env.COMMERCE_ID;
  const commerce_pw = process.env.COMMERCE_PW;

  await page.goto(
    'https://accounts.commerce.naver.com/login?url=https%3A%2F%2Fsell.smartstore.naver.com%2F%23%2Flogin-callback'
  );

  // id, pw input 찾기
  await page.waitForSelector('input[type="text"]');
  await page.waitForSelector('input[type="password"]');

  // id, pw 입력
  await page.type('input[type="text"]', commerce_id);
  await page.type('input[type="password"]', commerce_pw);
  await page.keyboard.press('Enter');

  // 주문서 페이지로 이동
  await page.waitForNavigation({
    waitUntil: 'networkidle0',
  });
  await page.goto(
    `https://sell.smartstore.naver.com/o/v3/manage/order/popup/${productOrderId}/productOrderDetail`
  );

  // 주문서 html정보를 로드
  const content = await page.content();
  const $ = cheerio.load(content);
  const lists = $('td._2mspXbAQGz');
  const id = $(lists[1]).text();
  console.log('id', id);
  await browser.close();

  if (id) {
    res.status(200).json({ ordererId: id });
  } else {
    res.status(400).send('주문자의 아이디를 찾을 수 없습니다.');
  }
};
