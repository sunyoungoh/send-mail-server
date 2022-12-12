import { Router } from 'express';
import * as tenbytenController from '../controllers/tenbytenController';

const router = Router();

router.get('/brandinfo', tenbytenController.getBrandInfo);
router.get('/orders', tenbytenController.getNewOrders);
router.get('/orders/orderhistory', tenbytenController.getOrderHistory);
router.post('/orders/orderconfirm', tenbytenController.dispatchOrder);

export default router;
