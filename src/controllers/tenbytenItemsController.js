import axios from 'axios';
import Order from '../models/OrderModel.js';

const instance = axios.create({
  baseURL: 'https://api.10x10.co.kr/v1',
});

/**
 * 등록된 전체 상품 조회
 * */
export const getItems = async (req, res) => {
  const { brandId, count } = req.query;
  const { authorization } = req.headers;

  try {
    const { data } = await instance.get('/items', {
      headers: {
        Authorization: authorization,
      },
      params: {
        pageNumber: count,
        brandId,
      },
    });
    res.status(200).json(data.outPutValue.items);
  } catch (error) {
    res.status(400).json(error);
  }
};

/**
 * 개별 상품 조회
 * */
export const getItem = async (req, res) => {
  const { itemId } = req.params;
  const { authorization } = req.headers;

  try {
    const { data } = await instance.get(`/items/${itemId}`, {
      headers: {
        Authorization: authorization,
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};

/**
 * 상품 수정
 * */
export const editItem = async (req, res) => {
  const { itemId, content } = req.body;
  const { authorization } = req.headers;

  try {
    const { data } = await instance.put(
      '/items',
      {
        itemID: itemId,
        ContentType: 'HTML',
        Content: content,
      },
      {
        headers: {
          Authorization: authorization,
        },
      }
    );
    res.status(200).json(data);
  } catch (error) {
    console.log(error.response.data);
    res.status(400).json({ message: error.response.data.message });
  }
};
