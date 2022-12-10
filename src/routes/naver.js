import { Router } from 'express';
import * as naverController from '../controllers/naverController';

const router = Router();

router.get('/orders/:orderId', naverController.getOrders);
router.get('/detail/:orderId', naverController.getOrderDetail);
router.post('/:orderId', naverController.dispatchProductOrders);

export default router;
