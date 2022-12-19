import bcrypt from 'bcrypt';
import axios from 'axios';

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

export const getOrderDetail = async (req, res) => {
  const token = await createToken();
  const { orderId } = req.params;
  const productOrderIds = { productOrderIds: [orderId] };

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

    const optionStr = data.data[0].productOrder.productOption;
    if (optionStr) {
      let optionArr = optionStr.split('/');
      optionArr = optionArr.map(item => {
        item = item.replaceAll(' ', '');
        const startIndex = item.indexOf(':');
        return item.substring(startIndex + 1, item.length);
      });
    }

    const orderDetail = {
      productOrderId: data.data[0].productOrder.productOrderId,
      productId: Number(data.data[0].productOrder.productId),
      productOption: optionStr ? optionArr : '',
    };
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
    await instance.post(
      '/external/v1/pay-order/seller/product-orders/dispatch',
      postData,
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );
    res.status(200).send('송장 등록을 성공하였습니다.');
  } catch (error) {
    console.log(error);
  }
};
