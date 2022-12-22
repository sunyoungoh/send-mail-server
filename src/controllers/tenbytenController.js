import axios from 'axios';
import Order from '../models/OrderModel.js';

const instance = axios.create({
  baseURL: 'https://api.10x10.co.kr/v2',
});

export const getBrandInfo = async (req, res) => {
  const { authorization } = req.headers;
  try {
    const { data } = await instance.get('/products/brandinfo', {
      headers: {
        Authorization: authorization,
      },
    });
    res.status(200).json(data.outPutValue[0]);
  } catch (error) {
    res.json(error);
  }
};

export const getNewOrders = async (req, res) => {
  const { brandId, startdate, enddate } = req.query;
  const { authorization } = req.headers;

  try {
    const { data } = await instance.get('/orders', {
      headers: {
        Authorization: authorization,
      },
      params: {
        brandId,
        startdate,
        enddate,
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.json(error);
  }
};

export const getReadyOrder = async (req, res) => {
  const { brandId, startdate, enddate } = req.query;
  const { authorization } = req.headers;
  try {
    const { data } = await instance.get('/orders/orderhistory', {
      headers: {
        Authorization: authorization,
      },
      params: {
        brandId,
        startdate,
        enddate,
      },
    });

    res.status(200).json(data);
  } catch (error) {
    res.json(error);
  }
};

export const dispatchOrder = async (req, res) => {
  const { orderSerial, detailIdx, details } = req.body;
  const { authorization } = req.headers;

  try {
    const { data } = await instance.post(
      '/orders/orderconfirm',
      {
        orderSerial: orderSerial,
        detailIdx: detailIdx,
        songjangDiv: '97', // 문자/이메일 발송 코드
        songjangNo: '0',
      },
      {
        headers: {
          Authorization: authorization,
        },
      }
    );
    const newOrder = new Order({
      orderSerial: orderSerial,
      ordererId: details.ordererId,
      ordererName: details.ordererName,
      toEmail: details.toEmail,
      itemId: details.itemId,
      itemOption: details.itemOption,
      requireMemo: details.requireMemo,
      ordererPhone: details.ordererPhone,
      ordererEmail: details.ordererEmail,
      orderDate: details.orderDate,
      price: details.price,
    });

    try {
      const savedOrder = await newOrder.save();
      console.log('발송 내역 등록 완료', savedOrder);
    } catch (error) {
      res.status(400).json({ message: error });
    }
    res.status(200).json(data);
  } catch (error) {
     res.status(400).json(error);
  }
};

export const getDispatchOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find().sort({
      orderDate: -1,
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(400).send('배송 완료된 주문 정보가 없습니다.');
  }
};
