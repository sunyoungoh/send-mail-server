import { Router } from 'express';
import * as naverController from '../controllers/naverController';

const router = Router();

router.get('/:orderId', naverController.getOrderDetail);
router.post('/:orderId', naverController.dispatchProductOrders);

export default router;
