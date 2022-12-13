import axios from 'axios';

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

export const getOrderHistory = async (req, res) => {
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
  const body = req.body;
  const { authorization } = req.headers;

  try {
    const { data } = await instance.post('/orders/orderconfirm', body, {
      headers: {
        Authorization: authorization,
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.json(error);
  }
};
