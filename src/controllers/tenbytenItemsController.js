import axios from 'axios';
import { getDecodeKey } from '../utils/crypto.js';

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
        Authorization: `bearer ${getDecodeKey(authorization)}`,
      },
      params: {
        pageNumber: count,
        brandId,
      },
    });
    res.status(200).json(data.outPutValue.items);
  } catch (error) {
    // console.log(error);
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
        Authorization: `bearer ${getDecodeKey(authorization)}`,
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
export const updateItemInfo = async (req, res) => {
  const { itemId, content, division, productionDay, size, sizeUnit, material } =
    req.body;
  const { authorization } = req.headers;

  try {
    const { data } = await instance.put(
      '/items',
      {
        itemID: itemId,
        ContentType: 'HTML+TEXT',
        Content: content,
        Division: division,
        ProductionDay: productionDay,
        Size: size,
        SizeUnit: sizeUnit,
        Material: material,
      },
      {
        headers: {
          Authorization: `bearer ${getDecodeKey(authorization)}`,
        },
      }
    );
    res.status(200).json(data);
  } catch (error) {
    console.log(error.response.data);
    res.status(400).json({ message: error.response.data.message });
  }
};

/**
 * 상품 판매상태 업데이트
 * */
export const updateItemStatus = async (req, res) => {
  const { itemId, brandId, sellYN } = req.body;
  const { authorization } = req.headers;

  try {
    const { data } = await instance.put(
      '/items/salestatus',
      {
        itemId: itemId,
        brandId: brandId,
        sellYN: sellYN,
      },
      {
        headers: {
          Authorization: `bearer ${getDecodeKey(authorization)}`,
        },
      }
    );
    res.status(200).json(data);
  } catch (error) {
    console.log(error.response.data);
    res.status(400).json({ message: error.response.data.message });
  }
};

/**
 * 상품 상세 이미지 업데이트
 * */
export const updateItemImages = async (req, res) => {
  const { itemId, colorCode, images } = req.body;
  const { authorization } = req.headers;
  console.log(images);
  try {
    const { data } = await instance.put(
      '/items/images',
      {
        itemid: itemId,
        colorCode: colorCode,
        ...images,
      },
      {
        headers: {
          Authorization: `bearer ${getDecodeKey(authorization)}`,
        },
      }
    );
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.log(error.response.data);
    res.status(400).json({ message: error.response.data.message });
  }
};

/**
 * 승인 대기상품 조회
 * */
export const getWaitItems = async (req, res) => {
  const { brandId } = req.query;
  const { authorization } = req.headers;

  try {
    const { data } = await instance.get('/waitItems', {
      headers: {
        Authorization: `bearer ${getDecodeKey(authorization)}`,
      },
      params: {
        stateCode: 1,
        pageNumber: 1,
        brandId,
      },
    });
    res.status(200).json(data.outPutValue.items);
  } catch (error) {
    res.status(400).json(error);
  }
};

/**
 * 승인 대기 상품 개별 조회
 * */
export const getWaitItem = async (req, res) => {
  const { waitId } = req.params;
  const { authorization } = req.headers;

  try {
    const { data } = await instance.get(`/waitItems/${waitId}`, {
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
 * 승인 대기 상품 수정
 * */
export const updateWaitItem = async (req, res) => {
  const updateData = req.body;
  const { authorization } = req.headers;

  try {
    const { data } = await instance.put('/waitItems', updateData, {
      headers: {
        Authorization: `bearer ${getDecodeKey(authorization)}`,
      },
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error.response.data);
    res.status(400).json({ message: error.response.data.message });
  }
};
