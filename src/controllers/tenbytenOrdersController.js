import axios from 'axios';
import Order from '../models/OrderModel.js';
import { getDecodeKey } from '../utils/crypto.js';

const instance = axios.create({
  baseURL: 'https://api.10x10.co.kr/v2',
});

export const getBrandInfo = async (req, res) => {
  const { authorization } = req.headers;

  try {
    const {
      data: { outPutValue: brandInfo },
    } = await instance.get('/products/brandinfo', {
      headers: {
        Authorization: `bearer ${getDecodeKey(authorization)}`,
      },
    });

    console.log('텐바이텐 브랜드 정보 가져오기 성공', brandInfo[0]);
    res.status(200).json(brandInfo[0]);
  } catch (error) {
    console.log('텐바이텐 브랜드 정보 가져오기 실패', error.response.data);
    res.status(400).json(error);
  }
};

/**
 * detailIdx 단위로 주문 리스트 생성
 * */
const orderListBydetailIdx = orderList => {
  const newList = [];
  orderList.map(item => {
    item.details.map(detail => {
      let itemOption = detail.itemOptionName;
      // 이메일 기재옵션 삭제
      if (itemOption !== '') {
        const endIndex = itemOption.indexOf('꼭');
        if (endIndex !== -1) {
          itemOption = itemOption.substring(0, endIndex - 1);
        }
      }

      newList.push({
        orderSerial: item.OrderSerial,
        detailIdx: detail.DetailIdx,
        orderDate: item.orderDate,
        ordererId: item.UserId,
        ordererName: item.ordererName,
        ordererCellPhone: item.ordererCellPhone,
        ordererEmail: item.ordererEmail,
        itemId: detail.itemId,
        itemName: detail.itemName,
        itemOptionCode: detail.itemOption, // 옵션 코드
        itemOptionOrigin: detail.itemOptionName, // 옵션 내용 원본
        itemOption: itemOption, // 옵션 내용 한글 이메일 삭제
        itemRequireMemo: detail.RequireMemo.trim(),
        price: detail.NotCouponPrice,
      });
    });
  });
  return newList;
};

/**
 * 신규 주문 조회
 * */
export const getNewOrders = async (req, res) => {
  const { brandId, startdate, enddate } = req.query;
  const { authorization } = req.headers;

  try {
    const {
      data: { outPutValue: newOrders },
    } = await instance.get('/orders', {
      headers: {
        Authorization: `bearer ${getDecodeKey(authorization)}`,
      },
      params: {
        brandId,
        startdate,
        enddate,
      },
    });
    const orderList = orderListBydetailIdx(newOrders);
    res.status(200).json(orderList);
  } catch (error) {
    res.json(error);
  }
};

/**
 * 배송 준비 중 주문
 * */
export const getReadyOrder = async (req, res) => {
  const { brandId, startdate, enddate } = req.query;
  const { authorization } = req.headers;

  try {
    const {
      data: { outPutValue: readyOrders },
    } = await instance.get('/orders/orderhistory', {
      headers: {
        Authorization: `bearer ${getDecodeKey(authorization)}`,
      },
      params: {
        brandId,
        startdate,
        enddate,
      },
    });

    const orderList = orderListBydetailIdx(readyOrders);
    res.status(200).json(orderList);
  } catch (error) {
    res.json(error);
  }
};

/**
 * 발송하기 + 운송장 등록
 * */
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
          Authorization: `bearer ${getDecodeKey(authorization)}`,
        },
      }
    );

    const newOrder = new Order({
      orderSerial: orderSerial,
      detailIdx: detailIdx,
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
      console.log('발송 내역 DB 등록 완료', savedOrder);
    } catch (error) {
      res.status(400).json({ message: error });
    }
    console.log('송장 등록 결과', data.code);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};

/**
 * 발송 완료 주문 리스트
 * */
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

/**
 * 고객 문의 조회
 * */
export const getQna = async (req, res) => {
  const { brandId, startdate, enddate } = req.query;
  const { authorization } = req.headers;

  try {
    const { data } = await instance.get('/qna/myqna', {
      headers: {
        Authorization: `bearer ${getDecodeKey(authorization)}`,
      },
      params: {
        brandId,
        startdate,
        enddate,
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};

/**
 * 고객 문의 답변하기
 * */
export const anwserQna = async (req, res) => {
  const body = req.body;
  const { authorization } = req.headers;

  try {
    const { data } = await instance.post('/qna/myqna', body, {
      headers: {
        Authorization: `bearer ${getDecodeKey(authorization)}`,
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};

/**
 * MYTT용 송장등록
 * */
export const onlyDispatchOrder = async (req, res) => {
  const { orderSerial, detailIdx } = req.body;
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
          Authorization: `bearer ${getDecodeKey(authorization)}`,
        },
      }
    );
    console.log('송장 등록 결과', data.code);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};
