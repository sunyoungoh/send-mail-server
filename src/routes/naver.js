import { Router } from 'express';
import * as naverController from '../controllers/naverController';

const router = Router();

router.get('/orders', naverController.getNewOrders);
router.get('/orders/:orderId', naverController.getOrders);
router.get('/detail/:orderId', naverController.getOrderDetail);
router.get('/detail', naverController.getOrderDetail);
router.get('/orderer/:productOrderId', naverController.getOrdererNaverId);
router.post('/:orderId', naverController.dispatchProductOrders);

export default router;
